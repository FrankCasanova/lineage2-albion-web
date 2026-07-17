import os
import re
import socket
import sys
import time
from datetime import datetime, timedelta, timezone

import bcrypt
import pymysql
import jwt
from fastapi import FastAPI, HTTPException, Depends, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

SECRET_KEY = os.getenv("JWT_SECRET", "l2-albion-portal-secret-change-me-to-32b+")
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 72
GS_HOST = os.getenv("GS_HOST", "192.168.0.16")
GS_PORT = int(os.getenv("GS_PORT", "7777"))

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", "3306")),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASS", "root"),
    "database": os.getenv("DB_NAME", "acis"),
    "charset": "utf8mb4",
}

def get_db():
    return pymysql.connect(**DB_CONFIG)

# Item id -> name, loaded once from the datapack XMLs (optional, env-driven).
# Lets the admin UI show real names instead of raw ids. Empty if not configured.
ITEM_NAMES = {}


def _load_item_names() -> None:
    import xml.etree.ElementTree as ET

    base = os.getenv("ITEM_XML_DIR", "")
    if not base or not os.path.isdir(base):
        return
    for fn in os.listdir(base):
        if not fn.endswith(".xml"):
            continue
        try:
            root = ET.parse(os.path.join(base, fn)).getroot()
        except Exception:
            continue
        for it in root.iter("item"):
            iid = it.get("id")
            name = it.get("name")
            if iid and name:
                try:
                    ITEM_NAMES[int(iid)] = name
                except ValueError:
                    pass


_load_item_names()

CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:20201,http://localhost:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ponytail: inline class map — one object, no file, no DB query
CLASS_NAMES = {
    0: "Human Fighter", 1: "Human Warrior", 2: "Human Knight", 3: "Human Elder",
    4: "Human Paladin", 5: "Human Dark Knight", 6: "Human Duelist",
    7: "Human Dreadnought", 8: "Human Phoenix Knight", 9: "Human Hell Knight",
    10: "Human Sagittarius", 11: "Human Adventurer", 12: "Human Archmage",
    13: "Human Soultaker", 14: "Human Spellsinger", 15: "Human Evangelist",
    16: "Elf Fighter", 17: "Elf Warrior", 18: "Elf Knight", 19: "Elf Elder",
    20: "Elf Oracle", 21: "Elf Cleric", 22: "Elf Enchanter",
    23: "Elf Sword Singer", 24: "Elf Silver Ranger", 25: "Elf Spellhowler",
    26: "Elf Shillien Elder", 27: "Elf Shillien Oracle",
    28: "Dark Elf Fighter", 29: "Dark Elf Warrior", 30: "Dark Elf Knight",
    31: "Dark Elf Elder", 32: "Dark Elf Assassin", 33: "Dark Elf Assassin",
    34: "Dark Elf Bladedancer", 35: "Dark Elf Phantom Ranger",
    36: "Dark Elf Spellhowler", 37: "Dark Elf Shillien Elder",
    38: "Dark Elf Shillien Oracle", 39: "Orc Fighter", 40: "Orc Warrior",
    41: "Orc Knight", 42: "Orc Elder", 43: "Orc Monk", 44: "Orc Elder",
    45: "Orc Overlord", 46: "Orc Warcryer", 47: "Dwarf Fighter",
    48: "Dwarf Warrior", 49: "Dwarf Knight", 50: "Dwarf Elder",
    51: "Dwarf Bounty Hunter", 52: "Dwarf Artisan", 53: "Dwarf Warsmith",
    88: "Duelist", 89: "Dreadnought", 90: "Phoenix Knight",
    91: "Hell Knight", 92: "Sagittarius", 93: "Adventurer",
    94: "Archmage", 95: "Soultaker", 96: "Spellsinger", 97: "Evangelist",
    99: "Sword Singer", 100: "Silver Ranger", 101: "Spellhowler",
    102: "Shillien Elder", 103: "Shillien Oracle",
    104: "Plague Doctor", 105: "Fortune Seeker",
    106: "Maestro", 107: "Doomcryer",
}


def now_ms() -> int:
    return int(time.time())


