import { motion } from 'framer-motion'

export default function PlaceholderClass({ name }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <motion.div className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold text-paper-200 bg-ink-900 flex-shrink-0" whileHover={{ scale: 1.05 }}>
      <span>{initials}</span>
    </motion.div>
  )
}
