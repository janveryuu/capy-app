'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { X, MapPin, CalendarDays, Sparkles, Plane } from 'lucide-react'
import type { PlannedTrip } from '@/lib/capy-data'

const VIBES = ['🍃', '🏖️', '🏔️', '🏮', '🍜', '☕'] as const

export type NewTripInput = Omit<PlannedTrip, 'id' | 'status' | 'days'> & { days: number }

export function CreateTripModal({
  open,
  initialDestination,
  onClose,
  onCreate,
}: {
  open: boolean
  initialDestination?: string
  onClose: () => void
  onCreate: (trip: NewTripInput) => void
}) {
  const [mounted, setMounted] = useState(false)
  const [destination, setDestination] = useState('')
  const [country, setCountry] = useState('')
  const [dateRange, setDateRange] = useState('')
  const [days, setDays] = useState(5)
  const [note, setNote] = useState('')
  const [emoji, setEmoji] = useState<string>('🍃')

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (open) {
      setDestination(initialDestination ?? '')
      setCountry('')
      setDateRange('')
      setDays(5)
      setNote('')
      setEmoji('🍃')
    }
  }, [open, initialDestination])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!mounted) return null

  const canSubmit = destination.trim().length > 0

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onCreate({
      destination: destination.trim(),
      country: country.trim() || 'Somewhere lovely',
      dateRange: dateRange.trim() || 'Dates TBD',
      days,
      note: note.trim() || 'A cozy new adventure waiting to be planned.',
      emoji,
    })
    onClose()
  }

  const field =
    'w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm font-semibold text-foreground outline-none transition-shadow placeholder:font-medium placeholder:text-muted-foreground focus:ring-2 focus:ring-caramel/50'

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Plan a new trip"
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="relative z-10 m-0 w-full max-w-lg rounded-t-[2.5rem] border border-border bg-card p-6 shadow-[0_-10px_50px_-12px_rgba(120,80,40,0.4)] sm:m-4 sm:rounded-[2.5rem] sm:p-8"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-caramel">
                  <Plane className="size-5" />
                  <span className="font-heading text-sm font-semibold uppercase tracking-wide">
                    New trip
                  </span>
                </div>
                <h3 className="mt-1 font-heading text-2xl font-bold text-foreground">
                  Plan your next escape
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                  <MapPin className="size-3.5" /> Where to?
                </label>
                <input
                  autoFocus
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Kyoto"
                  className={field}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-muted-foreground">
                    Country
                  </label>
                  <input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Japan"
                    className={field}
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                    <CalendarDays className="size-3.5" /> Dates
                  </label>
                  <input
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    placeholder="Apr 14 – Apr 21"
                    className={field}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-muted-foreground">
                  How many days? <span className="text-caramel">{days}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={21}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full accent-caramel"
                  aria-label="Number of days"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-muted-foreground">
                  Trip vibe
                </label>
                <div className="flex flex-wrap gap-2">
                  {VIBES.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setEmoji(v)}
                      aria-pressed={emoji === v}
                      className={`grid size-11 place-items-center rounded-2xl border text-xl transition-all ${
                        emoji === v
                          ? 'border-caramel bg-caramel/15 scale-105'
                          : 'border-border bg-secondary/40 hover:bg-secondary'
                      }`}
                    >
                      <span aria-hidden>{v}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-muted-foreground">
                  A little note
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="Temples, tea houses, and a slow onsen day…"
                  className={`${field} resize-none`}
                />
              </div>

              <motion.button
                type="submit"
                disabled={!canSubmit}
                whileTap={{ scale: 0.97 }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-caramel py-3.5 font-heading text-base font-bold text-caramel-foreground shadow-md transition-opacity disabled:opacity-50"
              >
                <Sparkles className="size-5" />
                Save this trip
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