def create_token(portal_user_id: int) -> str:
    payload = {
        "sub": str(portal_user_id),
        "exp": datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HOURS),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(request: Request) -> int:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    try:
        payload = jwt.decode(auth[7:], SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload["sub"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


class RegisterRequest(BaseModel):
    email: str
    password: str
    confirm_password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class CreateGameAccountRequest(BaseModel):
    login: str
    password: str
    confirm_password: str


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str


class GiveItemRequest(BaseModel):
    item_id: int
    count: int = 1
    enchant_level: int = 0
    loc: str = "INVENTORY"


# ponytail: admin may drop items into a character's personal inventory or warehouse
ALLOWED_LOCS = {"INVENTORY", "WAREHOUSE"}


def user_is_admin(user_id: int) -> bool:
    try:
        con = get_db()
        cur = con.cursor()
        cur.execute(
            """SELECT 1 FROM portal_l2_links l
               JOIN accounts a ON a.login = l.l2_account
               WHERE l.portal_user_id = ? AND a.access_level > 0 LIMIT 1""",
            (user_id,),
        )
        return cur.fetchone() is not None
    except pymysql.Error:
        return False
    finally:
        try:
            con.close()
        except Exception:
            pass


def require_admin(user_id: int = Depends(get_current_user)) -> int:
    if not user_is_admin(user_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user_id


@app.post("/api/register")
async def register(req: RegisterRequest):
    email = req.email.strip().lower()
    password = req.password

    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    if password != req.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=10, prefix=b"2a"))
    try:
        con = get_db()
        cur = con.cursor()
        # ponytail: portal_users holds email auth, accounts holds L2 auth (kept separate by design)
        cur.execute(
            "INSERT INTO portal_users (email, password, created_at, updated_at) VALUES (?, ?, ?, ?)",
            (email, hashed.decode(), now_ms(), now_ms()),
        )
        con.commit()
    except pymysql.IntegrityError:
        raise HTTPException(status_code=409, detail="Email already registered")
    except pymysql.Error:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        try:
            con.close()
        except Exception:
            pass
    return {"message": "Account created"}


@app.post("/api/login")
async def login(req: LoginRequest):
    email = req.email.strip().lower()

    try:
        con = get_db()
        cur = con.cursor()
        cur.execute("SELECT id, password FROM portal_users WHERE email = ?", (email,))
        row = cur.fetchone()
    except pymysql.Error:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        try:
            con.close()
        except Exception:
            pass

    if not row or not bcrypt.checkpw(req.password.encode(), row[1].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "token": create_token(row[0]),
        "email": email,
        "is_admin": user_is_admin(row[0]),
    }


@app.get("/api/me")
async def me(user_id: int = Depends(get_current_user)):
    try:
        con = get_db()
        cur = con.cursor()
        cur.execute("SELECT email FROM portal_users WHERE id = ?", (user_id,))
        row = cur.fetchone()
        is_admin = user_is_admin(user_id) if row else False
    except pymysql.Error:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        try:
            con.close()
        except Exception:
            pass
    if not row:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"email": row[0], "is_admin": is_admin}


@app.get("/api/game-accounts")
async def list_game_accounts(user_id: int = Depends(get_current_user)):
    try:
        con = get_db()
        cur = con.cursor()
        cur.execute(
            """SELECT a.login, a.last_active
               FROM portal_l2_links l
               JOIN accounts a ON a.login = l.l2_account
               WHERE l.portal_user_id = ?""",
            (user_id,),
        )
        rows = cur.fetchall()
    except pymysql.Error:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        try:
            con.close()
        except Exception:
            pass
    return {"accounts": [{"login": r[0], "last_active": r[1]} for r in rows]}


@app.post("/api/game-accounts")
async def create_game_account(req: CreateGameAccountRequest, user_id: int = Depends(get_current_user)):
    login = req.login.strip().lower()
    password = req.password

    if not login or len(login) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters")
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    if password != req.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    if not re.match(r"^[a-zA-Z0-9_]+$", login):
        raise HTTPException(status_code=400, detail="Username: letters, numbers, underscores only")

    # ponytail: one active game account per email — drop old one first (requirement)
    try:
        con = get_db()
        cur = con.cursor()
        cur.execute("SELECT l2_account FROM portal_l2_links WHERE portal_user_id = ?", (user_id,))
        existing = cur.fetchall()
        for (old_login,) in existing:
            cur.execute("DELETE FROM portal_l2_links WHERE l2_account = ?", (old_login,))
            cur.execute("DELETE FROM accounts WHERE login = ?", (old_login,))

        hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=10, prefix=b"2a"))
        cur.execute(
            "INSERT INTO accounts (login, password, last_active, created_by_portal) VALUES (?, ?, ?, 1)",
            (login, hashed.decode(), 0),
        )
        cur.execute(
            "INSERT INTO portal_l2_links (portal_user_id, l2_account, created_at) VALUES (?, ?, ?)",
            (user_id, login, now_ms()),
        )
        con.commit()
    except pymysql.IntegrityError:
        con.rollback()
        raise HTTPException(status_code=409, detail="Username already taken")
    except pymysql.Error:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        try:
            con.close()
        except Exception:
            pass
    return {"message": "Game account created", "login": login}


