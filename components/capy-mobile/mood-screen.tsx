'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowLeft,
  BookOpen,
  CalendarHeart,
  Check,
  Flame,
  Hash,
  Heart,
  Lightbulb,
  PartyPopper,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'
import {
  MOODS,
  MOOD_HISTORY,
  MOOD_TAGS,
  WEEK_TREND,
  moodById,
  type Mood,
  type MoodId,
  type MoodJournalEntry,
} from '@/lib/capy-mobile-data'
import { BreatheWithCapy } from './breathe-with-capy'
import { cn } from '@/lib/utils'

// ─── Smooth SVG path helper ──────────────────────────────────────

function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1]
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }
  return d
}

// ─── Heatmap helpers ─────────────────────────────────────────────

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function buildHeatmap(weeks = 12): (number | null)[][] {
  const rng = seededRandom(42)
  const grid: (number | null)[][] = []
  let prev = 4
  for (let w = 0; w < weeks; w++) {
    const week: (number | null)[] = []
    for (let d = 0; d < 7; d++) {
      const drift = Math.round((Math.sin(w * 1.3 + d * 0.9) + rng() - 0.5) * 1.2)
      let v = Math.max(1, Math.min(5, prev + drift))
      if (w === weeks - 1 && d > 4) v = NaN
      week.push(Number.isNaN(v) ? null : v)
      if (!Number.isNaN(v)) prev = v
    }
    grid.push(week)
  }
  return grid
}

function scoreColor(score: number | null): string {
  switch (score) {
    case 5: return 'bg-matcha'
    case 4: return 'bg-honey'
    case 3: return 'bg-secondary'
    case 2: return 'bg-caramel/40'
    case 1: return 'bg-destructive/30'
    default: return 'bg-muted/60'
  }
}

// ═════════════════════════════════════════════════════════════════
//  MOOD SCREEN COMPONENT
// ═════════════════════════════════════════════════════════════════

