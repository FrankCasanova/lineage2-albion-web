import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fadeUp, stagger } from '../lib/motion'
import { RACE_CLASSES } from '../data/races'
import PlaceholderClass from '../components/PlaceholderClass'

export default function RaceDetail() {
  const { raceId } = useParams()
  const race = RACE_CLASSES[raceId]

  return (
    <motion.section
      className="max-w-6xl mx-auto px-4 py-16 md:py-24"
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      <motion.div className="mb-10" variants={fadeUp}>
        <Link to="/races" className="text-gold-500 text-sm font-bold uppercase tracking-widest hover:text-gold-400">
          ← Back to Races
        </Link>
      </motion.div>

      {race ? (
        <>
          <motion.div className="text-center mb-14" variants={fadeUp}>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-ink-900 uppercase tracking-wide mb-4">
              {raceId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </h1>
            <p className="text-ink-500 text-base md:text-lg max-w-2xl mx-auto">
              Choose a class path and plan your build. Each branch offers unique
              strengths and evolution choices at higher tiers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {race.branches.map((branch) => (
              <motion.div key={branch.id} className="panel-l2 p-6 md:p-8" variants={fadeUp}>
                <h2 className="font-display text-2xl font-bold text-gold-500 uppercase tracking-wide mb-6">
                  {branch.name}
                </h2>
                <div className="flex flex-col gap-5">
                  {branch.classes.map((cls) => (
                    <motion.div
                      key={cls.id}
                      className="flex items-start gap-4 p-4 bg-paper-50 border border-line"
                      variants={fadeUp}
                    >
                      <PlaceholderClass name={cls.name} />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h3 className="font-display text-lg font-bold text-ink-900 uppercase tracking-wide">
                            {cls.name}
                          </h3>
                          <span className="text-xs font-bold tracking-widest uppercase bg-line text-ink-500 px-2 py-0.5 rounded-sm">
                            Tier {cls.tier}
                          </span>
                        </div>
                        <p className="text-ink-500 text-sm leading-relaxed">
                          {cls.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <motion.div className="text-center" variants={fadeUp}>
          <h1 className="font-display text-3xl font-bold text-ink-900 uppercase mb-4">Race not found</h1>
          <p className="text-ink-500 mb-6">The requested race does not exist or has been removed.</p>
          <Link to="/races" className="inline-block btn-gold px-10 py-3">
            Browse Races
          </Link>
        </motion.div>
      )}
    </motion.section>
  )
}