@app.delete("/api/game-accounts/{login}")
async def delete_game_account(login: str, user_id: int = Depends(get_current_user)):
    login = login.strip().lower()
    try:
        con = get_db()
        cur = con.cursor()
        cur.execute(
            "SELECT l2_account FROM portal_l2_links WHERE portal_user_id = ? AND l2_account = ?",
            (user_id, login),
        )
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="Game account not found")

        cur.execute("DELETE FROM portal_l2_links WHERE l2_account = ?", (login,))
        cur.execute("DELETE FROM accounts WHERE login = ?", (login,))
        con.commit()
    except pymysql.Error:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        try:
            con.close()
        except Exception:
            pass
    return {"message": "Game account deleted"}


@app.get("/api/dashboard")
async def dashboard(user_id: int = Depends(get_current_user)):
    try:
        con = get_db()
        cur = con.cursor()
        cur.execute(
            """SELECT c.char_name, c.level, c.classid, c.pvpkills, c.pkkills,
                      c.online, c.race, c.clanid, c.exp
               FROM portal_l2_links l
               JOIN characters c ON c.account_name = l.l2_account
               WHERE l.portal_user_id = ?""",
            (user_id,),
        )
        rows = cur.fetchall()
    except pymysql.Error:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        try:
            con.close()
        except Exception:
            pass

    return {
        "characters": [
            {
                "name": r[0],
                "level": r[1],
                "class_name": CLASS_NAMES.get(r[2], f"Class {r[2]}"),
                "pvp_kills": r[3],
                "pk_kills": r[4],
                "online": bool(r[5]),
                "race": r[6],
                "clan_id": r[7],
                "exp": r[8],
            }
            for r in rows
        ]
    }


@app.get("/api/rankings")
async def rankings(sort: str = Query("level", pattern="^(level|pvp|pk)$")):
    order_map = {"level": "level DESC", "pvp": "pvpkills DESC", "pk": "pkkills DESC"}
    order = order_map[sort]

    try:
        con = get_db()
        cur = con.cursor()
        cur.execute(
            f"SELECT char_name, level, classid, pvpkills, pkkills FROM characters ORDER BY {order} LIMIT 50"
        )
        rows = cur.fetchall()
    except pymysql.Error:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        try:
            con.close()
        except Exception:
            pass

    return {
        "rankings": [
            {
                "name": r[0],
                "level": r[1],
                "class_name": CLASS_NAMES.get(r[2], f"Class {r[2]}"),
                "pvp_kills": r[3],
                "pk_kills": r[4],
            }
            for r in rows
        ]
    }


@app.get("/api/server-status")
async def server_status():
    try:
        con = get_db()
        cur = con.cursor()
        cur.execute("SELECT COUNT(*) FROM characters WHERE online = 1")
        online_count = cur.fetchone()[0]
    except pymysql.Error:
        online_count = -1
    finally:
        try:
            con.close()
        except Exception:
            pass

    # ponytail: tcp ping, 1s timeout, no extra lib
    alive = False
    try:
        s = socket.create_connection((GS_HOST, GS_PORT), timeout=1)
        s.close()
        alive = True
    except (socket.timeout, ConnectionRefusedError, OSError):
        pass

    return {"online": alive, "players_online": online_count}


@app.post("/api/change-password")
async def change_password(req: ChangePasswordRequest, user_id: int = Depends(get_current_user)):
    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")

    try:
        con = get_db()
        cur = con.cursor()
        cur.execute("SELECT password FROM portal_users WHERE id = ?", (user_id,))
        row = cur.fetchone()
        if not row or not bcrypt.checkpw(req.old_password.encode(), row[0].encode()):
            raise HTTPException(status_code=401, detail="Current password is incorrect")

        hashed = bcrypt.hashpw(req.new_password.encode(), bcrypt.gensalt(rounds=10, prefix=b"2a"))
        cur.execute(
            "UPDATE portal_users SET password = ?, updated_at = ? WHERE id = ?",
            (hashed.decode(), now_ms(), user_id),
        )
        con.commit()
    except pymysql.Error:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        try:
            con.close()
        except Exception:
            pass

    return {"message": "Password changed"}