export function MoodScreen({
  todayMood,
  journal = [],
}: {
  todayMood: MoodId | null
  onSelectMood: (mood: MoodId) => void
  journal?: MoodJournalEntry[]
  onLogMood?: (entry: MoodJournalEntry) => void
}) {
  const heatmap = useMemo(() => buildHeatmap(12), [])

  // Replace "Today" with the freshly logged mood so the timeline feels live.
  const timeline = MOOD_HISTORY.map((entry) =>
    entry.day === 'Today' && todayMood ? { ...entry, mood: todayMood } : entry,
  )

  return (
    <div className="flex flex-col gap-5">
      <header className="pt-1">
        <h1 className="text-2xl font-extrabold text-foreground">
          Your calm, over time
        </h1>
        <p className="text-sm text-muted-foreground">
          No harsh charts here — just soft colors showing how your days have felt.
        </p>
      </header>

      {/* ═══ 1. Breathe With Capy ═══ */}
      <BreatheWithCapy />

      {/* ═══ 2. Gentle Stats Strip ═══ */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Day streak', value: '12', icon: Flame, tone: 'bg-honey text-honey-foreground' },
          { label: 'Check-ins', value: '63', icon: Hash, tone: 'bg-caramel text-caramel-foreground' },
          { label: 'Longest streak', value: '21', icon: Target, tone: 'bg-matcha text-matcha-foreground' },
          { label: 'Avg mood', value: 'Good', icon: Heart, tone: 'bg-secondary text-secondary-foreground' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-3xl border border-border bg-card/70 p-3.5"
            >
              <div className={cn('grid size-10 shrink-0 place-items-center rounded-2xl', stat.tone)}>
                <Icon className="size-5" strokeWidth={2.2} />
              </div>
              <div className="leading-tight">
                <p className="text-lg font-extrabold text-foreground">{stat.value}</p>
                <p className="text-[0.65rem] text-muted-foreground">{stat.label}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ═══ Capy's Gentle Insights ═══ */}
      <section className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-honey/30 via-card to-matcha/20 p-5 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)]">
        <div className="flex items-center gap-2 text-caramel">
          <Lightbulb className="size-5" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Capy&apos;s gentle insights
          </span>
        </div>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          Little patterns Capy noticed in your moods.
        </p>
        <div className="space-y-2.5">
          {[
            'You feel your best on weekends — rest really suits you. 🌿',
            'Friends are your biggest mood lifter this week. 💛',
            'Your calm is growing steadily. Keep going, friend. 🧋',
          ].map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.12, type: 'spring', stiffness: 240, damping: 22 }}
              className="flex items-start gap-3 rounded-2xl bg-card/70 p-3.5"
            >
              <Sparkles className="mt-0.5 size-4 shrink-0 text-honey-foreground" />
              <p className="text-sm font-semibold leading-relaxed text-foreground">{insight}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ 3. Mood Garden Heatmap ═══ */}
      <section className="rounded-[2rem] border border-border bg-card p-5 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)]">
        <div className="flex items-center gap-2 text-caramel">
          <CalendarHeart className="size-5" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Mood garden · last 12 weeks
          </span>
        </div>

        <div className="no-scrollbar mt-4 flex gap-1.5 overflow-x-auto pb-2">
          <div className="flex flex-col justify-between pr-1 pt-[1.1rem] text-[0.55rem] font-bold text-muted-foreground">
            {WEEKDAYS.map((d, i) => (
              <span key={i} className="leading-[0.85rem]">{d}</span>
            ))}
          </div>
          <div className="flex gap-1">
            {heatmap.map((week, w) => (
              <div key={w} className="flex flex-col gap-1">
                <span className="h-3 text-center text-[0.5rem] font-bold text-muted-foreground/70">
                  {w % 4 === 0 ? `W${w + 1}` : ''}
                </span>
                {week.map((score, d) => (
                  <motion.div
                    key={d}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (w * 7 + d) * 0.003, type: 'spring', stiffness: 300 }}
                    className={cn(
                      'size-[0.85rem] rounded-[0.3rem] ring-1 ring-inset ring-black/5',
                      scoreColor(score),
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-end gap-2 text-[0.6rem] text-muted-foreground">
          <span>Tough</span>
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className={cn('size-3 rounded-[0.25rem]', scoreColor(s))} />
          ))}
          <span>Lovely</span>
        </div>
      </section>

      {/* ═══ 4. This Week's Gentle Wave (Area Chart) ═══ */}
      <section className="rounded-[2rem] border border-border bg-card p-5 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)]">
        <div className="flex items-center gap-2 text-caramel">
          <TrendingUp className="size-5" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            This week&apos;s gentle wave
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Your mood lifted into the weekend — that&apos;s worth a happy little squeak.
        </p>
        <div className="mt-3">
          <AreaChart />
        </div>
      </section>

      {/* ═══ 6. Recent Reflections Journal ═══ */}
      <section className="rounded-[2rem] border border-border bg-card p-5 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)]">
        <div className="flex items-center gap-2 text-caramel">
          <BookOpen className="size-5" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Recent reflections
          </span>
        </div>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          A gentle look back at your recent check-ins.
        </p>

        <ol className="relative ml-2 space-y-4 border-l-2 border-dashed border-caramel/40 pl-6">
          {timeline.map((entry, i) => {
            const mood = moodById(entry.mood)
            const Icon = mood.icon
            return (
              <motion.li
                key={entry.date}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 240, damping: 22 }}
                className="relative"
              >
                {/* Timeline dot */}
                <span
                  className={cn(
                    'absolute -left-[2.15rem] grid size-7 place-items-center rounded-full ring-4 ring-card',
                    mood.bg,
                  )}
                >
                  <Icon className={cn('size-4', mood.iconColor)} strokeWidth={2.6} />
                </span>

                <div className="rounded-2xl bg-secondary/50 p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-foreground">
                      {mood.label}
                    </p>
                    <span className="shrink-0 text-[0.65rem] font-semibold text-muted-foreground">
                      {entry.day} · {entry.date}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {mood.caption}
                  </p>
                </div>
              </motion.li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}

// ─── Gentle Wave Area Chart ──────────────────────────────────────

function AreaChart() {
  const W = 360
  const H = 160
  const pad = { top: 16, bottom: 28, left: 4, right: 4 }
  const pts = useMemo(() => {
    const innerW = W - pad.left - pad.right
    const innerH = H - pad.top - pad.bottom
    return WEEK_TREND.map((d, i) => ({
      x: pad.left + (innerW * i) / (WEEK_TREND.length - 1),
      y: pad.top + innerH * (1 - (d.score - 1) / 4),
      day: d.day,
      score: d.score,
    }))
  }, [])

  const line = smoothPath(pts)
  const area = `${line} L ${pts[pts.length - 1].x} ${H - pad.bottom} L ${pts[0].x} ${H - pad.bottom} Z`

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Smooth area chart of average mood across the last seven days"
    >
      <defs>
        <linearGradient id="moodAreaMobile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.09 135)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="oklch(0.88 0.11 92)" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map((i) => {
        const y = pad.top + ((H - pad.top - pad.bottom) * i) / 4
        return (
          <line
            key={i}
            x1={pad.left}
            x2={W - pad.right}
            y1={y}
            y2={y}
            stroke="oklch(0.89 0.03 75)"
            strokeWidth="1"
            strokeDasharray="2 6"
          />
        )
      })}

      <motion.path
        d={area}
        fill="url(#moodAreaMobile)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke="oklch(0.6 0.1 120)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
      />

      {pts.map((p, i) => (
        <g key={i}>
          <motion.circle
            cx={p.x} cy={p.y} r="5" fill="oklch(0.985 0.014 84)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.08, type: 'spring', stiffness: 300 }}
          />
          <motion.circle
            cx={p.x} cy={p.y} r="3.5" fill="oklch(0.6 0.1 120)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.55 + i * 0.08, type: 'spring', stiffness: 300 }}
          />
          <text
            x={p.x}
            y={H - 8}
            textAnchor="middle"
            className="fill-muted-foreground"
            style={{ fontSize: 10, fontWeight: 700 }}
          >
            {p.day}
          </text>
        </g>
      ))}
    </svg>
  )
}
