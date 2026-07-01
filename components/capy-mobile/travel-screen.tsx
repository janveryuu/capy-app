'use client'

import { useState, useEffect, useMemo } from 'react'
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
  Search,
  Bookmark,
  Thermometer,
  RefreshCw,
} from 'lucide-react'
import { getPlannedTrips, getMemories, createPlannedTrip } from '@/app/actions'
import { CreateTripModal, type NewTripInput } from '../capy/create-trip-modal'
import {
  UPCOMING_TRIP,
  DESTINATION_POOL,
  getDailyDestinations,
  tagColor,
  type PlannedTrip,
  type Destination,
} from '@/lib/capy-data'
import { cn } from '@/lib/utils'
import { CapyMobileMascot } from './capy-mobile-mascot'

type SubView = 'explore' | 'trips'

export function TravelScreen() {
  const [view, setView] = useState<SubView>('explore')
  const [trips, setTrips] = useState<PlannedTrip[]>([])
  const [memories, setMemories] = useState<any[]>([])
  const [planOpen, setPlanOpen] = useState(false)
  const [seedDestination, setSeedDestination] = useState<string | undefined>()

  useEffect(() => {
    getPlannedTrips().then(setTrips).catch(console.error)
    getMemories().then(setMemories).catch(console.error)
  }, [])

  const handlePlan = async (trip: NewTripInput) => {
    try {
      await createPlannedTrip(trip)
      const updated = await getPlannedTrips()
      setTrips(updated)
    } catch (e) {
      console.error(e)
    }
  }

  const openPlan = (dest?: string) => {
    setSeedDestination(dest)
    setPlanOpen(true)
  }

  return (
    <div className="flex flex-col gap-5 pb-10">
      {/* ── Top Bar: Toggle & Plan Button ── */}
      <header className="sticky top-0 z-20 -mx-4 flex items-center justify-between gap-3 bg-background/80 px-4 py-2 backdrop-blur-md">
        <div className="flex h-11 items-center rounded-full bg-secondary p-1 shadow-inner">
          <button
            type="button"
            onClick={() => setView('explore')}
            className={cn(
              'relative flex h-full items-center gap-2 rounded-full px-4 text-xs font-bold transition-colors',
              view === 'explore' ? 'text-caramel-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {view === 'explore' && (
              <motion.div
                layoutId="travel-mobile-tab"
                className="absolute inset-0 rounded-full bg-caramel shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              />
            )}
            <Compass className="relative z-10 size-3.5" strokeWidth={2.4} />
            <span className="relative z-10">Explore</span>
          </button>
          <button
            type="button"
            onClick={() => setView('trips')}
            className={cn(
              'relative flex h-full items-center gap-2 rounded-full px-4 text-xs font-bold transition-colors',
              view === 'trips' ? 'text-caramel-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {view === 'trips' && (
              <motion.div
                layoutId="travel-mobile-tab"
                className="absolute inset-0 rounded-full bg-caramel shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              />
            )}
            <Luggage className="relative z-10 size-3.5" strokeWidth={2.4} />
            <span className="relative z-10">My Trips</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => openPlan()}
          className="flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-bold text-primary-foreground shadow-sm transition-transform active:scale-95"
        >
          <Plus className="size-4" strokeWidth={3} />
          Plan
        </button>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {view === 'explore' ? <ExploreTab onPlan={openPlan} /> : <TripsTab trips={trips} memories={memories} onPlan={() => openPlan()} />}
        </motion.div>
      </AnimatePresence>

      <CreateTripModal
        open={planOpen}
        initialDestination={seedDestination}
        onClose={() => setPlanOpen(false)}
        onCreate={handlePlan}
      />
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════
//  EXPLORE TAB
// ═════════════════════════════════════════════════════════════════

function ExploreTab({ onPlan }: { onPlan: (dest?: string) => void }) {
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [refreshCount, setRefreshCount] = useState(0)

  const toggle = (id: string) => setSaved((s) => ({ ...s, [id]: !s[id] }))

  const { grid, spotlight } = useMemo(
    () => getDailyDestinations(undefined, refreshCount),
    [refreshCount]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return DESTINATION_POOL.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.tag.toLowerCase().includes(q),
    )
  }, [query])

  const isSearching = filtered !== null
  const scrollItems = isSearching ? filtered : grid
  const highlightItem = isSearching ? null : spotlight

  return (
    <div className="flex flex-col gap-6">
      {/* ── Hero Card ── */}
      <section className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-matcha/40 via-card to-honey/40 p-5 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)]">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-caramel">
              <Compass className="size-4" />
              <span className="text-[0.65rem] font-semibold uppercase tracking-wide">
                Explore
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-extrabold leading-tight text-foreground">
              Find your next cozy escape
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Trip ideas picked for what you&apos;re craving right now.
            </p>
          </div>
          <CapyMobileMascot size={60} float={false} />
        </div>

        <div className="mt-4 flex items-center gap-1.5 rounded-full bg-card/60 px-2.5 py-1 text-[0.65rem] font-bold text-muted-foreground w-fit">
          <CalendarDays className="size-3" />
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} · refreshes daily
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-full border border-border bg-background px-4 py-3 shadow-inner">
          <Search className="size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search all ${DESTINATION_POOL.length} destinations...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground/70"
          />
        </div>
      </section>

      {/* ── Perfect Right Now ── */}
      <section>
        <div className="mb-3 flex items-center justify-between px-1">
          <div>
            <h3 className="text-lg font-extrabold text-foreground">Perfect right now</h3>
            <p className="text-[0.65rem] text-muted-foreground">Places especially worth considering.</p>
          </div>
          {!isSearching && (
            <button
              type="button"
              onClick={() => setRefreshCount(r => r + 1)}
              className="flex items-center gap-1.5 rounded-full bg-secondary/80 px-2.5 py-1.5 text-[0.65rem] font-bold text-muted-foreground active:scale-95"
            >
              <RefreshCw className="size-3" />
              Refresh
            </button>
          )}
        </div>

        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-4 pt-1 no-scrollbar">
          {scrollItems.map((dest, i) => (
            <MobileDestinationCard
              key={dest.id + i}
              dest={dest}
              saved={!!saved[dest.id]}
              onToggle={() => toggle(dest.id)}
              onPlan={() => onPlan(dest.name)}
            />
          ))}
          {scrollItems.length === 0 && (
            <p className="text-sm text-muted-foreground py-10 w-full text-center">No destinations found matching "{query}".</p>
          )}
        </div>
      </section>

      {/* ── Spotlight ── */}
      {!isSearching && highlightItem && (
        <section>
          <div className="mb-3 px-1">
            <h3 className="text-lg font-extrabold text-foreground">Spotlight</h3>
            <p className="text-[0.65rem] text-muted-foreground">A gentle favorite.</p>
          </div>
          <MobileDestinationCard
            dest={highlightItem}
            saved={!!saved[highlightItem.id]}
            onToggle={() => toggle(highlightItem.id)}
            onPlan={() => onPlan(highlightItem.name)}
            wide
          />
        </section>
      )}
    </div>
  )
}