@app.get("/api/admin/check")
async def admin_check(_: int = Depends(require_admin)):
    return {"admin": True}


@app.get("/api/admin/users")
async def admin_users(
    _: int = Depends(require_admin),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
):
    offset = (page - 1) * limit
    try:
        con = get_db()
        cur = con.cursor()
        cur.execute("SELECT COUNT(*) FROM portal_users")
        total = cur.fetchone()[0]
        cur.execute(
            """SELECT pu.id, pu.email,
                      (SELECT a.login FROM portal_l2_links l JOIN accounts a ON a.login = l.l2_account WHERE l.portal_user_id = pu.id LIMIT 1) AS l2_account,
                      (SELECT MAX(a.access_level) FROM portal_l2_links l JOIN accounts a ON a.login = l.l2_account WHERE l.portal_user_id = pu.id) AS access_level,
                      (SELECT COUNT(*) FROM portal_l2_links l JOIN accounts a ON a.login = l.l2_account JOIN characters c ON c.account_name = a.login WHERE l.portal_user_id = pu.id) AS char_count
               FROM portal_users pu
               ORDER BY pu.id
               LIMIT ? OFFSET ?""",
            (limit, offset),
        )
        rows = cur.fetchall()
    except pymysql.Error:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        try:
            con.close()
        except Exception:
            pass

    users = [
        {
            "id": r[0],
            "email": r[1],
            "l2_account": r[2],
            "access_level": r[3] or 0,
            "is_admin": (r[3] or 0) > 0,
            "char_count": r[4],
        }
        for r in rows
    ]
    return {"users": users, "total": total, "page": page, "limit": limit}


@app.get("/api/admin/characters")
async def admin_characters(
    _: int = Depends(require_admin),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    q: str = Query("", max_length=32),
):
    offset = (page - 1) * limit
    like = f"%{q}%"
    try:
        con = get_db()
        cur = con.cursor()
        count_sql = "SELECT COUNT(*) FROM characters"
        list_sql = (
            "SELECT c.obj_Id, c.char_name, c.level, c.classid, c.online, c.account_name, "
            "(SELECT pu.email FROM portal_l2_links l JOIN portal_users pu ON pu.id = l.portal_user_id "
            " WHERE l.l2_account = c.account_name LIMIT 1) AS email "
            "FROM characters c"
        )
        params = ()
        if q:
            count_sql += " WHERE char_name LIKE ?"
            list_sql += " WHERE c.char_name LIKE ?"
            params = (like,)
        cur.execute(count_sql, params)
        total = cur.fetchone()[0]
        cur.execute(
            list_sql + " ORDER BY c.level DESC, c.char_name LIMIT ? OFFSET ?",
            params + (limit, offset),
        )
        rows = cur.fetchall()
    except pymysql.Error:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        try:
            con.close()
        except Exception:
            pass

    return {
        "characters": [
            {
                "obj_id": r[0],
                "name": r[1],
                "level": r[2],
                "class_name": CLASS_NAMES.get(r[3], f"Class {r[3]}"),
                "online": bool(r[4]),
                "account": r[5],
                "email": r[6],
            }
            for r in rows
        ],
        "total": total,
        "page": page,
        "limit": limit,
    }


@app.get("/api/admin/users/{user_id}/characters")
async def admin_user_characters(user_id: int, _: int = Depends(require_admin)):
    try:
        con = get_db()
        cur = con.cursor()
        cur.execute(
            """SELECT c.obj_Id, c.char_name, c.level, c.classid, c.online, c.account_name
               FROM portal_l2_links l
               JOIN accounts a ON a.login = l.l2_account
               JOIN characters c ON c.account_name = a.login
               WHERE l.portal_user_id = ?""",
            (user_id,),
        )
        rows = cur.fetchall()
    except pymysql.Error:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        try:
            con.close()
        except Exception:
            pass

    return {
        "characters": [
            {
                "obj_id": r[0],
                "name": r[1],
                "level": r[2],
                "class_name": CLASS_NAMES.get(r[3], f"Class {r[3]}"),
                "online": bool(r[4]),
                "account": r[5],
            }
            for r in rows
        ]
    }


