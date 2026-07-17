import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Emblem logo — fixed position, centered horizontally */}
      <motion.div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, scale: 0.85, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={`${import.meta.env.BASE_URL}logo-emblem.webp`}
          alt="Lineage 2 emblem"
          className="w-80 h-80 md:w-96 md:h-96 lg:w-[40rem] lg:h-[40rem] object-contain drop-shadow-lg"
        />
      </motion.div>
    </section>
  )
}
