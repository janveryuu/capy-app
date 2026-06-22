'use client'

import { motion } from 'motion/react'
import { MapPin, Plane, Flame, Heart } from 'lucide-react'
import { CapyMascot } from './capy-mascot'
import { MoodCheckin } from './mood-checkin'
import { UPCOMING_TRIP, type Mood } from '@/lib/capy-data'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 22 } },
}

function StatPill({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Flame
  label: string
  value: string
  tone: string
}) {
  return (
    <motion.div
      className="flex items-center gap-3 rounded-3xl border border-border bg-card/70 p-4"
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className={`grid size-11 place-items-center rounded-2xl ${tone}`}>
        <Icon className="size-5" strokeWidth={2.2} />
      </div>
      <div className="leading-tight">
        <p className="font-heading text-xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  )
}

export function Dashboard({
  onGoTravel,
  onLogMood,
}: {
  onGoTravel: () => void
  onLogMood: (mood: Mood, tags: string[], note: string) => void
}) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Greeting hero */}
      <motion.section
        variants={item}
        className="relative overflow-hidden rounded-[2.5rem] border border-border bg-gradient-to-br from-honey/50 via-card to-matcha/30 p-6 sm:p-10"
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
          <CapyMascot size={256} className="shrink-0" />
          <div className="text-center sm:text-left">
            <p className="font-heading text-sm font-semibold uppercase tracking-wide text-caramel">
              Good afternoon, friend
            </p>
            <h1 className="mt-1 text-balance font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              Let&apos;s take a slow, cozy breath together.
            </h1>
            <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
              Capy has been waiting all morning to hear how you&apos;re doing. Your calm is
              growing — one gentle check-in at a time.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:max-w-sm">
              <StatPill
                icon={Flame}
                label="Day check-in streak"
                value="7 days"
                tone="bg-honey text-honey-foreground"
              />
              <StatPill
                icon={Heart}
                label="Avg mood this week"
                value="Good"
                tone="bg-matcha text-matcha-foreground"
              />
            </div>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Mood check-in */}
        <motion.div variants={item} className="lg:col-span-3">
          <MoodCheckin onLogMood={onLogMood} />
        </motion.div>

        {/* Upcoming trip glance */}
        <motion.button
          variants={item}
          onClick={onGoTravel}
          whileHover={{ y: -6 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-border bg-card p-6 text-left shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)] lg:col-span-2"
        >
          <div className="flex items-center gap-2 text-caramel">
            <Plane className="size-5" />
            <span className="font-heading text-sm font-semibold uppercase tracking-wide">
              Next adventure
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl" aria-hidden>
              {UPCOMING_TRIP.emoji}
            </span>
            <h3 className="font-heading text-2xl font-bold text-foreground">
              {UPCOMING_TRIP.destination}
            </h3>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4" /> {UPCOMING_TRIP.country} · {UPCOMING_TRIP.dateRange}
          </p>

          <div className="mt-auto pt-6">
            <div className="rounded-3xl bg-matcha/40 p-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-heading text-3xl font-bold text-matcha-foreground">
                    {UPCOMING_TRIP.daysAway}
                  </p>
                  <p className="text-xs font-semibold text-matcha-foreground/80">
                    days until take-off
                  </p>
                </div>
                <span className="rounded-full bg-card/70 px-3 py-1 text-xs font-bold text-foreground transition-all group-hover:bg-caramel group-hover:text-caramel-foreground group-hover:shadow-sm">
                  Open trip →
                </span>
              </div>
            </div>
          </div>
        </motion.button>
      </div>
    </motion.div>
  )
}
