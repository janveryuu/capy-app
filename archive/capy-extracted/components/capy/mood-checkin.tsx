'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Sparkles, Check } from 'lucide-react'
import { MOODS, type Mood } from '@/lib/capy-data'
import { cn } from '@/lib/utils'

export function MoodCheckin() {
  const [selected, setSelected] = useState<Mood | null>(null)
  const [saved, setSaved] = useState(false)

  return (
    <section className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)] sm:p-8">
      <div className="flex items-center gap-2 text-caramel">
        <Sparkles className="size-5" />
        <span className="font-heading text-sm font-semibold uppercase tracking-wide">
          Daily check-in
        </span>
      </div>
      <h2 className="mt-2 text-balance font-heading text-2xl font-semibold text-foreground sm:text-3xl">
        How are you feeling today, friend?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Tap the little capy that matches your heart right now.
      </p>

      <div className="mt-6 grid grid-cols-5 gap-2 sm:gap-3">
        {MOODS.map((mood) => {
          const Icon = mood.icon
          const isActive = selected?.id === mood.id
          return (
            <motion.button
              key={mood.id}
              type="button"
              onClick={() => {
                setSelected(mood)
                setSaved(false)
              }}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              aria-pressed={isActive}
              aria-label={mood.label}
              className={cn(
                'flex flex-col items-center gap-2 rounded-3xl p-2 ring-2 transition-colors sm:p-3',
                mood.bg,
                isActive
                  ? 'ring-caramel ring-offset-2 ring-offset-card'
                  : cn(mood.ring, 'ring-transparent'),
              )}
            >
              <Icon className={cn('size-7 sm:size-8', mood.iconColor)} strokeWidth={2.2} />
              <span
                className={cn(
                  'text-[0.65rem] font-bold sm:text-xs',
                  mood.iconColor,
                )}
              >
                {mood.label}
              </span>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-6 min-h-[3.5rem]">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-start justify-between gap-3 rounded-3xl bg-secondary/60 p-4 sm:flex-row sm:items-center"
            >
              <p className="text-sm font-semibold text-secondary-foreground">
                {selected.caption}.{' '}
                <span className="font-normal text-muted-foreground">
                  Thanks for sharing with me.
                </span>
              </p>
              <motion.button
                type="button"
                onClick={() => setSaved(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-caramel px-5 py-2.5 text-sm font-bold text-caramel-foreground shadow-sm"
              >
                {saved ? (
                  <>
                    <Check className="size-4" /> Logged!
                  </>
                ) : (
                  'Log my mood'
                )}
              </motion.button>
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-1 text-sm text-muted-foreground"
            >
              No pressure — Capy is here whenever you&apos;re ready. 🤎
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
