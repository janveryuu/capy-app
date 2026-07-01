'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Coffee,
  MapPin,
  PartyPopper,
  Sparkles,
} from 'lucide-react'
import {
  MOODS,
  MOOD_TAGS,
  TRIPS,
  moodById,
  tripProgress,
  type Mood,
  type MoodId,
  type MoodJournalEntry,
} from '@/lib/capy-mobile-data'
import { CapyMobileMascot } from './capy-mobile-mascot'
import { MoodPicker } from './mood-picker'
import { cn } from '@/lib/utils'
import type { TabId } from './capy-mobile-app'

type CheckinStep = 'pick' | 'context' | 'done'

/**
 * Mobile home screen — mirrors the website's rich mood check-in flow:
 * Step 1: Pick a mood (colored circles)
 * Step 2: Add context tags + reflection note
 * Step 3: Celebration
 */
export function HomeScreen({
  todayMood,
  onSelectMood,
  onNavigate,
  onLogMood,
}: {
  todayMood: MoodId | null
  onSelectMood: (mood: MoodId) => void
  onNavigate: (tab: TabId) => void
  onLogMood?: (entry: MoodJournalEntry) => void
}) {
  const nextTrip = TRIPS[0]
  const { done, total } = tripProgress(nextTrip)

  // ── Multi-step check-in state ──
  const [step, setStep] = useState<CheckinStep>('pick')
  const [pickedMood, setPickedMood] = useState<Mood | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [note, setNote] = useState('')

  const toggleTag = (id: string) =>
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    )

  const handleMoodPick = (mood: Mood) => {
    setPickedMood(mood)
    onSelectMood(mood.id)
    setStep('context')
  }

  const handleLog = () => {
    if (pickedMood && onLogMood) {
      onLogMood({
        id: `j-${Date.now()}`,
        mood: pickedMood,
        tags: selectedTags,
        note,
        timestamp: 'Just now',
      })
    }
    setStep('done')
  }

  const handleReset = () => {
    setStep('pick')
    setPickedMood(null)
    setSelectedTags([])
    setNote('')
  }

  return (
    <div className="flex flex-col gap-5">
      {/* ── Greeting header with waving Capy ── */}
      <header className="flex items-center justify-between gap-3 pt-1">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-muted-foreground">
            Wednesday, June 30
          </p>
          <h1 className="text-balance text-2xl font-extrabold leading-tight text-foreground">
            Welcome back, friend
          </h1>
        </div>
        <CapyMobileMascot size={72} priority />
      </header>

      {/* ── Multi-step mood check-in card ── */}
      <section className="rounded-[2rem] border border-border bg-card p-5 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)]">
        {/* Header label */}
        <div className="flex items-center gap-2 text-caramel">
          <Sparkles className="size-5" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Daily check-in
          </span>
        </div>

        <div className="mt-2 min-h-[220px]">
          <AnimatePresence mode="wait">
            {/* ──── STEP 1: Mood Picker ──── */}
            {step === 'pick' && (
              <motion.div
                key="step-pick"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-xl font-extrabold text-foreground">
                  How are you feeling today, friend?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tap the little capy that matches your heart right now.
                </p>

                <div className="mt-5">
                  <div className="grid grid-cols-5 gap-2">
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
                          className={cn(
                            'flex flex-col items-center gap-2 rounded-3xl p-2.5 ring-2 ring-transparent transition-all duration-200',
                            mood.bg,
                          )}
                        >
                          <Icon className={cn('size-7', mood.iconColor)} strokeWidth={2.2} />
                          <span className={cn('text-[0.65rem] font-bold', mood.iconColor)}>
                            {mood.label}
                          </span>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                <p className="mt-5 text-sm text-muted-foreground">
                  No pressure — Capy is here whenever you&apos;re ready. 🤎
                </p>
              </motion.div>
            )}

            {/* ──── STEP 2: Context (Tags + Note) ──── */}
            {step === 'context' && pickedMood && (
              <motion.div
                key="step-context"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Back button + mood summary */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('pick')}
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground transition-colors active:bg-accent"
                  >
                    <ArrowLeft className="size-4" />
                  </button>
                  <div>
                    <h2 className="text-lg font-extrabold text-foreground">
                      Feeling {pickedMood.label.toLowerCase()}.{' '}
                      <span className="font-normal text-muted-foreground">
                        {pickedMood.caption}
                      </span>
                    </h2>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-5">
                  <p className="mb-2.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
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
                              : 'bg-secondary/60 text-muted-foreground active:bg-secondary',
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

                {/* Reflection note */}
                <div className="mt-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    A little reflection
                  </p>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={200}
                    rows={2}
                    placeholder="What made today feel this way?"
                    className="w-full resize-none rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm font-semibold text-foreground outline-none transition-shadow placeholder:font-medium placeholder:text-muted-foreground focus:ring-2 focus:ring-caramel/50"
                  />
                  <p className="mt-1 text-right text-[0.65rem] text-muted-foreground">
                    {note.length}/200
                  </p>
                </div>

                {/* Log button */}
                <motion.button
                  type="button"
                  onClick={handleLog}
                  whileTap={{ scale: 0.97 }}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-caramel px-5 py-3 text-sm font-bold text-caramel-foreground shadow-md transition-shadow active:shadow-lg"
                >
                  <Check className="size-4" strokeWidth={3} />
                  Log my mood
                </motion.button>
              </motion.div>
            )}

            {/* ──── STEP 3: Celebration ──── */}
            {step === 'done' && pickedMood && (
              <motion.div
                key="step-done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
                className="flex flex-col items-center py-6 text-center"
              >
                <motion.div
                  animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  <PartyPopper className="size-12 text-matcha-foreground" />
                </motion.div>
                <h2 className="mt-3 text-xl font-extrabold text-foreground">
                  Mood logged! 🎉
                </h2>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                  You&apos;re doing great, friend. Capy is proud of you for checking in.
                </p>

                {selectedTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
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

                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-4 text-xs font-bold text-muted-foreground underline-offset-2 transition-colors active:text-foreground"
                >
                  Log another mood
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Next adventure card ── */}
      <section>
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-lg font-extrabold text-foreground">
            Your next little adventure
          </h2>
        </div>

        <motion.button
          type="button"
          onClick={() => onNavigate('travel')}
          whileTap={{ scale: 0.98 }}
          className="block w-full overflow-hidden rounded-3xl border border-border/70 bg-card text-left shadow-cozy outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="relative h-40 w-full">
            <Image
              src={nextTrip.image || '/placeholder.svg'}
              alt={nextTrip.destination}
              fill
              className="object-cover"
              sizes="400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-foreground/10 to-transparent" />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-card/85 px-3 py-1 text-xs font-bold text-foreground backdrop-blur">
              <MapPin className="size-3.5 text-primary" strokeWidth={2.6} />
              {nextTrip.dates}
            </span>
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="text-lg font-extrabold text-card">
                {nextTrip.destination}
              </h3>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate text-sm text-muted-foreground">
                {nextTrip.blurb}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-2 w-28 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${(done / total) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-xs font-bold text-muted-foreground">
                  {done}/{total} ready
                </span>
              </div>
            </div>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ChevronRight className="size-5" strokeWidth={2.6} />
            </span>
          </div>
        </motion.button>
      </section>

      {/* ── Tiny encouragement from Capy ── */}
      <section className="flex items-center gap-3 rounded-3xl border border-border/70 bg-accent/60 p-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-card shadow-cozy">
          <Coffee className="size-5 text-primary" strokeWidth={2.4} />
        </div>
        <p className="text-sm font-semibold text-accent-foreground">
          &ldquo;Rest is productive too. Take the slow road today.&rdquo; — Capy
        </p>
      </section>
    </div>
  )
}
