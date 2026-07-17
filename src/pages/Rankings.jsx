import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, stagger, transition } from '../lib/motion'
import { API_BASE } from '../lib/api'

const SORT_OPTIONS = [
  { key: 'level', label: 'Level' },
  { key: 'pvp', label: 'PvP Kills' },
  { key: 'pk', label: 'PK Kills' },
]

export default function Rankings() {
  const [sort, setSort] = useState('level')
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`${API_BASE}/api/rankings?sort=${sort}`)
      .then((res) => res.json())
      .then((data) => setRankings(data.rankings || []))
      .catch(() => setRankings([]))
      .finally(() => setLoading(false))
  }, [sort])

  return (
    <motion.section
      className="max-w-4xl mx-auto px-4 py-12"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={transition}
    >
      <h1 className="font-display text-3xl font-bold text-ink-900 uppercase tracking-wide mb-8">
        Rankings
      </h1>

      <div className="flex gap-2 mb-6">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSort(opt.key)}
            className={`relative text-xs font-bold uppercase tracking-widest px-5 py-2 transition-colors ${
              sort === opt.key ? 'text-ink-900' : 'bg-paper-200 text-ink-700 hover:bg-paper-200'
            }`}
          >
            {sort === opt.key && (
              <motion.span
                layoutId="ranking-tab"
                className="absolute inset-0 bg-gold-500"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-ink-500 text-sm uppercase tracking-widest">Loading...</p>
      ) : rankings.length === 0 ? (
        <p className="text-ink-500">No characters found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
                <tr className="border-b border-line">
                <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4 w-12">#</th>
                <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">Name</th>
                <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">Class</th>
                <th className="text-center text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">Level</th>
                <th className="text-center text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">PvP</th>
                <th className="text-center text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">PK</th>
              </tr>
            </thead>
            <AnimatePresence mode="wait">
              <motion.tbody
                key={sort}
                variants={stagger}
                initial="hidden"
                animate="show"
              >
                {rankings.map((r, i) => (
                  <motion.tr
                    key={r.name}
                    className="border-b border-line hover:bg-paper-200 transition-colors"
                    variants={fadeUp}
                  >
                    <td className="py-3 px-4 text-ink-500 font-bold">{i + 1}</td>
                    <td className="py-3 px-4 font-bold text-ink-900">{r.name}</td>
                    <td className="py-3 px-4 text-ink-700">{r.class_name}</td>
                    <td className="py-3 px-4 text-center text-gold-500 font-bold">{r.level}</td>
                    <td className="py-3 px-4 text-center text-green-400">{r.pvp_kills}</td>
                    <td className="py-3 px-4 text-center text-red-400">{r.pk_kills}</td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </AnimatePresence>
          </table>
        </div>
      )}
    </motion.section>
  )
}