function MobileDestinationCard({ dest, saved, onToggle, onPlan, wide = false }: { dest: Destination, saved: boolean, onToggle: () => void, onPlan: () => void, wide?: boolean }) {
  const [imgError, setImgError] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'group relative shrink-0 overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-cozy',
        wide ? 'w-full' : 'w-56',
      )}
    >
      <div className={cn('relative w-full overflow-hidden', wide ? 'aspect-[4/3]' : 'aspect-[4/5]')}>
        <Image
          src={imgError ? '/placeholder.svg' : dest.src}
          alt={dest.name}
          fill
          sizes={wide ? '400px' : '250px'}
          className="object-cover transition-transform duration-700"
          onError={() => setImgError(true)}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <span className={cn('rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wide', tagColor(dest.tag))}>
            {dest.tag}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-[0.65rem] font-bold text-white backdrop-blur-sm">
              <Thermometer className="size-3 text-orange-300" />
              {dest.temp}
            </span>
            <button
              type="button"
              onClick={onToggle}
              className="grid size-7 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm active:scale-90"
            >
              <Bookmark className={cn('size-3.5', saved && 'fill-caramel text-caramel')} />
            </button>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="text-xl font-extrabold leading-tight">{dest.name}</h3>
          <p className="text-[0.7rem] font-semibold text-white/75">{dest.country}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/85">{dest.note}</p>
          <button
            type="button"
            onClick={onPlan}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm transition-all active:bg-white/35"
          >
            Plan a trip <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}

// ═════════════════════════════════════════════════════════════════
//  TRIPS TAB
// ═════════════════════════════════════════════════════════════════

