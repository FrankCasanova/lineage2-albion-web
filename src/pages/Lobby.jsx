import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Lobby() {
  const navigate = useNavigate()

  useEffect(() => {
    if (sessionStorage.getItem('l2a_seen')) {
      navigate('/home', { replace: true })
    }
  }, [navigate])

  const handleEnter = () => {
    const audio = new Audio('/web-intro.mp3')
    audio.play()
    sessionStorage.setItem('l2a_seen', '1')
    navigate('/home')
  }

  return (
    <motion.div
      className="min-h-screen bg-[#130E0A] flex items-center justify-center overflow-hidden"
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="text-center px-4">
        <motion.h1
          className="font-display text-3xl md:text-5xl lg:text-6xl text-gold-500 uppercase tracking-wide mb-16 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          Do you want to see...
        </motion.h1>

        <motion.button
          onClick={handleEnter}
          className="btn-gold px-16 py-5 text-lg cursor-pointer"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.06, boxShadow: '0 0 30px rgba(176, 141, 87, 0.4)' }}
          whileTap={{ scale: 0.96 }}
        >
          Enter
        </motion.button>
      </div>
    </motion.div>
  )
}
