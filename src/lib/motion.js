const EASE = [0.22, 1, 0.36, 1]

export const transition = { duration: 0.5, ease: EASE }

export const scaleInTransition = { duration: 0.6, ease: EASE }

export const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: scaleInTransition },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition },
}
