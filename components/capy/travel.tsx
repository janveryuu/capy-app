'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import {
  MapPin,
  Check,
  Plane,
  Images,
  CalendarDays,
  Plus,
  Compass,
  Luggage,
  Clock,
  ArrowRight,
} from 'lucide-react'
import {
  UPCOMING_TRIP,
  PLANNED_TRIPS,
  type PlannedTrip,
} from '@/lib/capy-data'
import { cn } from '@/lib/utils'
import { Explore } from './explore'
import { CreateTripModal, type NewTripInput } from './create-trip-modal'
import { AddMemoryModal } from './add-memory-modal'
import { createPlannedTrip, getPlannedTrips, getMemories, createMemory } from '@/app/actions'

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 240, damping: 24 } },
}

type SubView = 'explore' | 'trips'

function Itinerary({ stops }: { stops: typeof UPCOMING_TRIP.itinerary }) {
  return (
    <ol className="relative ml-2 space-y-6 border-l-2 border-dashed border-caramel/40 pl-7">
      {stops.map((stop, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + i * 0.1, type: 'spring', stiffness: 240, damping: 22 }}
          className="relative"
        >
          <span
            className={cn(
              'absolute -left-[2.4rem] grid size-7 place-items-center rounded-full ring-4 ring-card',
              stop.done ? 'bg-matcha text-matcha-foreground' : 'bg-honey text-honey-foreground',
            )}
          >
            {stop.done ? <Check className="size-4" strokeWidth={3} /> : <span className="size-2 rounded-full bg-current" />}
          </span>
          <div className="rounded-3xl bg-secondary/50 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-heading text-base font-bold text-foreground">{stop.title}</p>
              <span className="shrink-0 rounded-full bg-card px-2.5 py-0.5 text-[0.65rem] font-bold text-muted-foreground">
                {stop.time}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{stop.detail}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  )
}

function TripCard({ trip, index, onOpen }: { trip: PlannedTrip; index: number; onOpen: (t: PlannedTrip) => void }) {
  const completed = trip.status === 'completed'
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 240, damping: 24 }}
      whileHover={{ y: -4 }}
      className="rounded-[1.75rem] border border-border bg-card p-5 shadow-[0_12px_34px_-18px_rgba(120,80,40,0.4)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-2xl" aria-hidden>
            {trip.emoji}
          </span>
          <div>
            <h4 className="font-heading text-lg font-bold leading-tight text-foreground">
              {trip.destination}
            </h4>
            <p className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <MapPin className="size-3" /> {trip.country}
            </p>
          </div>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wide',
            completed ? 'bg-matcha text-matcha-foreground' : 'bg-honey text-honey-foreground',
          )}
        >
          {completed ? 'Completed' : 'Planned'}
        </span>
      </div>

      {/* Route line */}
      <div className="mt-4 flex items-center gap-2 text-muted-foreground">
        <span className="text-[0.65rem] font-bold">Home</span>
        <span className="relative h-px flex-1 bg-border">
          <Plane className="absolute left-1/2 top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 text-caramel" />
        </span>
        <span className="text-[0.65rem] font-bold text-foreground">{trip.destination}</span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{trip.note}</p>

      <div className="mt-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1 text-xs font-bold text-muted-foreground">
          <Clock className="size-3.5 text-caramel" />
          {trip.dateRange} · {trip.days}d
        </span>
        <button
          type="button"
          onClick={() => onOpen(trip)}
          className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold text-caramel transition-all hover:bg-caramel/15 active:scale-95"
        >
          {completed ? 'Revisit' : 'Continue'}
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    </motion.article>
  )
}

