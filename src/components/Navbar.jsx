import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import ServerStatus from './ServerStatus'
import { authHeader, clearAuth, getToken, API_BASE } from '../lib/api'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [admin, setAdmin] = useState(false)
  const navigate = useNavigate()

  const refreshAuth = useCallback(() => {
    const token = getToken()
    if (!token) {
      setUser(null)
      setAdmin(false)
      return
    }
    fetch(API_BASE + '/api/me', { headers: authHeader() })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setUser(data.email)
        setAdmin(!!data.is_admin)
        localStorage.setItem('is_admin', data.is_admin ? '1' : '0')
      })
      .catch(() => clearAuth())
  }, [])

  useEffect(() => {
    refreshAuth()
    window.addEventListener('auth-change', refreshAuth)
    return () => window.removeEventListener('auth-change', refreshAuth)
  }, [refreshAuth])

  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    clearAuth()
    setUser(null)
    setAdmin(false)
    navigate('/home')
  }

  return (
    <motion.header
      className="w-full relative z-30"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Top banner — desktop only */}
      <div className="hidden md:block bg-paper-100 border-b border-line">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          <ServerStatus />
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {admin && (
                  <Link
                    to="/admin"
                    className="text-gold-600 text-sm font-bold uppercase tracking-widest hover:text-gold-500 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="text-ink-700 text-sm font-bold tracking-wider hover:text-ink-900 transition-colors"
                >
                  {user}
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-outline-gold text-sm font-bold uppercase tracking-widest px-5 py-1.5 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-outline-gold text-sm font-bold uppercase tracking-widest px-5 py-1.5 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gold-500 hover:bg-gold-400 text-ink-900 text-sm font-bold uppercase tracking-widest px-5 py-1.5 transition-colors"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Logo + main nav */}
      <div className="bg-paper-50/90 backdrop-blur-sm border-b border-line">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/home" className="flex-shrink-0">
              <span className="font-display text-2xl font-bold text-ink-900 tracking-wider">
              Lineage 2 Albion
            </span>
          </Link>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 cursor-pointer"
            aria-label="Menu"
          >
            <span className={`block w-6 h-0.5 bg-ink-900 transition-transform duration-200 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block w-6 h-0.5 bg-ink-900 transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-ink-900 transition-transform duration-200 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/home"
              className="text-ink-900 text-sm font-bold uppercase tracking-widest hover:text-gold-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-ink-900 text-sm font-bold uppercase tracking-widest hover:text-gold-600 transition-colors"
            >
              About
            </Link>
            <Link
              to="/rankings"
              className="text-ink-900 text-sm font-bold uppercase tracking-widest hover:text-gold-600 transition-colors"
            >
              Rankings
            </Link>
            <Link
              to="/download"
              className="text-ink-900 text-sm font-bold uppercase tracking-widest hover:text-gold-600 transition-colors"
            >
              Download
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <motion.div
          className="md:hidden fixed inset-0 z-40 bg-paper-50/95 backdrop-blur-sm flex flex-col items-center justify-center gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 flex flex-col justify-center items-center gap-1.5 cursor-pointer"
            aria-label="Close menu"
          >
            <span className="block w-6 h-0.5 bg-ink-900 rotate-45 translate-y-0.5" />
            <span className="block w-6 h-0.5 bg-ink-900 -rotate-45 -translate-y-0.5" />
          </button>
          <Link
            to="/home"
            onClick={() => setMenuOpen(false)}
            className="text-ink-900 text-lg font-bold uppercase tracking-widest hover:text-gold-600 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="text-ink-900 text-lg font-bold uppercase tracking-widest hover:text-gold-600 transition-colors"
          >
            About
          </Link>
          <Link
            to="/rankings"
            onClick={() => setMenuOpen(false)}
            className="text-ink-900 text-lg font-bold uppercase tracking-widest hover:text-gold-600 transition-colors"
          >
            Rankings
          </Link>
          <div className="w-16 h-px bg-line" />
          {user ? (
            <>
              {admin && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="text-gold-600 text-lg font-bold uppercase tracking-widest hover:text-gold-500 transition-colors"
                >
                  Admin
                </Link>
              )}
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="text-ink-700 text-lg font-bold tracking-wider hover:text-ink-900 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false) }}
                className="btn-outline-gold text-lg font-bold uppercase tracking-widest px-8 py-2 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="btn-outline-gold text-lg font-bold uppercase tracking-widest px-8 py-2 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="bg-gold-500 hover:bg-gold-400 text-ink-900 text-lg font-bold uppercase tracking-widest px-8 py-2 transition-colors"
              >
                Create Account
              </Link>
            </>
          )}
        </motion.div>
      )}
    </motion.header>
  )
}
