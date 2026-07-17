import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { fadeUp, stagger, transition } from '../lib/motion'
import { API_BASE } from '../lib/api'

export default function Dashboard() {
  const [chars, setChars] = useState([])
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPwForm, setShowPwForm] = useState(false)
  const [showAcctForm, setShowAcctForm] = useState(false)
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [acctLogin, setAcctLogin] = useState('')
  const [acctPw, setAcctPw] = useState('')
  const [acctConfirm, setAcctConfirm] = useState('')
  const [acctLoading, setAcctLoading] = useState(false)
  const navigate = useNavigate()

  const authHeader = () => ({ Authorization: 'Bearer ' + localStorage.getItem('token') })

  const loadAll = () => {
    Promise.all([
      fetch(API_BASE + '/api/dashboard', { headers: authHeader() }),
      fetch(API_BASE + '/api/game-accounts', { headers: authHeader() }),
    ])
      .then(([dRes, aRes]) => Promise.all([dRes.json(), aRes.json()]))
      .then(([d, a]) => {
        setChars(d.characters || [])
        setAccounts(a.accounts || [])
      })
      .catch(() => {
        localStorage.removeItem('token')
        navigate('/login')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
      return
    }
    loadAll()
  }, [navigate])

  const handlePassword = async (e) => {
    e.preventDefault()
    setPwLoading(true)
    try {
      const res = await fetch(API_BASE + '/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ old_password: oldPw, new_password: newPw }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.detail)
        return
      }
      toast.success('Password changed')
      setShowPwForm(false)
      setOldPw('')
      setNewPw('')
    } catch {
      toast.error('Connection error')
    } finally {
      setPwLoading(false)
    }
  }

  const handleCreateAccount = async (e) => {
    e.preventDefault()
    if (acctPw !== acctConfirm) {
      toast.error('Passwords do not match')
      return
    }
    setAcctLoading(true)
    try {
      const res = await fetch(API_BASE + '/api/game-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ login: acctLogin, password: acctPw, confirm_password: acctConfirm }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.detail)
        return
      }
      toast.success('Game account created')
      setShowAcctForm(false)
      setAcctLogin('')
      setAcctPw('')
      setAcctConfirm('')
      loadAll()
    } catch {
      toast.error('Connection error')
    } finally {
      setAcctLoading(false)
    }
  }

  const handleDelete = async (login) => {
    if (!window.confirm('Delete game account "' + login + '"? Its characters will be lost.')) return
    try {
      const res = await fetch(API_BASE + '/api/game-accounts/' + login, {
        method: 'DELETE',
        headers: authHeader(),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.detail)
        return
      }
      toast.success('Game account deleted')
      loadAll()
    } catch {
      toast.error('Connection error')
    }
  }

  if (loading) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <p className="text-ink-500 text-sm uppercase tracking-widest">Loading...</p>
      </section>
    )
  }

  return (
    <motion.section
      className="max-w-5xl mx-auto px-4 py-12"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={transition}
    >
      <motion.div
        className="flex items-center justify-between mb-8"
        variants={fadeUp}
        initial="hidden"
        animate="show"
      >
        <h1 className="font-display text-3xl font-bold text-ink-900 uppercase tracking-wide">
          My Account
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowAcctForm(!showAcctForm); setShowPwForm(false) }}
            className="btn-outline-gold text-xs font-bold uppercase tracking-widest px-4 py-2 transition-colors"
          >
            {showAcctForm ? 'Cancel' : accounts.length ? 'Replace Game Account' : 'Create Game Account'}
          </button>
          <button
            onClick={() => { setShowPwForm(!showPwForm); setShowAcctForm(false) }}
            className="btn-outline-gold text-xs font-bold uppercase tracking-widest px-4 py-2 transition-colors"
          >
            {showPwForm ? 'Cancel' : 'Change Password'}
          </button>
        </div>
      </motion.div>

      {showPwForm && (
        <motion.form
          onSubmit={handlePassword}
          className="panel-l2 p-6 mb-8 max-w-md space-y-4"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
        >
          <div>
            <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider mb-1">Current Password</label>
            <input
              type="password"
              value={oldPw}
              onChange={(e) => setOldPw(e.target.value)}
              required
                className="w-full bg-paper-100 border border-line text-ink-900 px-3 py-2 text-sm focus:outline-none focus:border-gold-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider mb-1">New Password</label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              required
              minLength={6}
                className="w-full bg-paper-100 border border-line text-ink-900 px-3 py-2 text-sm focus:outline-none focus:border-gold-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={pwLoading}
            className="bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-ink-900 text-xs font-bold uppercase tracking-widest px-6 py-2 transition-colors"
          >
            {pwLoading ? 'Saving...' : 'Save'}
          </button>
        </motion.form>
      )}

      {showAcctForm && (
        <motion.form
          onSubmit={handleCreateAccount}
          className="panel-l2 p-6 mb-8 max-w-md space-y-4"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
        >
          {accounts.length > 0 && (
            <p className="text-gold-500 text-xs uppercase tracking-wider">
              You already own a game account. Creating a new one will delete it permanently.
            </p>
          )}
          <div>
            <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider mb-1">Game Username</label>
            <input
              type="text"
              value={acctLogin}
              onChange={(e) => setAcctLogin(e.target.value)}
              required
              minLength={3}
                className="w-full bg-paper-100 border border-line text-ink-900 px-3 py-2 text-sm focus:outline-none focus:border-gold-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider mb-1">Password</label>
            <input
              type="password"
              value={acctPw}
              onChange={(e) => setAcctPw(e.target.value)}
              required
              minLength={6}
                className="w-full bg-paper-100 border border-line text-ink-900 px-3 py-2 text-sm focus:outline-none focus:border-gold-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider mb-1">Confirm Password</label>
            <input
              type="password"
              value={acctConfirm}
              onChange={(e) => setAcctConfirm(e.target.value)}
              required
                className="w-full bg-paper-100 border border-line text-ink-900 px-3 py-2 text-sm focus:outline-none focus:border-gold-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={acctLoading}
            className="bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-ink-900 text-xs font-bold uppercase tracking-widest px-6 py-2 transition-colors"
          >
            {acctLoading ? 'Creating...' : 'Create'}
          </button>
        </motion.form>
      )}

      <h2 className="font-display text-xl font-bold text-ink-900 uppercase tracking-wide mb-4">Game Accounts</h2>
      {accounts.length === 0 ? (
        <p className="text-ink-500 mb-8">No game account yet. Create one to play.</p>
      ) : (
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm">
            <thead>
                <tr className="border-b border-line">
                <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">Username</th>
                <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">Last Active</th>
                <th className="text-right text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">Action</th>
              </tr>
            </thead>
            <motion.tbody variants={stagger} initial="hidden" animate="show">
              {accounts.map((a) => (
                <motion.tr key={a.login}                 className="border-b border-line hover:bg-paper-200 transition-colors" variants={fadeUp}>
                  <td className="py-3 px-4 font-bold text-ink-900">{a.login}</td>
                  <td className="py-3 px-4 text-ink-700">
                    {a.last_active ? new Date(a.last_active * 1000).toLocaleString() : 'Never'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(a.login)}
                      className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-widest"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      )}

      <h2 className="font-display text-xl font-bold text-ink-900 uppercase tracking-wide mb-4">Characters</h2>
      {chars.length === 0 ? (
        <p className="text-ink-500">No characters found on your game account.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
                <tr className="border-b border-line">
                <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">Name</th>
                <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">Level</th>
                <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">Class</th>
                <th className="text-center text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">PvP</th>
                <th className="text-center text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">PK</th>
                <th className="text-center text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">Status</th>
              </tr>
            </thead>
            <motion.tbody variants={stagger} initial="hidden" animate="show">
              {chars.map((c) => (
                <motion.tr key={c.name}                 className="border-b border-line hover:bg-paper-200 transition-colors" variants={fadeUp}>
                  <td className="py-3 px-4 font-bold text-ink-900">{c.name}</td>
                  <td className="py-3 px-4 text-gold-500 font-bold">{c.level}</td>
                  <td className="py-3 px-4 text-ink-700">{c.class_name}</td>
                  <td className="py-3 px-4 text-center text-green-400">{c.pvp_kills}</td>
                  <td className="py-3 px-4 text-center text-red-400">{c.pk_kills}</td>
                  <td className="py-3 px-4 text-center">
                    {c.online ? (
                      <span className="text-green-400 font-bold text-xs uppercase">Online</span>
                    ) : (
                      <span className="text-ink-500 text-xs uppercase">Offline</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      )}
    </motion.section>
  )
}
