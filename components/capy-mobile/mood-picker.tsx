'use client'

import { motion } from 'motion/react'
import { MOODS, type MoodId } from '@/lib/capy-mobile-data'
import { cn } from '@/lib/utils'

/**
 * A row of 5 mood orbs matching the website's aesthetic.
 * Each mood has its own vibrant background color (matcha, honey, etc.)
 * with the icon + label inside. Tapping gives a bouncy pop.
 */
export function MoodPicker({
  value,
  onSelect,
  size = 'md',
}: {
  value: MoodId | null
  onSelect: (mood: MoodId) => void
  size?: 'md' | 'lg'
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {MOODS.map((mood) => {
        const isActive = value === mood.id
        const Icon = mood.icon
        return (
          <motion.button
            key={mood.id}
            type="button"
            onClick={() => onSelect(mood.id)}
            aria-pressed={isActive}
            aria-label={mood.label}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className={cn(
              'flex flex-col items-center gap-2 rounded-3xl p-2.5 ring-2 transition-all duration-200',
              mood.bg,
              isActive ? mood.ring : 'ring-transparent',
              isActive && 'shadow-cozy',
            )}
          >
            <Icon
              className={cn(
                size === 'lg' ? 'size-8' : 'size-7',
                mood.iconColor,
              )}
              strokeWidth={2.2}
            />
            <span
              className={cn(
                'text-[0.65rem] font-bold',
                mood.iconColor,
              )}
            >
              {mood.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