function PolaroidGallery({ memories }: { memories: any[] }) {
  if (memories.length === 0) return null
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-8 sm:gap-x-6">
      {memories.map((m, i) => (
        <motion.figure
          key={m.id}
          initial={{ opacity: 0, y: 24, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: m.rotate }}
          transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 200, damping: 18 }}
          whileHover={{
            rotate: 0,
            scale: 1.08,
            y: -14,
            zIndex: 20,
            transition: { type: 'spring', stiffness: 300, damping: 18 },
          }}
          className="group relative w-40 cursor-pointer rounded-md bg-card p-2.5 pb-10 shadow-[0_14px_30px_-12px_rgba(120,80,40,0.5)] sm:w-44"
          style={{ rotate: `${m.rotate}deg` }}
        >
          {/* Tape decoration */}
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 h-5 w-10 rounded-sm bg-honey/40 backdrop-blur-sm rotate-[-2deg] shadow-sm" />
          
          <div className="relative aspect-square overflow-hidden rounded-sm bg-muted">
            <Image
              src={m.src || '/placeholder.svg'}
              alt={`${m.caption} in ${m.location}`}
              fill
              sizes="180px"
              className="object-cover transition-all duration-500 ease-out [filter:saturate(0.8)_blur(0.8px)_sepia(0.15)] group-hover:[filter:saturate(1.15)_blur(0px)_sepia(0)] group-hover:scale-105"
            />
          </div>
          <figcaption className="absolute inset-x-0 bottom-2 px-2 text-center">
            <p className="font-heading text-sm font-bold leading-tight text-foreground truncate px-1">
              {m.caption}
            </p>
            <p className="text-[0.65rem] font-semibold text-muted-foreground truncate px-1">{m.location}</p>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  )
}

const SUBS: { id: SubView; label: string; icon: typeof Compass }[] = [
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'trips', label: 'My Trips', icon: Luggage },
]

