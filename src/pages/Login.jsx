import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { setAuth, API_BASE } from '../lib/api'
import { fadeUp, stagger, scaleIn } from '../lib/motion'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(API_BASE + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.detail || 'Login failed')
        return
      }

      setAuth(data.token, data.email, data.is_admin)
      toast.success('Welcome back!')
      navigate('/home')
    } catch {
      toast.error('Connection error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.section
      className="min-h-[80vh] flex items-center justify-center px-4"
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-md"
        variants={scaleIn}
      >
        <motion.div
          className="panel-l2 p-8"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.h1
            className="font-display text-3xl font-bold text-ink-900 uppercase tracking-wide text-center mb-8"
            variants={fadeUp}
          >
            Login
          </motion.h1>

          <motion.form onSubmit={handleSubmit} className="space-y-5" variants={stagger}>
            <motion.div variants={fadeUp}>
              <label className="block text-sm font-bold text-ink-700 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-paper-100 border border-line text-ink-900 px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors"
              />
              <p className="text-ink-500 text-xs mt-1">Old accounts: enter your username instead.</p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <label className="block text-sm font-bold text-ink-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-paper-100 border border-line text-ink-900 px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              variants={fadeUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-gold disabled:opacity-50 py-4"
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>
          </motion.form>

          <motion.p className="text-center text-ink-500 text-sm mt-6" variants={fadeUp}>
            Don't have an account?{' '}
            <Link to="/register" className="text-gold-500 hover:text-gold-600 font-bold transition-colors">
              Create one
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
