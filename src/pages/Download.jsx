import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, stagger } from '../lib/motion'

const OPTIONS = [
  
  {
    title: '1. Download Client',
    description:
      'Full game client for a manual install. Use this if you prefer to set up the game yourself.',
    href: 'https://download1351.mediafire.com/gspmtexga67gIqZ6eVv-oGwR5MsNlFggeUkFknB1dAu-9cRtO-_14m8sL6xbdvn7H2iv1-KhBkadWBXVNJgMjX3xypF6oFGH-sm3-N6l1ql0Yh5CMJUf3xNzc8iG70UtkVxLBlEQfCnRXmx4VrqwWyuEemzJMl_l1GiUqbyfv2jh/nuu5qgqo2ie76ms/L2_Albion.7z',
    download: false,
    external: true,
    primary: false,
    cta: 'Download Client',
  },
  {
    title: '2. Download Launcher',
    description:
      'Our lightweight launcher keeps the game patched and up to date automatically. Recommended for most players.',
    href: '/api/download/launcher',
    download: true,
    external: false,
    primary: true,
    cta: 'Download Launcher',
  },
]

export default function Download() {
  const [showModal, setShowModal] = useState(false)

  const handleDownloadClient = (e) => {
    e.preventDefault()
    const audio = new Audio('/web-download.mp3')
    audio.play()
    setShowModal(true)
    window.open('https://download1351.mediafire.com/gspmtexga67gIqZ6eVv-oGwR5MsNlFggeUkFknB1dAu-9cRtO-_14m8sL6xbdvn7H2iv1-KhBkadWBXVNJgMjX3xypF6oFGH-sm3-N6l1ql0Yh5CMJUf3xNzc8iG70UtkVxLBlEQfCnRXmx4VrqwWyuEemzJMl_l1GiUqbyfv2jh/nuu5qgqo2ie76ms/L2_Albion.7z', '_blank', 'noopener,noreferrer')
  }
  return (
    <motion.section
      className="max-w-5xl mx-auto px-4 py-16"
      variants={stagger}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
    >
      <motion.div className="text-center mb-12" variants={fadeUp}>
        {/* <h1 className="font-display text-4xl md:text-5xl font-bold text-ink-900 uppercase tracking-wide mb-4">
          Download
        </h1>*/}
        <p className="text-ink-500 text-base md:text-lg max-w-2xl mx-auto">
          Grab the launcher or the full client and join Lineage 2 Albion.
        </p>
      </motion.div>

      <motion.div className="mb-12 panel-l2 p-8" variants={fadeUp}>
        <h2 className="font-display text-2xl font-bold text-gold-600 uppercase tracking-wide mb-6 text-center">
          Installation Steps
        </h2>
        <ol className="space-y-4 text-ink-700 leading-relaxed max-w-2xl mx-auto">
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gold-500 text-ink-900 font-bold text-sm rounded-full">1</span>
            <span>Download the full client using the <strong>Download Client</strong> button below.</span>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gold-500 text-ink-900 font-bold text-sm rounded-full">2</span>
            <span>Decompress the downloaded file. This will create a folder called <code className="bg-paper-200 px-2 py-0.5 rounded text-ink-900 font-bold">L2_Albion</code>.</span>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gold-500 text-ink-900 font-bold text-sm rounded-full">3</span>
            <span>Download the launcher using the <strong>Download Launcher</strong> button below.</span>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gold-500 text-ink-900 font-bold text-sm rounded-full">4</span>
            <span>Move the launcher file inside the <code className="bg-paper-200 px-2 py-0.5 rounded text-ink-900 font-bold">L2_Albion</code> folder.</span>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gold-500 text-ink-900 font-bold text-sm rounded-full">5</span>
            <span>Run the launcher. It will patch the game files automatically.</span>
          </li>
        </ol>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {OPTIONS.map((opt) => (
          <motion.div
            key={opt.title}
            className="panel-l2 p-8 flex flex-col"
            variants={fadeUp}
          >
              <h2 className="font-display text-2xl font-bold text-gold-600 uppercase tracking-wide mb-4">
              {opt.title}
            </h2>
            <p className="text-ink-700 leading-relaxed mb-8 flex-1">
              {opt.description}
            </p>
            {opt.external ? (
              <motion.button
                onClick={handleDownloadClient}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`inline-block text-center font-bold text-sm uppercase tracking-widest px-10 py-4 transition-colors cursor-pointer ${
                  opt.primary
                    ? 'bg-gold-500 hover:bg-gold-400 text-ink-900'
                    : 'btn-outline-gold'
                }`}
              >
                {opt.cta}
              </motion.button>
            ) : (
              <motion.a
                href={opt.href}
                download
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`inline-block text-center font-bold text-sm uppercase tracking-widest px-10 py-4 transition-colors ${
                  opt.primary
                    ? 'bg-gold-500 hover:bg-gold-400 text-ink-900'
                    : 'btn-outline-gold'
                }`}
              >
                {opt.cta}
              </motion.a>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-[#130E0A] border border-gold-700/40 rounded-2xl p-8 max-w-md text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`${import.meta.env.BASE_URL}dancing_cat.gif`}
                alt="Dancing cat"
                className="w-48 h-48 object-contain mx-auto mb-6 rounded-lg"
              />
              <p className="font-display text-xl md:text-2xl text-gold-500 uppercase tracking-wide mb-6 leading-relaxed">
                NICE! DANCE WITH ME WHILE WAITING THE DOWNLOAD!
              </p>
              <p className="text-paper-200 text-sm italic mb-6">
                this is my favourite song :)
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="btn-gold px-8 py-3 text-sm cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