export function Travel() {
  const [sub, setSub] = useState<SubView>('explore')
  const [trips, setTrips] = useState<PlannedTrip[]>([])
  const [memories, setMemories] = useState<any[]>([])
  
  useEffect(() => {
    getPlannedTrips().then(setTrips).catch(console.error)
    getMemories().then(setMemories).catch(console.error)
  }, [])

  const [modalOpen, setModalOpen] = useState(false)
  const [memoryModalOpen, setMemoryModalOpen] = useState(false)
  const [seedDestination, setSeedDestination] = useState<string | undefined>(undefined)
  const [selectedTrip, setSelectedTrip] = useState<PlannedTrip | null>(null)

  const handleCreateMemory = async (data: { src: string; caption: string; location: string; rotate: number }) => {
    try {
      await createMemory(data)
      const updated = await getMemories()
      setMemories(updated)
    } catch (e) {
      console.error('Failed to create memory:', e)
    }
  }

  const openPlanner = (name?: string) => {
    setSeedDestination(name)
    setModalOpen(true)
  }

  const createTrip = async (input: NewTripInput) => {
    const newTrip: PlannedTrip = {
      ...input,
      id: `${input.destination.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      status: 'planned',
    }
    setTrips((t) => [newTrip, ...t])
    setSub('trips')
    
    try {
      await createPlannedTrip({
        ...input,
        note: input.note || '',
      })
      const updated = await getPlannedTrips()
      setTrips(updated)
    } catch (e) {
      console.error('Failed to save trip:', e)
    }
  }

  const upcoming = trips.filter((t) => t.status === 'planned')
  const past = trips.filter((t) => t.status === 'completed')

  return (
    <div className="space-y-6">
      {/* Sub-tab switcher */}
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-border bg-card p-1 shadow-sm">
          {SUBS.map((s) => {
            const Icon = s.icon
            const active = sub === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSub(s.id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-colors',
                  active ? 'text-caramel-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="capy-travel-sub"
                    className="absolute inset-0 rounded-full bg-caramel"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon className="relative size-4" strokeWidth={2.3} />
                <span className="relative">{s.label}</span>
              </button>
            )
          })}
        </div>

        <motion.button
          type="button"
          onClick={() => openPlanner()}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-1.5 rounded-full bg-caramel px-4 py-2.5 text-sm font-bold text-caramel-foreground shadow-md"
        >
          <Plus className="size-4" strokeWidth={2.6} />
          <span className="hidden sm:inline">Plan a trip</span>
          <span className="sm:hidden">Plan</span>
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={sub}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {sub === 'explore' ? (
            <Explore onPlan={openPlanner} />
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.08 } } }}
              className="space-y-6"
            >
              {/* Featured upcoming hero */}
              <motion.section
                variants={fade}
                className="relative overflow-hidden rounded-[2.5rem] border border-border bg-gradient-to-br from-matcha/40 via-card to-honey/40 p-6 sm:p-9"
              >
                <div className="flex items-center gap-2 text-caramel">
                  <Plane className="size-5" />
                  <span className="font-heading text-sm font-semibold uppercase tracking-wide">
                    Next adventure
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="flex items-center gap-3 font-heading text-4xl font-bold text-foreground">
                      <span aria-hidden>{UPCOMING_TRIP.emoji}</span>
                      {UPCOMING_TRIP.destination}
                    </h2>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                      <MapPin className="size-4" /> {UPCOMING_TRIP.country}
                      <span className="mx-1">·</span>
                      <CalendarDays className="size-4" /> {UPCOMING_TRIP.dateRange}
                    </p>
                  </div>
                  <motion.div
                    className="rounded-3xl bg-card/80 px-5 py-3 text-center shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <p className="font-heading text-3xl font-bold text-caramel">
                      {UPCOMING_TRIP.daysAway}
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground">days to go</p>
                  </motion.div>
                </div>
              </motion.section>

              {/* Upcoming trips */}
              <motion.section variants={fade}>
                <h3 className="font-heading text-2xl font-bold text-foreground">Upcoming trips</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Everything you&apos;re looking forward to, all in one cozy place.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {upcoming.map((t, i) => (
                    <TripCard key={t.id} trip={t} index={i} onOpen={setSelectedTrip} />
                  ))}
                  <motion.button
                    type="button"
                    onClick={() => openPlanner()}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex min-h-[150px] flex-col items-center justify-center gap-2 rounded-[1.75rem] border-2 border-dashed border-caramel/40 bg-card/50 p-5 text-caramel transition-colors hover:border-caramel/70 hover:bg-card"
                  >
                    <span className="grid size-12 place-items-center rounded-2xl bg-caramel/15">
                      <Plus className="size-6" strokeWidth={2.6} />
                    </span>
                    <span className="font-heading text-sm font-bold">Plan a new trip</span>
                  </motion.button>
                </div>
              </motion.section>

              {/* Itinerary */}
              <motion.section
                variants={fade}
                className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)] sm:p-8"
              >
                <div className="mb-5 flex items-center gap-2 text-caramel">
                  <CalendarDays className="size-5" />
                  <span className="font-heading text-sm font-semibold uppercase tracking-wide">
                    {UPCOMING_TRIP.destination} itinerary
                  </span>
                </div>
                <Itinerary stops={UPCOMING_TRIP.itinerary} />
              </motion.section>

              {/* Past trips */}
              {past.length > 0 && (
                <motion.section variants={fade}>
                  <h3 className="font-heading text-2xl font-bold text-foreground">Past trips</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    A gentle look back at where you&apos;ve wandered.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {past.map((t, i) => (
                      <TripCard key={t.id} trip={t} index={i} onOpen={setSelectedTrip} />
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Memories */}
              <motion.section
                variants={fade}
                className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)] sm:p-8"
              >
                <div className="mb-5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-caramel">
                    <Images className="size-5" />
                    <span className="font-heading text-sm font-semibold uppercase tracking-wide">
                      Memories
                    </span>
                  </div>
                  {memories.length > 0 && (
                    <motion.button
                      type="button"
                      onClick={() => setMemoryModalOpen(true)}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-caramel/10 px-3 py-1.5 text-xs font-bold text-caramel transition-colors hover:bg-caramel/20"
                    >
                      <Plus className="size-3.5" />
                      Add photo
                    </motion.button>
                  )}
                </div>
                
                {memories.length > 0 ? (
                  <>
                    <p className="mb-8 text-sm text-muted-foreground">
                      Scattered little Polaroids from past wanders. Hover to peek closer.
                    </p>
                    <PolaroidGallery memories={memories} />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 rounded-[1.5rem] border-2 border-dashed border-border/60 bg-card/30 py-12 text-center">
                    <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
                      <Images className="size-6" />
                    </div>
                    <div>
                      <h4 className="font-heading text-lg font-bold text-foreground">No memories yet</h4>
                      <p className="mt-1 text-sm text-muted-foreground">Add photos from your past trips to see them here.</p>
                    </div>
                    <motion.button
                      type="button"
                      onClick={() => setMemoryModalOpen(true)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="mt-2 inline-flex items-center gap-2 rounded-full bg-caramel px-5 py-2.5 text-sm font-bold text-caramel-foreground shadow-sm transition-all hover:bg-caramel/90"
                    >
                      <Plus className="size-4" strokeWidth={2.6} />
                      Add memories
                    </motion.button>
                  </div>
                )}
              </motion.section>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <CreateTripModal
        open={modalOpen}
        initialDestination={seedDestination}
        onClose={() => setModalOpen(false)}
        onCreate={createTrip}
      />

      <AddMemoryModal
        open={memoryModalOpen}
        onClose={() => setMemoryModalOpen(false)}
        onCreate={handleCreateMemory}
      />

      <TripDetailsModal
        trip={selectedTrip}
        onClose={() => setSelectedTrip(null)}
      />
    </div>
  )
}

import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

function TripDetailsModal({
  trip,
  onClose,
}: {
  trip: PlannedTrip | null
  onClose: () => void
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!trip) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [trip, onClose])

  if (!mounted) return null

  // Generate placeholder itinerary stops for any trip that doesn't match UPCOMING_TRIP
  const stops = trip?.destination === UPCOMING_TRIP.destination 
    ? UPCOMING_TRIP.itinerary 
    : [
        { title: 'Arrive & settle in', time: 'Day 1', detail: 'Check into the cozy stay and grab a coffee to start the trip.', done: trip?.status === 'completed' },
        { title: 'Explore the local sights', time: 'Day 2', detail: 'Wander around and find some hidden gems.', done: trip?.status === 'completed' },
        { title: 'Rest & depart', time: 'Day 3', detail: 'One last walk before heading back home.', done: trip?.status === 'completed' }
      ]

  return createPortal(
    <AnimatePresence>
      {trip && (
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
            aria-label={`${trip.destination} details`}
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="relative z-10 m-0 w-full max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-t-[2.5rem] border border-border bg-card p-6 shadow-[0_-10px_50px_-12px_rgba(120,80,40,0.4)] sm:m-4 sm:rounded-[2.5rem] sm:p-8"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-caramel">
                  <Plane className="size-5" />
                  <span className="font-heading text-sm font-semibold uppercase tracking-wide">
                    {trip.status === 'completed' ? 'Past Trip' : 'Upcoming Trip'}
                  </span>
                </div>
                <h3 className="mt-1 flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
                  <span aria-hidden>{trip.emoji}</span>
                  {trip.destination}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                  <MapPin className="size-4" /> {trip.country}
                  <span className="mx-1">·</span>
                  <CalendarDays className="size-4" /> {trip.dateRange}
                </p>
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

            <div className="mt-6 rounded-2xl bg-secondary/50 p-4">
              <p className="text-sm leading-relaxed text-muted-foreground italic">
                &quot;{trip.note}&quot;
              </p>
            </div>

            <div className="mt-6">
              <h4 className="mb-4 font-heading text-lg font-bold text-foreground">
                Itinerary preview
              </h4>
              <div className="pointer-events-none">
                <Itinerary stops={stops} />
              </div>
            </div>

            <motion.button
              type="button"
              onClick={onClose}
              whileTap={{ scale: 0.97 }}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-secondary/80 py-3.5 font-heading text-base font-bold text-foreground shadow-sm transition-all hover:bg-secondary"
            >
              Close
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
