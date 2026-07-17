import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from '../lib/motion'

export default function RaceCard({ race }) {
  const [imgSrc, setImgSrc] = useState(race.image)

  return (
    <motion.div
      className={`panel-l2 overflow-hidden border border-line transition-transform hover:-translate-y-1`}
      variants={fadeUp}
      whileHover={{ y: -4 }}
    >
      <div className={`h-40 w-full ${race.accent}`}>
        <img
          src={imgSrc}
          alt={race.name}
          loading="lazy"
          onError={() => setImgSrc('/placeholder-race.svg')}
          className="w-full h-full object-cover opacity-90"
        />
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-bold text-ink-900 uppercase tracking-wide mb-1">
          {race.name}
        </h3>
        <p className="text-gold-500 text-sm font-semibold tracking-wide uppercase mb-3">
          {race.tagline}
        </p>
        <p className="text-ink-500 text-sm leading-relaxed">
          {race.description}
        </p>
      </div>
    </motion.div>
  )
}
