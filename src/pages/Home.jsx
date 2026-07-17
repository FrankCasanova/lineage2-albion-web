import { motion } from 'framer-motion'
import { fadeIn } from '../lib/motion'
import Logo from '../components/Logo'
import About from '../components/About'
import Background from '../components/Background'

export default function Home() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      variants={fadeIn}
    >
      {/* Parallax scene - 100vh full viewport height */}
      <section className="relative h-screen overflow-hidden bg-[#130E0A]">
        <Background />
        <Logo />
      </section>
      
      {/* Content section — pulled up to peek over hero */}
      <section className="relative z-20 -mt-64 md:-mt-32">
        <About />
      </section>
    </motion.div>
  )
}
