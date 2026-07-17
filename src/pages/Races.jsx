import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fadeUp, stagger } from '../lib/motion'
import { RACES } from '../data/races'
import RaceCard from '../components/RaceCard'

export default function Races() {
  return (
    <motion.section
      className="max-w-6xl mx-auto px-4 py-16 md:py-24"
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      <motion.div className="text-center mb-14" variants={fadeUp}>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink-900 uppercase tracking-wide mb-4">
          Choose Your Race
        </h1>
        <p className="text-ink-500 text-base md:text-lg max-w-2xl mx-auto">
          In Aden, lineage shapes destiny. Each race carries unique strengths,
          aesthetics, and paths to power. Pick yours wisely.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {RACES.map((race) => (
          <Link key={race.id} to={`/races/${race.id}`} className="block">
            <RaceCard race={race} />
          </Link>
        ))}
      </div>
    </motion.section>
  )
}
