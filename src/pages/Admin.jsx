import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { apiFetch, clearAuth } from '../lib/api'
import { fadeUp, stagger, transition } from '../lib/motion'

export default function Admin() {
  const navigate = useNavigate()
  const [allowed, setAllowed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('chars')

  // Users view
  const [users, setUsers] = useState([])
  const [usersTotal, setUsersTotal] = useState(0)
  const [usersPage, setUsersPage] = useState(1)
  const [usersLimit] = useState(20)

  // Characters view
  const [chars, setChars] = useState([])
  const [charsTotal, setCharsTotal] = useState(0)
  const [charsPage, setCharsPage] = useState(1)
  const [charsLimit] = useState(25)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  // Drill-down
  const [selectedUser, setSelectedUser] = useState(null)
  const [userChars, setUserChars] = useState([])
  const [selectedChar, setSelectedChar] = useState(null)
  const [items, setItems] = useState([])

  // Give form
  const [itemId, setItemId] = useState('')
  const [itemCount, setItemCount] = useState('1')
  const [itemEnchant, setItemEnchant] = useState('0')
  const [itemLoc, setItemLoc] = useState('INVENTORY')
  const [giving, setGiving] = useState(false)

  const loadUsers = useCallback(
    (p) => {
      apiFetch(`/api/admin/users?page=${p}&limit=${usersLimit}`)
        .then((d) => {
          setUsers(d.users)
          setUsersTotal(d.total)
          setUsersPage(d.page)
        })
        .catch((e) => toast.error(e.message))
    },
    [usersLimit]
  )

  const loadChars = useCallback(
    (p, q) => {
      const query = `page=${p}&limit=${charsLimit}${q ? `&q=${encodeURIComponent(q)}` : ''}`
      apiFetch(`/api/admin/characters?${query}`)
        .then((d) => {
          setChars(d.characters)
          setCharsTotal(d.total)
          setCharsPage(d.page)
        })
        .catch((e) => toast.error(e.message))
    },
    [charsLimit]
  )

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
      return
    }
    apiFetch('/api/admin/check')
      .then(() => {
        setAllowed(true)
        loadChars(1, '')
      })
      .catch(() => {
        clearAuth()
        navigate('/login')
      })
      .finally(() => setLoading(false))
  }, [navigate, loadChars])

  const selectUser = (user) => {
    setSelectedUser(user)
    setSelectedChar(null)
    setItems([])
    apiFetch(`/api/admin/users/${user.id}/characters`)
      .then((d) => setUserChars(d.characters))
      .catch((e) => toast.error(e.message))
  }

  const selectChar = (char) => {
    setSelectedChar(char)
    apiFetch(`/api/admin/characters/${char.obj_id}/items`)
      .then((d) => setItems(d.items))
      .catch((e) => toast.error(e.message))
  }

  const onSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    loadChars(1, searchInput)
  }

  const handleGive = async (e) => {
    e.preventDefault()
    const id = parseInt(itemId, 10)
    const count = parseInt(itemCount, 10)
    const enchant = parseInt(itemEnchant, 10)
    if (!selectedChar || !id) {
      toast.error('Pick a character and enter an item id')
      return
    }
    setGiving(true)
    try {
      const d = await apiFetch(`/api/admin/characters/${selectedChar.obj_id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: id, count, enchant_level: enchant, loc: itemLoc }),
      })
      toast.success(`Added ${d.name || 'item #' + id} to ${itemLoc.toLowerCase()}`)
      setItemId('')
      selectChar(selectedChar)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setGiving(false)
    }
  }

  const handleDelete = async (objectId) => {
    if (!window.confirm('Remove this item? Applies after the owner relogs.')) return
    try {
      await apiFetch(`/api/admin/items/${objectId}`, { method: 'DELETE' })
      toast.success('Item removed')
      selectChar(selectedChar)
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (loading) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <p className="text-ink-500 text-sm uppercase tracking-widest">Loading...</p>
      </section>
    )
  }
  if (!allowed) return null

  const usersPages = Math.max(1, Math.ceil(usersTotal / usersLimit))
  const charsPages = Math.max(1, Math.ceil(charsTotal / charsLimit))

  return (
    <motion.section
      className="max-w-6xl mx-auto px-4 py-12"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={transition}
    >
      <motion.div
        className="flex items-center justify-between mb-6"
        variants={fadeUp}
        initial="hidden"
        animate="show"
      >
        <h1 className="font-display text-3xl font-bold text-ink-900 uppercase tracking-wide">Admin Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setView('chars'); setSelectedUser(null); setUserChars([]) }}
            className={`text-xs font-bold uppercase tracking-widest px-4 py-2 transition-colors ${
              view === 'chars' ? 'bg-gold-500 text-ink-900' : 'bg-paper-200 text-ink-700 hover:bg-paper-200'
            }`}
          >
            All Characters
          </button>
          <button
            onClick={() => { setView('users'); loadUsers(usersPage) }}
            className={`text-xs font-bold uppercase tracking-widest px-4 py-2 transition-colors ${
              view === 'users' ? 'bg-gold-500 text-ink-900' : 'bg-paper-200 text-ink-700 hover:bg-paper-200'
            }`}
          >
            Users
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left list */}
        <div className="lg:col-span-1">
          {view === 'chars' ? (
            <>
              <form onSubmit={onSearch} className="flex gap-2 mb-4">
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search character..."
                  className="flex-1 bg-paper-100 border border-line text-ink-900 px-3 py-2 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                />
                <button type="submit"             className="btn-outline-gold text-xs font-bold uppercase tracking-widest px-3 py-2 transition-colors">
                  Search
                </button>
              </form>
              <div className="overflow-x-auto panel-l2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider py-2 px-3">Character</th>
                      <th className="text-center text-xs font-bold text-ink-500 uppercase tracking-wider py-2 px-3">Lv</th>
                      <th className="text-center text-xs font-bold text-ink-500 uppercase tracking-wider py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <motion.tbody variants={stagger} initial="hidden" animate="show">
                    {chars.map((c) => (
                      <motion.tr
                        key={c.obj_id}
                        onClick={() => selectChar(c)}
                        className={`border-b border-line cursor-pointer transition-colors ${
                          selectedChar?.obj_id === c.obj_id ? 'bg-paper-200' : 'hover:bg-paper-200'
                        }`}
                        variants={fadeUp}
                      >
                        <td className="py-2 px-3">
                          <div className="font-bold text-ink-900">{c.name}</div>
                          <div className="text-ink-500 text-xs">{c.class_name}</div>
                          <div className="text-ink-500 text-xs">{c.account}{c.email ? ` · ${c.email}` : ''}</div>
                        </td>
                        <td className="py-2 px-3 text-center text-gold-500 font-bold">{c.level}</td>
                        <td className="py-2 px-3 text-center">
                          {c.online ? (
                            <span className="text-green-400 text-xs font-bold uppercase">Online</span>
                          ) : (
                             <span className="text-ink-500 text-xs uppercase">Offline</span>
                           )}
                         </td>
                       </motion.tr>
                     ))}
                   </motion.tbody>
                 </table>
              </div>
              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={() => loadChars(charsPage - 1, search)}
                  disabled={charsPage <= 1}
                  className="bg-paper-200 hover:bg-paper-200 disabled:opacity-40 text-ink-900 text-xs font-bold uppercase tracking-widest px-3 py-1.5 transition-colors"
                >
                  Prev
                </button>
                <span className="text-ink-500 text-xs">Page {charsPage} / {charsPages}</span>
                <button
                  onClick={() => loadChars(charsPage + 1, search)}
                  disabled={charsPage >= charsPages}
                  className="bg-paper-200 hover:bg-paper-200 disabled:opacity-40 text-ink-900 text-xs font-bold uppercase tracking-widest px-3 py-1.5 transition-colors"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-ink-900 uppercase tracking-wide">Users</h2>
                <span className="text-ink-500 text-xs">{usersTotal} total</span>
              </div>
              <div className="overflow-x-auto panel-l2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider py-2 px-3">Email</th>
                      <th className="text-center text-xs font-bold text-ink-500 uppercase tracking-wider py-2 px-3">Chars</th>
                      <th className="text-center text-xs font-bold text-ink-500 uppercase tracking-wider py-2 px-3">Role</th>
                    </tr>
                  </thead>
                  <motion.tbody variants={stagger} initial="hidden" animate="show">
                    {users.map((u) => (
                      <motion.tr
                        key={u.id}
                        onClick={() => selectUser(u)}
                        className={`border-b border-line cursor-pointer transition-colors ${
                          selectedUser?.id === u.id ? 'bg-paper-200' : 'hover:bg-paper-200'
                        }`}
                        variants={fadeUp}
                      >
                        <td className="py-2 px-3 font-bold text-ink-900 truncate max-w-[140px]">{u.email}</td>
                        <td className="py-2 px-3 text-center text-ink-700">{u.char_count}</td>
                        <td className="py-2 px-3 text-center">
                          {u.is_admin ? (
                            <span className="text-gold-500 font-bold text-xs uppercase">Admin</span>
                          ) : (
                             <span className="text-ink-500 text-xs uppercase">User</span>
                           )}
                         </td>
                       </motion.tr>
                     ))}
                   </motion.tbody>
                 </table>
              </div>
              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={() => loadUsers(usersPage - 1)}
                  disabled={usersPage <= 1}
                  className="bg-paper-200 hover:bg-paper-200 disabled:opacity-40 text-ink-900 text-xs font-bold uppercase tracking-widest px-3 py-1.5 transition-colors"
                >
                  Prev
                </button>
                <span className="text-ink-500 text-xs">Page {usersPage} / {usersPages}</span>
                <button
                  onClick={() => loadUsers(usersPage + 1)}
                  disabled={usersPage >= usersPages}
                  className="bg-paper-200 hover:bg-paper-200 disabled:opacity-40 text-ink-900 text-xs font-bold uppercase tracking-widest px-3 py-1.5 transition-colors"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right panel */}
        <div className="lg:col-span-2">
          {view === 'users' && selectedUser && (
            <>
              <h2 className="font-display text-xl font-bold text-ink-900 uppercase tracking-wide mb-4">{selectedUser.email}</h2>
              <h3 className="text-sm font-bold text-ink-700 uppercase tracking-wider mb-2">Characters</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {userChars.length === 0 && <p className="text-ink-500 text-sm">No characters.</p>}
                {userChars.map((c) => (
                  <button
                    key={c.obj_id}
                    onClick={() => selectChar(c)}
                    className={`border px-4 py-2 text-sm font-bold uppercase tracking-widest transition-colors ${
                      selectedChar?.obj_id === c.obj_id
                        ? 'border-gold-500 text-gold-500'
                        : 'border-line text-ink-700 hover:border-gold-500'
                    }`}
                  >
                    {c.name} (Lv{c.level})
                    {c.online && <span className="text-green-400 ml-1">●</span>}
                  </button>
                ))}
              </div>
            </>
          )}

          {!selectedChar && (
            <p className="text-ink-500">
              {view === 'chars'
                ? 'Search and pick a character to manage their items.'
                : 'Select a user, then a character, to manage items.'}
            </p>
          )}

          <AnimatePresence mode="wait">
            {selectedChar && (
              <motion.div
                key={selectedChar.obj_id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={transition}
              >
              <h3 className="font-display text-xl font-bold text-ink-900 uppercase tracking-wide mb-1">
                {selectedChar.name}
              </h3>
              <p className="text-ink-500 text-sm mb-4">
                Lv{selectedChar.level} · {selectedChar.class_name} · {selectedChar.account}
                {selectedChar.online ? ' · ONLINE' : ' · offline'}
              </p>

              <h4 className="text-sm font-bold text-ink-700 uppercase tracking-wider mb-2">Items</h4>
              <div className="overflow-x-auto panel-l2 mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider py-2 px-3">Name</th>
                      <th className="text-right text-xs font-bold text-ink-500 uppercase tracking-wider py-2 px-3">Count</th>
                      <th className="text-center text-xs font-bold text-ink-500 uppercase tracking-wider py-2 px-3">Enchant</th>
                      <th className="text-center text-xs font-bold text-ink-500 uppercase tracking-wider py-2 px-3">Loc</th>
                      <th className="text-right text-xs font-bold text-ink-500 uppercase tracking-wider py-2 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-3 px-3 text-ink-500 text-center">No items.</td>
                      </tr>
                    )}
                    {items.map((it) => (
                      <tr key={it.object_id} className="border-b border-line">
                        <td className="py-2 px-3 text-ink-900">
                          {it.name || `Item #${it.item_id}`}
                          {!it.name && <span className="text-ink-500 text-xs ml-1">(unknown)</span>}
                        </td>
                        <td className="py-2 px-3 text-right text-ink-700">{it.count}</td>
                        <td className="py-2 px-3 text-center text-gold-500 font-bold">+{it.enchant_level}</td>
                        <td className="py-2 px-3 text-center text-ink-500 text-xs uppercase">{it.loc}</td>
                        <td className="py-2 px-3 text-right">
                          <button
                            onClick={() => handleDelete(it.object_id)}
                            className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-widest"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <form onSubmit={handleGive} className="panel-l2 p-6 max-w-md space-y-4">
                <h4 className="text-sm font-bold text-ink-700 uppercase tracking-wider">Give Item</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider mb-1">Item ID</label>
                    <input
                      type="number"
                      value={itemId}
                      onChange={(e) => setItemId(e.target.value)}
                      required
                      className="w-full bg-paper-100 border border-line text-ink-900 px-2 py-2 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider mb-1">Count</label>
                    <input
                      type="number"
                      value={itemCount}
                      onChange={(e) => setItemCount(e.target.value)}
                      min={1}
                      className="w-full bg-paper-100 border border-line text-ink-900 px-2 py-2 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider mb-1">Enchant</label>
                    <input
                      type="number"
                      value={itemEnchant}
                      onChange={(e) => setItemEnchant(e.target.value)}
                      min={0}
                      className="w-full bg-paper-100 border border-line text-ink-900 px-2 py-2 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider mb-1">Destination</label>
                  <select
                    value={itemLoc}
                    onChange={(e) => setItemLoc(e.target.value)}
                    className="w-full bg-paper-100 border border-line text-ink-900 px-2 py-2 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                  >
                    <option value="INVENTORY">Character Inventory</option>
                    <option value="WAREHOUSE">Personal Warehouse</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={giving}
                  className="bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-ink-900 text-xs font-bold uppercase tracking-widest px-6 py-2 transition-colors"
                >
                  {giving ? 'Adding...' : 'Give Item'}
                </button>
                {selectedChar.online && (
                  <p className="text-gold-500 text-xs uppercase tracking-wider">
                    Owner is online — changes apply after they relog.
                  </p>
                )}
              </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  )
}
