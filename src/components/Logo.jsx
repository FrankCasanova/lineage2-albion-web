import { motion } from 'framer-motion'

export default function Logo() {
  return (
    <motion.div
      className="fixed top-1/2 left-1/2 -translate-x-1/2 top-[33%] -translate-y-1/2 z-10 md:top-4 md:translate-y-0"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 7, ease: [0.22, 1, 0.36, 1], delay: 5 }}
    >
      <div className="relative inline-block">
        <img
          src={`${import.meta.env.BASE_URL}logo-emblem.webp`}
          alt="Lineage 2 emblem"
          className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[40rem] lg:h-[40rem] object-contain drop-shadow-lg"
        />
        <motion.img
          src={`${import.meta.env.BASE_URL}albion-logo.png`}
          alt="Albion logo"
          className="absolute left-1/2 -translate-x-1/2 bottom-[28%] w-28 sm:w-40 md:w-52 lg:w-72 object-contain drop-shadow-lg"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 7 }}
        />
      </div>
    </motion.div>
  )
}
