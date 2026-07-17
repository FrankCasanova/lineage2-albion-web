import { motion } from 'framer-motion'
import { fadeUp } from '../lib/motion'

export default function Footer() {
  return (
    <motion.footer
      className="relative z-20 bg-[#130E0A] border-t border-paper-200/20 mt-auto"
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-6 text-center">
        <p className="text-ink-500 text-sm">
          © {new Date().getFullYear()} Frank Casanova. All rights reserved.
        </p>
      </div>
    </motion.footer>
  )
}
