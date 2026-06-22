'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { MapPin, Check, Plane, Images, CalendarDays } from 'lucide-react'
import { UPCOMING_TRIP, MEMORIES } from '@/lib/capy-data'
import { cn } from '@/lib/utils'

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 240, damping: 24 } },
}

function Itinerary() {
  return (
    <ol className="relative ml-2 space-y-6 border-l-2 border-dashed border-caramel/40 pl-7">
      {UPCOMING_TRIP.itinerary.map((stop, i) => (
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

function PolaroidGallery() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-8 sm:gap-x-6">
      {MEMORIES.map((m, i) => (
        <motion.figure
          key={m.id}
          initial={{ opacity: 0, y: 24, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: m.rotate }}
          transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 200, damping: 18 }}
          whileHover={{
            rotate: 0,
            scale: 1.06,
            y: -10,
            zIndex: 20,
            filter: 'blur(0px)',
            transition: { type: 'spring', stiffness: 300, damping: 18 },
          }}
          className="group relative w-40 cursor-pointer rounded-md bg-card p-2.5 pb-10 shadow-[0_14px_30px_-12px_rgba(120,80,40,0.5)] sm:w-44"
          style={{ rotate: `${m.rotate}deg` }}
        >
          <div className="relative aspect-square overflow-hidden rounded-sm bg-muted">
            <Image
              src={m.src || '/placeholder.svg'}
              alt={`${m.caption} in ${m.location}`}
              fill
              sizes="180px"
              className="object-cover transition-[filter] duration-300 [filter:saturate(1.05)] group-hover:blur-[1px]"
            />
          </div>
          <figcaption className="absolute inset-x-0 bottom-2 px-2 text-center">
            <p className="font-heading text-sm font-bold leading-tight text-foreground">
              {m.caption}
            </p>
            <p className="text-[0.65rem] font-semibold text-muted-foreground">{m.location}</p>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  )
}

export function Travel() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-6"
    >
      {/* Trip hero */}
      <motion.section
        variants={fade}
        className="relative overflow-hidden rounded-[2.5rem] border border-border bg-gradient-to-br from-matcha/40 via-card to-honey/40 p-6 sm:p-9"
      >
        <div className="flex items-center gap-2 text-caramel">
          <Plane className="size-5" />
          <span className="font-heading text-sm font-semibold uppercase tracking-wide">
            Travel buddy
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
          <div className="rounded-3xl bg-card/80 px-5 py-3 text-center">
            <p className="font-heading text-3xl font-bold text-caramel">
              {UPCOMING_TRIP.daysAway}
            </p>
            <p className="text-xs font-semibold text-muted-foreground">days to go</p>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Itinerary */}
        <motion.section
          variants={fade}
          className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)] sm:p-8 lg:col-span-2"
        >
          <div className="mb-5 flex items-center gap-2 text-caramel">
            <CalendarDays className="size-5" />
            <span className="font-heading text-sm font-semibold uppercase tracking-wide">
              Cozy itinerary
            </span>
          </div>
          <Itinerary />
        </motion.section>

        {/* Memories */}
        <motion.section
          variants={fade}
          className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)] sm:p-8 lg:col-span-3"
        >
          <div className="mb-2 flex items-center gap-2 text-caramel">
            <Images className="size-5" />
            <span className="font-heading text-sm font-semibold uppercase tracking-wide">
              Memories
            </span>
          </div>
          <p className="mb-8 text-sm text-muted-foreground">
            Scattered little Polaroids from past wanders. Hover to peek closer.
          </p>
          <PolaroidGallery />
        </motion.section>
      </div>
    </motion.div>
  )
}