function TripsTab({ trips, memories, onPlan }: { trips: PlannedTrip[], memories: any[], onPlan: () => void }) {
  // Desktop logic treats UPCOMING_TRIP as the hero if there are no 'planned' trips,
  // but let's just use UPCOMING_TRIP for the demo if there's no actual planned trip.
  const activeTrip = trips.find(t => t.status === 'planned') || UPCOMING_TRIP
  const hasTrip = activeTrip.id !== 'empty-trip'

  return (
    <div className="flex flex-col gap-6">
      {/* ── Next Adventure Hero ── */}
      <section className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-honey/20 via-card to-matcha/20 p-5 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-caramel">
            <Plane className="size-4" />
            <span className="text-[0.65rem] font-semibold uppercase tracking-wide">
              Next Adventure
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-extrabold text-foreground">{activeTrip.daysAway}</span>
            <span className="text-[0.65rem] font-bold text-muted-foreground">days to go</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-card text-2xl shadow-sm">
            {activeTrip.emoji}
          </span>
          <div>
            <h2 className="text-xl font-extrabold leading-tight text-foreground">
              {activeTrip.destination}
            </h2>
            <p className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <MapPin className="size-3" /> {activeTrip.country}
            </p>
          </div>
        </div>
        
        {hasTrip && (
          <div className="mt-4 flex items-center gap-2 text-muted-foreground">
            <span className="text-[0.65rem] font-bold">Home</span>
            <span className="relative h-px flex-1 bg-border">
              <Plane className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 text-caramel" />
            </span>
            <span className="text-[0.65rem] font-bold text-foreground">{activeTrip.destination}</span>
          </div>
        )}
      </section>

      {/* ── Upcoming Trips List ── */}
      <section>
        <div className="mb-3 px-1">
          <h3 className="text-lg font-extrabold text-foreground">Upcoming trips</h3>
          <p className="text-[0.65rem] text-muted-foreground">Everything you&apos;re looking forward to.</p>
        </div>
        
        <div className="flex flex-col gap-3">
          <button 
            type="button"
            onClick={onPlan}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-caramel/30 bg-caramel/5 py-6 text-caramel transition-colors active:bg-caramel/10"
          >
            <Plus className="size-5" strokeWidth={2.4} />
            <span className="text-xs font-bold uppercase tracking-wide">Plan a new trip</span>
          </button>
          
          {trips.filter(t => t.id !== activeTrip.id).map((trip, i) => (
            <div key={trip.id} className="flex items-center justify-between rounded-3xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{trip.emoji}</span>
                <div>
                  <h4 className="font-extrabold text-foreground">{trip.destination}</h4>
                  <p className="text-xs text-muted-foreground">{trip.dateRange}</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Itinerary ── */}
      <section className="rounded-[2rem] border border-border bg-card p-5 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)]">
        <div className="flex items-center gap-2 text-caramel mb-4">
          <CalendarDays className="size-4" />
          <span className="text-[0.65rem] font-semibold uppercase tracking-wide">
            {activeTrip.destination} Itinerary
          </span>
        </div>
        
        {activeTrip.itinerary?.length > 0 ? (
          <ol className="relative ml-2 space-y-5 border-l-2 border-dashed border-caramel/40 pl-6">
            {activeTrip.itinerary.map((stop, i) => (
              <li key={i} className="relative">
                <span className={cn(
                  'absolute -left-[1.95rem] grid size-5 place-items-center rounded-full ring-4 ring-card',
                  stop.done ? 'bg-matcha text-matcha-foreground' : 'bg-honey text-honey-foreground'
                )}>
                  {stop.done ? <Check className="size-3" strokeWidth={3} /> : <span className="size-1.5 rounded-full bg-current" />}
                </span>
                <div className="rounded-2xl bg-secondary/50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-foreground">{stop.title}</p>
                    <span className="shrink-0 rounded-full bg-card px-2 py-0.5 text-[0.6rem] font-bold text-muted-foreground">
                      {stop.time}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{stop.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">No stops planned yet.</p>
        )}
      </section>

      {/* ── Memories ── */}
      <section className="rounded-[2rem] border border-border bg-card p-5 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-caramel">
            <Images className="size-4" />
            <span className="text-[0.65rem] font-semibold uppercase tracking-wide">
              Memories
            </span>
          </div>
          <button className="text-xs font-bold text-caramel underline-offset-2 active:underline">
            Add
          </button>
        </div>

        {memories.length > 0 ? (
          <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-4 pt-1 no-scrollbar">
            {memories.map((m, i) => (
              <div
                key={m.id}
                className="group relative w-32 shrink-0 rounded-md bg-white p-2 pb-8 shadow-sm border border-border"
                style={{ rotate: `${m.rotate}deg` }}
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 h-4 w-8 rounded-sm bg-honey/40 backdrop-blur-sm rotate-[-2deg] shadow-sm" />
                <div className="relative aspect-square overflow-hidden rounded-sm bg-muted">
                  <Image
                    src={m.src || '/placeholder.svg'}
                    alt={m.caption}
                    fill
                    sizes="150px"
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-1.5 px-2 text-center">
                  <p className="text-[0.65rem] font-bold text-foreground truncate">{m.caption}</p>
                  <p className="text-[0.55rem] text-muted-foreground truncate">{m.location}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No cozy memories saved yet.</p>
        )}
      </section>
    </div>
  )
}
