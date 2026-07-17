
import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const BASE = import.meta.env.BASE_URL

const DESKTOP_LAYERS = [
  { src: `${BASE}layer6.jpg`, depth: 0.0, backgroundSize: '100% auto', backgroundPosition: 'center top', zIndex: 0 },
  { src: `${BASE}layer5.png`, depth: 0.1, backgroundSize: '320% auto', backgroundPosition: 'center top', zIndex: 1, opacity: 0.8 },
  { src: `${BASE}layer4.png`, depth: 0.2, backgroundSize: '50% auto', backgroundPosition: 'center bottom', zIndex: 2 },
  { src: `${BASE}layer3.png`, depth: 0.4, backgroundSize: '100% auto', backgroundPosition: 'center calc(100% - 30px)', zIndex: 3 },
  { src: `${BASE}layer2.png`, depth: 0.7, backgroundSize: 'auto 40%', backgroundPosition: 'right calc(100% - 50px)', zIndex: 4 },
  { src: `${BASE}layer1.png`, depth: 1.0, backgroundSize: '100%', backgroundPosition: 'center calc(100% - 29px)', zIndex: 30 },
]

// ponytail: mobile depths halved for subtler parallax on short viewports
const MOBILE_LAYERS = [
  { ...DESKTOP_LAYERS[0], backgroundSize: '300% auto' },
  { ...DESKTOP_LAYERS[1]},
  { ...DESKTOP_LAYERS[2], depth: 0.1, backgroundSize: '110% auto',backgroundPosition: 'center calc(100% - 0px)' },
  { ...DESKTOP_LAYERS[3], depth: 0.2, backgroundSize: '100% auto',backgroundPosition: 'center calc(100% - 0px)'  },
  { ...DESKTOP_LAYERS[4], depth: 0.35, backgroundSize: '25% auto',backgroundPosition: 'right calc(100% - 5px)' },
  { ...DESKTOP_LAYERS[5], depth: 0.5, backgroundSize: '100% auto',backgroundPosition: 'center calc(100% - 14px)'  },
]

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

export default function Background() {
  const isMobile = useIsMobile()
  const LAYERS = isMobile ? MOBILE_LAYERS : DESKTOP_LAYERS

  const layerYValues = LAYERS.map(() => useMotionValue(0))

  const layer2X = useMotionValue(window.innerWidth)
  const layer2XSpring = useSpring(layer2X, { stiffness: 20, damping: 40 })
  const layer2Opacity = useMotionValue(0)
  const layer2OpacitySpring = useSpring(layer2Opacity, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const handleScroll = () => {
      const topDistance = window.pageYOffset
      layerYValues.forEach((yValue, index) => {
        const depth = LAYERS[index].depth
        yValue.set(-(topDistance * depth))
      })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [layerYValues, LAYERS])

  useEffect(() => {
    const timer = setTimeout(() => {
      layer2X.set(0)
      layer2Opacity.set(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [layer2X, layer2Opacity])

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="relative mx-auto h-full w-full max-w-[1900px]">
        {LAYERS.map((layer, index) => {
          const isLayer2 = index === 4
          return (
            <motion.div
              key={layer.src}
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-full bg-no-repeat will-change-transform"
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
      <div className="absolute inset-0 z-5 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
    </div>
  )
}
