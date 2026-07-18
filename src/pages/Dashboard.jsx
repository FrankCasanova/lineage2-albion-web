import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { fadeUp, stagger, scaleIn, transition } from '../lib/motion'
import { API_BASE } from '../lib/api'
import { useTranslation } from 'react-i18next'

export default function Dashboard() {
  const { t } = useTranslation()
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
      toast.success(t('auth.passwordChanged'))
      setShowPwForm(false)
      setOldPw('')
      setNewPw('')
    } catch {
      toast.error(t('auth.connectionError'))
    } finally {
      setPwLoading(false)
    }
  }

  const handleCreateAccount = async (e) => {
    e.preventDefault()
    if (acctPw !== acctConfirm) {
      toast.error(t('auth.passwordMismatch'))
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
      toast.success(t('auth.gameAccountCreated'))
      setShowAcctForm(false)
      setAcctLogin('')
      setAcctPw('')
      setAcctConfirm('')
      loadAll()
    } catch {
      toast.error(t('auth.connectionError'))
    } finally {
      setAcctLoading(false)
    }
  }

  const handleDelete = async (login) => {
    if (!window.confirm(t('auth.deleteAccountConfirm', { login }))) return
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
      toast.success(t('auth.gameAccountDeleted'))
      loadAll()
    } catch {
      toast.error(t('auth.connectionError'))
    }
  }

  if (loading) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <p className="text-ink-500 text-sm uppercase tracking-widest">{t('common.loading')}</p>
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
          {t('auth.dashboard.title')}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowAcctForm(!showAcctForm); setShowPwForm(false) }}
            className="btn-outline-gold text-xs font-bold uppercase tracking-widest px-4 py-2 transition-colors"
          >
            {showAcctForm ? t('auth.cancel') : accounts.length ? t('auth.replaceAccount') : t('auth.createGameAccount')}
          </button>
          <button
            onClick={() => { setShowPwForm(!showPwForm); setShowAcctForm(false) }}
            className="btn-outline-gold text-xs font-bold uppercase tracking-widest px-4 py-2 transition-colors"
          >
            {showPwForm ? t('auth.cancel') : t('auth.changePassword')}
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
            <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider mb-1">{t('auth.currentPassword')}</label>
            <input
              type="password"
              value={oldPw}
              onChange={(e) => setOldPw(e.target.value)}
              required
                className="w-full bg-paper-100 border border-line text-ink-900 px-3 py-2 text-sm focus:outline-none focus:border-gold-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider mb-1">{t('auth.newPassword')}</label>
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
            {pwLoading ? t('auth.saving') : t('auth.save')}
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
              {t('auth.replaceAccountDescription')}
            </p>
          )}
          <div>
            <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider mb-1">{t('auth.gameUsername')}</label>
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
            <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider mb-1">{t('auth.currentPassword')}</label>
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
            <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider mb-1">{t('auth.confirmPassword')}</label>
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
            {acctLoading ? t('auth.creating') : t('auth.createGameAccount')}
          </button>
        </motion.form>
      )}

      <h2 className="font-display text-xl font-bold text-ink-900 uppercase tracking-wide mb-4">{t('auth.dashboard.gameAccounts')}</h2>
      {accounts.length === 0 ? (
        <p className="text-ink-500 mb-8">{t('auth.dashboard.noGameAccountYet')}</p>
      ) : (
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm">
            <thead>
                <tr className="border-b border-line">
                <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">{t('auth.table.username')}</th>
                <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">{t('auth.table.lastActive')}</th>
                <th className="text-right text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">{t('auth.table.action')}</th>
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
                      {t('auth.delete')}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      )}

      <h2 className="font-display text-xl font-bold text-ink-900 uppercase tracking-wide mb-4">{t('auth.dashboard.characters')}</h2>
      {chars.length === 0 ? (
        <p className="text-ink-500">{t('auth.dashboard.noCharactersFound')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
                <tr className="border-b border-line">
                <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">{t('auth.dashboard.name')}</th>
                <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">{t('auth.dashboard.level')}</th>
                <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">{t('auth.dashboard.class')}</th>
                <th className="text-center text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">{t('auth.dashboard.pvp')}</th>
                <th className="text-center text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">{t('auth.dashboard.pk')}</th>
                <th className="text-center text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">{t('auth.dashboard.status')}</th>
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
                      <span className="text-green-400 font-bold text-xs uppercase">{t('auth.dashboard.online')}</span>
                    ) : (
                      <span className="text-ink-500 text-xs uppercase">{t('auth.dashboard.offline')}</span>
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
