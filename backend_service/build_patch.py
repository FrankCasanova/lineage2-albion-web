#!/usr/bin/env python3
"""Build an L2 launcher patch package: files.xml + .bz2 tree.

Replaces the GUI PatchBuilder.exe. Walks a Lineage II client folder,
BZip2-compresses every file (standard bz2, decompressed by the launcher's
SharpZipLib), and writes files.xml in the exact schema the custom launcher
parses (ManifestService.cs):

    <files>
      <critical path="system/l2.ini" hash="<MD5 uppercase>" size="<bytes>"/>
      <normal   path="system/foo.txt" hash="<MD5 uppercase>" size="<bytes>"/>
    </files>

The launcher sends POST /updater/download with form files="<path>.bz2" and
BZip2-decompresses it, then verifies MD5 against the manifest.

Usage:
    python build_patch.py --source "C:/Lineage2_Interlude_Client" \
        --output  "C:/acis_fresh/updater"
"""
import argparse
import bz2
import fnmatch
import hashlib
import os
import time
import xml.etree.ElementTree as ET

# Match PatchBuilder's critical set (downloaded at launcher startup).
DEFAULT_CRITICAL = ["system/l2.ini", "system/l2.int", "system/l2.exe"]
SKIP = {".git", "__pycache__", "updater", "thumbs.db", "desktop.ini"}


def compress_and_hash(full: str, dest: str):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    h = hashlib.md5()
    size = 0
    with open(full, "rb") as src, bz2.BZ2File(dest, "wb", compresslevel=9) as dst:
        for chunk in iter(lambda: src.read(1 << 20), b""):
            h.update(chunk)
            size += len(chunk)
            dst.write(chunk)
    return h.hexdigest().upper(), size


def is_critical(rel: str, patterns) -> bool:
    return any(fnmatch.fnmatch(rel.lower(), p.lower()) for p in patterns)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", required=True, help="Lineage II client folder")
    ap.add_argument("--output", default=os.getenv("UPDATER_DIR",
                    r"C:\Users\frank\Desktop\acis_fresh\updater"),
                    help="patch output dir (defaults to $UPDATER_DIR)")
    ap.add_argument("--critical", nargs="*", default=DEFAULT_CRITICAL,
                    help="relpath globs treated as critical startup files")
    args = ap.parse_args()

    out = os.path.abspath(args.output)
    os.makedirs(out, exist_ok=True)

    entries = []
    for dirpath, dirnames, names in os.walk(args.source):
        dirnames[:] = [d for d in dirnames if d.lower() not in SKIP]
        for name in names:
            if name.lower() in SKIP:
                continue
            full = os.path.join(dirpath, name)
            rel = os.path.relpath(full, args.source).replace(os.sep, "/")
            if rel.lower().startswith("updater/"):
                continue
            dest = os.path.join(out, *rel.split("/")) + ".bz2"
            digest, size = compress_and_hash(full, dest)
            entries.append((rel, digest, size, is_critical(rel, args.critical)))
            print(f"  {'CRIT' if entries[-1][3] else '    '} {rel} -> {os.path.getsize(dest)} b")

    root = ET.Element("data")
    ET.SubElement(root, "creation").set("timestamp", format(int(time.time() * 1000), "X").rjust(16, "0"))
    for rel, digest, size, crit in entries:
        el = ET.SubElement(root, "critical" if crit else "normal")
        el.set("path", rel)
        el.set("hash", digest)
        el.set("size", str(size))
    manifest = os.path.join(out, "files.xml")
    ET.ElementTree(root).write(manifest, encoding="utf-8", xml_declaration=True)
    print(f"Wrote {manifest} with {len(entries)} files.")


if __name__ == "__main__":
    main()
