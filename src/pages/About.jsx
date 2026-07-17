import { motion } from 'framer-motion'
import { fadeUp, stagger } from '../lib/motion'

const TIERS = [
  { tier: 1, level: '1 - 19', adena: 20, exp: 4, item: 0 },
  { tier: 2, level: '20 - 39', adena: 35, exp: 8, item: 20 },
  { tier: 3, level: '40 - 60', adena: 100, exp: 13, item: 50 },
  { tier: 4, level: '61+', adena: 100, exp: 17, item: 100 },
]

export default function About() {
  return (
    <motion.section
      className="max-w-5xl mx-auto px-4 py-16"
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      <motion.div className="text-center mb-12" variants={fadeUp}>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink-900 uppercase tracking-wide mb-4">
          A New Way to Die
        </h1>
        <p className="text-ink-500 text-base md:text-lg max-w-2xl mx-auto">
          Lineage 2 Albion blends the classic open-world PvP of Lineage 2 with the
          risk-versus-reward death penalties of Albion Online. Your level defines
          the stakes — the higher you climb, the more you have to lose.
        </p>
      </motion.div>

      <motion.div       className="panel-l2 p-8 mb-12" variants={fadeUp}>
        <h2 className="font-display text-2xl font-bold text-gold-500 uppercase tracking-wide mb-4">
          Progressive Death Penalties
        </h2>
        <p className="text-ink-700 leading-relaxed mb-6">
          Unlike vanilla Lineage 2, where death always hurts the same, here the
          punishment scales with your power. Low-level adventurers roam free with
          gentle consequences, while high-level veterans risk everything they carry
          when they fall. This keeps early game friendly and end game brutally
          meaningful — every fight matters.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">Tier</th>
                <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">Level</th>
                <th className="text-center text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">Adena Lost</th>
                <th className="text-center text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">Exp Lost</th>
                <th className="text-center text-xs font-bold text-ink-500 uppercase tracking-wider py-3 px-4">Items Drop</th>
              </tr>
            </thead>
            <tbody>
              {TIERS.map((t) => (
                <tr key={t.tier} className="border-b border-line hover:bg-paper-200 transition-colors">
                  <td className="py-3 px-4 font-bold text-ink-900">Tier {t.tier}</td>
                  <td className="py-3 px-4 text-ink-700">{t.level}</td>
                  <td className="py-3 px-4 text-center text-gold-500 font-bold">{t.adena}%</td>
                  <td className="py-3 px-4 text-center text-gold-500 font-bold">{t.exp}%</td>
                  <td className="py-3 px-4 text-center text-gold-500 font-bold">{t.item}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-ink-500 text-xs mt-4">
          Adena lost, experience lost, and the chance to drop equipped items on death.
        </p>
      </motion.div>

      <motion.div className="grid md:grid-cols-3 gap-6 mb-12" variants={stagger}>
        <motion.div className="panel-l2 p-6" variants={fadeUp}>
          <h3 className="font-display text-lg font-bold text-ink-900 uppercase tracking-wide mb-2">
            Beginner Friendly
          </h3>
          <p className="text-ink-500 text-sm leading-relaxed">
            Levels 1-19 barely lose a thing. Learn the world, explore, and make your
            first mistakes without fear.
          </p>
        </motion.div>
        <motion.div className="panel-l2 p-6" variants={fadeUp}>
          <h3 className="font-display text-lg font-bold text-ink-900 uppercase tracking-wide mb-2">
            Mid-Game Risk
          </h3>
          <p className="text-ink-500 text-sm leading-relaxed">
            From 20 to 60 you start feeling the weight of every death — adena,
            experience, and the first real chance to lose gear.
          </p>
        </motion.div>
        <motion.div className="panel-l2 p-6" variants={fadeUp}>
          <h3 className="font-display text-lg font-bold text-ink-900 uppercase tracking-wide mb-2">
            End-Game Stakes
          </h3>
          <p className="text-ink-500 text-sm leading-relaxed">
            Level 61 and above: full adena loss, heavy experience loss, and a
            guaranteed item drop. Every battle is a gamble worth winning.
          </p>
        </motion.div>
      </motion.div>

      <motion.div className="text-center" variants={fadeUp}>
        <p className="text-ink-700 text-lg mb-6">
          The adventure rewards the bold. Climb the tiers, master the risk, and
          claim your place in a world where death truly means something.
        </p>
        <motion.a
          href="/register"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block btn-gold px-12 py-4"
        >
          Begin Your Journey
        </motion.a>
      </motion.div>
    </motion.section>
  )
}
