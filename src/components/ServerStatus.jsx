import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { API_BASE } from '../lib/api'

export default function ServerStatus() {
  const [status, setStatus] = useState(null)

  useEffect(() => {
    fetch(API_BASE + '/api/server-status')
      .then((res) => res.json())
      .then(setStatus)
      .catch(() => setStatus({ online: false, players_online: 0 }))
  }, [])

  const label =
    status === null ? '...' : status.online ? 'Online' : 'Offline'

  return (
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
      <span
        className={`w-2 h-2 rounded-full ${
          status?.online ? 'bg-green-400 animate-pulse' : 'bg-red-400'
        }`}
      />
      <AnimatePresence mode="wait">
        <motion.span
          key={label}
          className="text-gray-400"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
