'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { Search, Bookmark, ArrowRight, Thermometer, Compass } from 'lucide-react'
import { DESTINATIONS, tagColor, type Destination } from '@/lib/capy-data'
import { cn } from '@/lib/utils'

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 240, damping: 24 } },
}

function DestinationCard({
  dest,
  saved,
  onToggle,
  onPlan,
  wide = false,
}: {
  dest: Destination
  saved: boolean
  onToggle: () => void
  onPlan: () => void
  wide?: boolean
}) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={cn(
        'group relative shrink-0 overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[0_12px_34px_-16px_rgba(120,80,40,0.45)]',
        wide ? 'w-full' : 'w-60 sm:w-64',
      )}
    >
      <div className={cn('relative w-full overflow-hidden', wide ? 'aspect-[16/9]' : 'aspect-[4/5]')}>
        <Image
          src={dest.src || '/placeholder.svg'}
          alt={`${dest.name}, ${dest.country}`}
          fill
          sizes="(max-width: 640px) 70vw, 320px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/15 to-transparent" />

        {/* top row */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wide',
              tagColor(dest.tag),
            )}
          >
            {dest.tag}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 rounded-full bg-card/85 px-2 py-1 text-[0.65rem] font-bold text-foreground backdrop-blur-sm">
              <Thermometer className="size-3 text-caramel" />
              {dest.temp}
            </span>
            <button
              type="button"
              onClick={onToggle}
              aria-pressed={saved}
              aria-label={saved ? `Remove ${dest.name} from saved` : `Save ${dest.name}`}
              className="grid size-8 place-items-center rounded-full bg-card/85 text-foreground backdrop-blur-sm transition-colors hover:bg-card"
            >
              <Bookmark className={cn('size-4', saved && 'fill-caramel text-caramel')} />
            </button>
          </div>
        </div>

        {/* bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-4 text-card">
          <h3 className="font-heading text-xl font-bold leading-tight text-card">{dest.name}</h3>
          <p className="text-[0.7rem] font-semibold text-card/80">{dest.country}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-card/90">{dest.note}</p>
          <button
            type="button"
            onClick={onPlan}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-bold text-foreground transition-transform active:scale-95"
          >
            Plan a trip
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export function Explore({ onPlan }: { onPlan: (name?: string) => void }) {
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState<Record<string, boolean>>({ alps: true })

  const toggle = (id: string) => setSaved((s) => ({ ...s, [id]: !s[id] }))

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return DESTINATIONS
    return DESTINATIONS.filter(
      (d) => d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q),
    )
  }, [query])

  const seasonal = filtered.slice(0, 4)
  const spotlight = filtered[0]

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="space-y-6"
    >
      {/* Hero */}
      <motion.section
        variants={fade}
        className="relative overflow-hidden rounded-[2.5rem] border border-border bg-gradient-to-br from-matcha/40 via-card to-honey/40 p-6 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 text-caramel">
              <Compass className="size-5" />
              <span className="font-heading text-sm font-semibold uppercase tracking-wide">
                Explore
              </span>
            </div>
            <h2 className="mt-2 font-heading text-3xl font-bold leading-tight text-foreground text-balance">
              Find your next cozy escape
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Trip ideas picked for the kind of getaway you&apos;re craving right now.
            </p>
          </div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative size-24 shrink-0 sm:size-28"
          >
            <Image
              src="/capy-explorer.png"
              alt="Capy the capybara with a backpack ready to explore"
              fill
              sizes="120px"
              className="object-contain drop-shadow-[0_10px_18px_rgba(120,80,40,0.35)]"
            />
          </motion.div>
        </div>

        {/* Search */}
        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search places like Kyoto or Bali"
            aria-label="Search destinations"
            className="w-full rounded-full border border-border bg-card py-3.5 pl-12 pr-4 text-sm font-semibold text-foreground shadow-sm outline-none transition-shadow placeholder:font-medium placeholder:text-muted-foreground focus:ring-2 focus:ring-caramel/50"
          />
        </div>
      </motion.section>

      {filtered.length === 0 ? (
        <motion.div
          variants={fade}
          className="rounded-[2rem] border border-dashed border-border bg-card p-10 text-center"
        >
          <p className="font-heading text-lg font-bold text-foreground">
            No cozy spots match &ldquo;{query}&rdquo;
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different place — Capy knows a few more.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Seasonal picks */}
          <motion.section variants={fade}>
            <div className="mb-1 flex items-end justify-between gap-3">
              <h3 className="font-heading text-2xl font-bold text-foreground">Perfect right now</h3>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              A few places especially worth considering this season.
            </p>
            <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:-mx-6 sm:px-6">
              {seasonal.map((d) => (
                <div key={d.id} className="snap-start">
                  <DestinationCard
                    dest={d}
                    saved={!!saved[d.id]}
                    onToggle={() => toggle(d.id)}
                    onPlan={() => onPlan(d.name)}
                  />
                </div>
              ))}
            </div>
          </motion.section>

          {/* Spotlight */}
          {spotlight && (
            <motion.section variants={fade}>
              <h3 className="font-heading text-2xl font-bold text-foreground">Capy&apos;s spotlight</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Capy&apos;s favorite pick this week, enriched with the latest vibe.
              </p>
              <DestinationCard
                dest={spotlight}
                saved={!!saved[spotlight.id]}
                onToggle={() => toggle(spotlight.id)}
                onPlan={() => onPlan(spotlight.name)}
                wide
              />
            </motion.section>
          )}
        </>
      )}
    </motion.div>
  )
}