@app.get("/api/admin/characters/{obj_id}/items")
async def admin_char_items(obj_id: int, _: int = Depends(require_admin)):
    try:
        con = get_db()
        cur = con.cursor()
        cur.execute(
            "SELECT object_id, item_id, count, enchant_level, loc FROM items WHERE owner_id = ? ORDER BY loc, item_id",
            (obj_id,),
        )
        rows = cur.fetchall()
    except pymysql.Error:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        try:
            con.close()
        except Exception:
            pass

    return {
        "items": [
            {
                "object_id": r[0],
                "item_id": r[1],
                "count": r[2],
                "enchant_level": r[3],
                "loc": r[4],
                "name": ITEM_NAMES.get(r[1]),
            }
            for r in rows
        ]
    }


@app.post("/api/admin/characters/{obj_id}/items")
async def give_item(obj_id: int, req: GiveItemRequest, _: int = Depends(require_admin)):
    if req.count < 1 or req.count > 2_000_000_000:
        raise HTTPException(status_code=400, detail="Invalid count")
    if req.enchant_level < 0 or req.enchant_level > 65535:
        raise HTTPException(status_code=400, detail="Invalid enchant level")
    if req.loc not in ALLOWED_LOCS:
        raise HTTPException(status_code=400, detail="Invalid location (use INVENTORY or WAREHOUSE)")
    if ITEM_NAMES and req.item_id not in ITEM_NAMES:
        raise HTTPException(status_code=400, detail="Unknown item id")

    try:
        con = get_db()
        cur = con.cursor()
        cur.execute("SELECT char_name, online FROM characters WHERE obj_Id = ?", (obj_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Character not found")
        if row[1] == 1:
            raise HTTPException(status_code=409, detail="Character is online; log them out first")

        # ponytail: reserve next object_id under a row lock so concurrent gives cannot collide.
        # The game server's IdFactory loads every existing object_id at startup, so it will
        # never reallocate an id we insert here.
        con.begin()
        cur.execute("SELECT IFNULL(MAX(object_id), 0) + 1 FROM items FOR UPDATE")
        next_id = cur.fetchone()[0]
        cur.execute(
            "INSERT INTO items (owner_id, object_id, item_id, count, enchant_level, loc, loc_data, custom_type1, custom_type2, mana_left, time) "
            "VALUES (?, ?, ?, ?, ?, ?, 0, 0, 0, -1, 0)",
            (obj_id, next_id, req.item_id, req.count, req.enchant_level, req.loc),
        )
        con.commit()
    except pymysql.Error as e:
        try:
            con.rollback()
        except Exception:
            pass
        raise HTTPException(status_code=500, detail="Database error: " + str(e))
    finally:
        try:
            con.close()
        except Exception:
            pass

    return {"message": "Item added", "object_id": next_id, "name": ITEM_NAMES.get(req.item_id)}


@app.delete("/api/admin/items/{object_id}")
async def delete_item(object_id: int, _: int = Depends(require_admin)):
    try:
        con = get_db()
        cur = con.cursor()
        cur.execute("SELECT owner_id FROM items WHERE object_id = ?", (object_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Item not found")
        cur.execute("SELECT online FROM characters WHERE obj_Id = ?", (row[0],))
        crow = cur.fetchone()
        if crow and crow[0] == 1:
            raise HTTPException(status_code=409, detail="Owner is online; log them out first")
        cur.execute("DELETE FROM items WHERE object_id = ?", (object_id,))
        con.commit()
    except pymysql.Error:
        try:
            con.rollback()
        except Exception:
            pass
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        try:
            con.close()
        except Exception:
            pass

    return {"message": "Item removed"}


@app.get("/api/health_check")
async def health_check():
    try:
        con = get_db()
        cur = con.cursor()
        cur.execute("SELECT 1")
        cur.fetchone()
        con.close()
        db_ok = True
    except Exception:
        db_ok = False

    alive = False
    try:
        s = socket.create_connection((GS_HOST, GS_PORT), timeout=1)
        s.close()
        alive = True
    except (socket.timeout, ConnectionRefusedError, OSError):
        pass

    return {"status": "ok", "database": db_ok, "game_server": alive}


from updater import router as updater_router

app.include_router(updater_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=20200)
