import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { fadeUp, stagger, scaleIn } from '../lib/motion'
import { API_BASE } from '../lib/api'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(API_BASE + '/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirm_password: confirm }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.detail || 'Registration failed')
        return
      }

      toast.success('Account created! You can now login.')
      navigate('/login')
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
      <motion.div className="w-full max-w-md" variants={scaleIn}>
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
            Create Account
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
                minLength={6}
                className="w-full bg-paper-100 border border-line text-ink-900 px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors"
              />
              <p className="text-ink-500 text-xs mt-1">Min 6 characters.</p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <label className="block text-sm font-bold text-ink-700 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
              {loading ? 'Creating...' : 'Create Account'}
            </motion.button>
          </motion.form>

          <motion.p className="text-center text-ink-500 text-sm mt-6" variants={fadeUp}>
            Already have an account?{' '}
            <Link to="/login"             className="text-gold-600 hover:text-gold-500 font-bold transition-colors">
              Login
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
