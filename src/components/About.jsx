import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, stagger, transition } from '../lib/motion'
import { getToken } from '../lib/api'

const headline = 'Two Worlds. One Server.'

const description =
  'We fuse the haunting orchestral soundtrack and dark fantasy atmosphere of Lineage 2 with the refined, player-driven economy and fast-paced combat system of Albion Online. The result is a world where every battle sounds epic, every dungeon echoes with atmosphere, and every trade, siege, and alliance carries real weight. Born from the best of both universes — built for those who never stopped believing MMORPGs could be greater.'

export default function About() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const refresh = () => setIsLoggedIn(!!getToken())
    refresh()
    window.addEventListener('auth-change', refresh)
    return () => window.removeEventListener('auth-change', refresh)
  }, [])

  return (
    <motion.section
      className="relative z-20 -mt-20 md:-mt-28 lg:-mt-36 py-20 md:py-32 overflow-hidden bg-[#130E0A]"
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.h2
          className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-gold-500 uppercase tracking-wide mb-8 leading-tight"
          variants={fadeUp}
        >
          {headline}
        </motion.h2>

        <motion.p
          className="text-paper-200 text-base md:text-lg leading-relaxed mb-10 max-w-3xl mx-auto"
          variants={fadeUp}
        >
          {description}
        </motion.p>

        {!isLoggedIn && (
          <motion.div variants={fadeUp}>
            <Link
              to="/register"
              className="inline-block btn-gold px-12 py-4"
            >
              Join the Fight
            </Link>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}
