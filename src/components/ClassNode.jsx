import { motion } from 'framer-motion'
import { fadeUp } from '../lib/motion'

function TierBadge({ tier }) {
  const color =
    tier === 1
      ? 'bg-ink-500 text-paper-100'
      : tier === 2
        ? 'bg-gold-500 text-ink-900'
        : tier === 3
          ? 'bg-line text-ink-700'
          : 'bg-gold-500/10 text-gold-500 border border-gold-500/30'

  return (
    <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm ${color}`}>
      Tier {tier}
    </span>
  )
}

export default function ClassNode({ node, accent, depth = 0 }) {
  const tier = depth + 1
  const hasChildren = node.children && node.children.length > 0

  return (
    <motion.div variants={fadeUp}>
      <div
        className="relative"
        style={{ marginLeft: depth > 0 ? 24 : 0 }}
      >
        {depth > 0 && (
          <span
            className="absolute -left-[18px] top-6 w-5 h-px bg-line"
            aria-hidden="true"
          />
        )}

        <div className="flex items-start gap-4 p-4 bg-paper-50 border border-line">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold text-paper-200 bg-ink-900 flex-shrink-0 border-2 ${accent || 'border-line'}`}>
            Class
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h3 className="font-display text-lg font-bold text-ink-900 uppercase tracking-wide truncate">
                {node.name}
              </h3>
              <TierBadge tier={tier} />
            </div>
            <p className="text-ink-500 text-sm leading-relaxed">
              {node.description}
            </p>
          </div>
        </div>

        {hasChildren && (
          <div className="mt-4 flex flex-col gap-4">
            {node.children.map((child) => (
              <div
                key={child.id}
                className="relative"
                style={{ marginLeft: 24 }}
              >
                <span className="absolute -left-[18px] top-6 w-5 h-px bg-line" aria-hidden="true" />
                <ClassNode node={child} accent={accent} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
