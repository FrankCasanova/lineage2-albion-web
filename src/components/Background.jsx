
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const BASE = import.meta.env.BASE_URL

const LAYERS = [
  {
    src: `${BASE}layer6.jpg`,
    depth: 0.0,
    zIndex: 0,
    desktop: {
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
    },
    mobile: {
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
    },
  },
  {
    src: `${BASE}layer5.png`,
    depth: 0.08,
    zIndex: 1,
    opacity: 0.8,
    desktop: {
      backgroundSize: '100% auto',
      backgroundPosition: 'center top',
    },
    mobile: {
      backgroundSize: '290% auto',
      backgroundPosition: 'center top',
    },
  },
  {
    src: `${BASE}layer4.png`,
    depth: 0.16,
    zIndex: 2,
    desktop: {
      backgroundSize: '100% auto',
      backgroundPosition: 'center calc(100% - 1vh)',
    },
    mobile: {
      backgroundSize: '140% auto',
      backgroundPosition: 'center calc(100% - 10vh)',
    },
  },
  {
    src: `${BASE}layer3.png`,
    depth: 0.28,
    zIndex: 3,
    desktop: {
      backgroundSize: '100% auto',
      backgroundPosition: 'center calc(100% - 3vh)',
    },
    mobile: {
      backgroundSize: '150% auto',
      backgroundPosition: 'center calc(100% - 15vh)',
    },
  },
  {
    src: `${BASE}layer2.png`,
    depth: 0.45,
    zIndex: 4,
    desktop: {
      backgroundSize: 'auto 25%',
      backgroundPosition: 'right calc(100% - 13vh)',
    },
    mobile: {
      backgroundSize: 'auto 18%',
      backgroundPosition: 'right -3% bottom 16vh',
    },
  },
  {
    src: `${BASE}layer1.png`,
    depth: 0.65,
    zIndex: 30,
    desktop: {
      backgroundSize: '100% auto',
      backgroundPosition: 'center calc(100% + 30vh)',
    },
    mobile: {
      backgroundSize: '180% auto',
      backgroundPosition: 'center bottom -1vh',
    },
  },
]

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const onChange = (e) => setIsMobile(e.matches)
    setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMobile
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export default function Background() {
  const isMobile = useIsMobile()

  // ponytail: all hooks called unconditionally — Rules of Hooks
  const layerY0 = useMotionValue(0)
  const layerY1 = useMotionValue(0)
  const layerY2 = useMotionValue(0)
  const layerY3 = useMotionValue(0)
  const layerY4 = useMotionValue(0)
  const layerY5 = useMotionValue(0)
  const layerYValues = [layerY0, layerY1, layerY2, layerY3, layerY4, layerY5]

  const layer2X = useMotionValue(typeof window !== 'undefined' ? Math.min(window.innerWidth * (isMobile ? 0.35 : 1), 420) : 0)
  const layer2XSpring = useSpring(layer2X, { stiffness: 10, damping: 20 })
  const layer2Opacity = useMotionValue(isMobile ? 1 : 0)
  const layer2OpacitySpring = useSpring(layer2Opacity, { stiffness: 120, damping: 24 })

  const resolvedLayers = useMemo(() => {
    return LAYERS.map((layer) => ({
      ...layer,
      backgroundSize: isMobile
        ? (layer.mobile?.backgroundSize ?? layer.desktop.backgroundSize)
        : layer.desktop.backgroundSize,
      backgroundPosition: isMobile
        ? (layer.mobile?.backgroundPosition ?? layer.desktop.backgroundPosition)
        : layer.desktop.backgroundPosition,
    }))
  }, [isMobile])

  useEffect(() => {
    let raf = 0

    const update = () => {
      const scrollY = window.scrollY || window.pageYOffset
      layerYValues.forEach((yValue, index) => {
        const baseDepth = resolvedLayers[index].depth
        const depth = isMobile ? baseDepth * 0.35 : baseDepth
        const maxOffset = isMobile ? 80 : 220
        yValue.set(clamp(-(scrollY * depth), -maxOffset, 0))
      })
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [isMobile, resolvedLayers, layerYValues])

  useEffect(() => {
    if (isMobile) {
      layer2X.set(0)
      layer2Opacity.set(1)
      return
    }

    const timer = window.setTimeout(() => {
      layer2X.set(0)
      layer2Opacity.set(1)
    }, 500)

    return () => window.clearTimeout(timer)
  }, [isMobile, layer2Opacity, layer2X])

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ height: '100dvh' }}
    >
      <div className="relative mx-auto h-full w-full max-w-[1900px] bg-[#130E0A]">
        {resolvedLayers.map((layer, index) => {
          const isLayer2 = index === 4

          return (
            <motion.div
              key={layer.src}
              aria-hidden="true"
              className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
              style={{
                backgroundImage: `url("${layer.src}")`,
                backgroundSize: layer.backgroundSize,
                backgroundPosition: layer.backgroundPosition,
                zIndex: layer.zIndex,
                opacity: isLayer2 ? layer2OpacitySpring : (layer.opacity ?? 1),
                x: isLayer2 ? layer2XSpring : 0,
                y: layerYValues[index],
              }}
            />
          )
        })}
      </div>

      <div className="absolute inset-0 z-[5] bg-gradient-to-b from-black/40 via-transparent to-transparent" />
    </div>
  )
}
