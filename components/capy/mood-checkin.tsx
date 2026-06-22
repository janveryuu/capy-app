'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Sparkles, Check, PartyPopper, Wind, ArrowLeft } from 'lucide-react'
import { MOODS, MOOD_TAGS, type Mood } from '@/lib/capy-data'
import { cn } from '@/lib/utils'

type Step = 'mood' | 'context' | 'done'

export function MoodCheckin({
  onBreatheTrigger,
  onLogMood,
}: {
  onBreatheTrigger?: () => void
  onLogMood?: (mood: Mood, tags: string[], note: string) => void
}) {
  const [step, setStep] = useState<Step>('mood')
  const [selected, setSelected] = useState<Mood | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [note, setNote] = useState('')

  const toggleTag = (id: string) =>
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    )

  const handleMoodPick = (mood: Mood) => {
    setSelected(mood)
    setStep('context')
  }

  const handleLog = () => {
    if (selected && onLogMood) {
      onLogMood(selected, selectedTags, note)
    }
    setStep('done')
  }

  const handleReset = () => {
    setStep('mood')
    setSelected(null)
    setSelectedTags([])
    setNote('')
  }

  const isLowMood = selected && selected.score <= 2

  return (
    <section className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)] sm:p-8">
      <div className="flex items-center gap-2 text-caramel">
        <Sparkles className="size-5" />
        <span className="font-heading text-sm font-semibold uppercase tracking-wide">
          Daily check-in
        </span>
      </div>

      <div className="mt-2 min-h-[280px]">
        <AnimatePresence mode="wait">
          {/* ──── STEP 1: Mood Picker ──── */}
          {step === 'mood' && (
            <motion.div
              key="step-mood"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-balance font-heading text-2xl font-semibold text-foreground sm:text-3xl">
                How are you feeling today, friend?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tap the little capy that matches your heart right now.
              </p>

              <div className="mt-6 grid grid-cols-5 gap-2 sm:gap-3">
                {MOODS.map((mood) => {
                  const Icon = mood.icon
                  return (
                    <motion.button
                      key={mood.id}
                      type="button"
                      onClick={() => handleMoodPick(mood)}
                      whileHover={{ scale: 1.08, y: -4 }}
                      whileTap={{ scale: 0.88 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      aria-label={mood.label}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-3xl p-2 ring-2 transition-all duration-200 sm:p-3',
                        mood.bg,
                        mood.ring,
                        'ring-transparent',
                      )}
                    >
                      <Icon className={cn('size-7 sm:size-8', mood.iconColor)} strokeWidth={2.2} />
                      <span className={cn('text-[0.65rem] font-bold sm:text-xs', mood.iconColor)}>
                        {mood.label}
                      </span>
                    </motion.button>
                  )
                })}
              </div>

              <p className="mt-6 px-1 text-sm text-muted-foreground">
                No pressure — Capy is here whenever you&apos;re ready. 🤎
              </p>
            </motion.div>
          )}

          {/* ──── STEP 2: Context (Tags + Note) ──── */}
          {step === 'context' && selected && (
            <motion.div
              key="step-context"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('mood')}
                  className="grid size-9 place-items-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <div>
                  <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                    Feeling {selected.label.toLowerCase()}.{' '}
                    <span className="text-muted-foreground font-normal text-lg">{selected.caption}</span>
                  </h2>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-5">
                <p className="mb-2.5 text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  What&apos;s shaping today?
                </p>
                <div className="flex flex-wrap gap-2">
                  {MOOD_TAGS.map((tag) => {
                    const Icon = tag.icon
                    const active = selectedTags.includes(tag.id)
                    return (
                      <motion.button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        whileTap={{ scale: 0.92 }}
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-all',
                          active
                            ? 'bg-caramel text-caramel-foreground ring-2 ring-caramel/40 ring-offset-1 ring-offset-card shadow-sm'
                            : 'bg-secondary/60 text-muted-foreground hover:bg-secondary',
                        )}
                      >
                        <Icon className="size-3.5" strokeWidth={2.4} />
                        {tag.label}
                        {active && <Check className="size-3" strokeWidth={3} />}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Note */}
              <div className="mt-5">
                <p className="mb-2 text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  A little reflection
                </p>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={200}
                  rows={2}
                  placeholder="What made today feel this way?"
                  className="w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm font-semibold text-foreground outline-none transition-shadow resize-none placeholder:font-medium placeholder:text-muted-foreground focus:ring-2 focus:ring-caramel/50"
                />
                <p className="mt-1 text-right text-[0.65rem] text-muted-foreground">
                  {note.length}/200
                </p>
              </div>

              <motion.button
                type="button"
                onClick={handleLog}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-caramel px-5 py-3 text-sm font-bold text-caramel-foreground shadow-md hover:shadow-lg transition-shadow"
              >
                <Check className="size-4" strokeWidth={3} />
                Log my mood
              </motion.button>
            </motion.div>
          )}

          {/* ──── STEP 3: Celebration ──── */}
          {step === 'done' && selected && (
            <motion.div
              key="step-done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
              className="flex flex-col items-center py-8 text-center"
            >
              <motion.div
                animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
                transition={{ duration: 0.6 }}
              >
                <PartyPopper className="size-12 text-matcha-foreground" />
              </motion.div>
              <h2 className="mt-4 font-heading text-2xl font-bold text-foreground">
                Mood logged! 🎉
              </h2>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                You&apos;re doing great, friend. Capy is proud of you for checking in.
              </p>

              {selectedTags.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {selectedTags.map((tagId) => {
                    const tag = MOOD_TAGS.find((t) => t.id === tagId)
                    if (!tag) return null
                    return (
                      <span
                        key={tagId}
                        className="rounded-full bg-secondary/60 px-2.5 py-1 text-[0.65rem] font-bold text-muted-foreground"
                      >
                        {tag.label}
                      </span>
                    )
                  })}
                </div>
              )}

              {/* Breathing suggestion for low moods */}
              {isLowMood && onBreatheTrigger && (
                <motion.button
                  type="button"
                  onClick={onBreatheTrigger}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-matcha/40 px-5 py-3 text-sm font-bold text-matcha-foreground shadow-sm transition-shadow hover:shadow-md"
                >
                  <Wind className="size-4" />
                  Breathe with Capy
                </motion.button>
              )}

              <button
                type="button"
                onClick={handleReset}
                className="mt-4 text-xs font-bold text-muted-foreground underline-offset-2 hover:underline transition-colors hover:text-foreground"
              >
                Log another mood
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
