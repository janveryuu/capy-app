'use client'

import { useMemo, useRef, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import {
  CalendarHeart,
  TrendingUp,
  Sparkles,
  Lightbulb,
  BarChart3,
  BookOpen,
  Flame,
  Target,
  Hash,
  Calendar,
} from 'lucide-react'
import {
  buildHeatmap,
  scoreColor,
  WEEK_TREND,
  WEEKDAYS,
  MOODS,
  MOOD_STATS,
  MOOD_INSIGHTS,
  MOOD_FACTORS,
  MOOD_TAGS,
  type MoodEntry,
} from '@/lib/capy-data'
import { cn } from '@/lib/utils'
import { BreatheWithCapy } from './breathe-with-capy'

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 240, damping: 24 } },
}

/* ═══════════════════════════════════════
   Animated Count-Up Hook
   ═══════════════════════════════════════ */
function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0)
  const ref = useRef(false)
  useEffect(() => {
    if (ref.current) return
    ref.current = true
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setVal(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return val
}

function AnimatedStat({ stat }: { stat: typeof MOOD_STATS[0] }) {
  const count = useCountUp(stat.value)
  const isCalmestDay = stat.label === 'Calmest day'

  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex items-center gap-3 rounded-3xl border border-border bg-card/70 p-4"
    >
      <div className={cn('grid size-11 shrink-0 place-items-center rounded-2xl', stat.tone)}>
        {stat.label === 'Current streak' && <Flame className="size-5" strokeWidth={2.2} />}
        {stat.label === 'Longest streak' && <Target className="size-5" strokeWidth={2.2} />}
        {stat.label === 'Total check-ins' && <Hash className="size-5" strokeWidth={2.2} />}
        {isCalmestDay && <Calendar className="size-5" strokeWidth={2.2} />}
      </div>
      <div className="leading-tight">
        <p className="font-heading text-xl font-bold text-foreground">
          {isCalmestDay ? stat.suffix : `${count}${stat.suffix}`}
        </p>
        <p className="text-xs text-muted-foreground">{stat.label}</p>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════
   Area Chart (existing, kept as-is)
   ═══════════════════════════════════════ */
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

function AreaChart() {
  const W = 520
  const H = 200
  const pad = { top: 20, bottom: 32, left: 8, right: 8 }
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
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Smooth area chart of average mood across the last seven days"
      >
        <defs>
          <linearGradient id="moodArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.09 135)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="oklch(0.88 0.11 92)" stopOpacity="0.05" />
          </linearGradient>
        </defs>

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
          fill="url(#moodArea)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke="oklch(0.6 0.1 120)"
          strokeWidth="3.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        />

        {pts.map((p, i) => (
          <g key={i}>
            <motion.circle
              cx={p.x} cy={p.y} r="6" fill="oklch(0.985 0.014 84)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.08, type: 'spring', stiffness: 300 }}
            />
            <motion.circle
              cx={p.x} cy={p.y} r="4" fill="oklch(0.6 0.1 120)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.55 + i * 0.08, type: 'spring', stiffness: 300 }}
            />
            <text
              x={p.x}
              y={H - 10}
              textAnchor="middle"
              className="fill-muted-foreground"
              style={{ fontSize: 12, fontWeight: 700 }}
            >
              {p.day}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════
   Gentle Insight (Feature 3)
   ═══════════════════════════════════════ */
function GentleInsight() {
  return (
    <motion.section
      variants={fade}
      className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-honey/30 via-card to-matcha/20 p-6 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)] sm:p-8"
    >
      <div className="flex items-center gap-2 text-caramel">
        <Lightbulb className="size-5" />
        <span className="font-heading text-sm font-semibold uppercase tracking-wide">
          Capy&apos;s gentle insights
        </span>
      </div>
      <p className="mt-1 mb-5 text-sm text-muted-foreground">
        Little patterns Capy noticed in your moods.
      </p>
      <div className="space-y-3">
        {MOOD_INSIGHTS.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.12, type: 'spring', stiffness: 240, damping: 22 }}
            className="flex items-start gap-3 rounded-2xl bg-card/70 p-4"
          >
            <Sparkles className="mt-0.5 size-4 shrink-0 text-honey-foreground" />
            <p className="text-sm font-semibold leading-relaxed text-foreground">{insight}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

/* ═══════════════════════════════════════
   Mood Factors – Diverging Bar Chart (Feature 4)
   ═══════════════════════════════════════ */
function MoodFactors() {
  return (
    <motion.section
      variants={fade}
      className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)] sm:p-8"
    >
      <div className="flex items-center gap-2 text-caramel">
        <BarChart3 className="size-5" />
        <span className="font-heading text-sm font-semibold uppercase tracking-wide">
          What shapes your days
        </span>
      </div>
      <p className="mt-1 mb-5 text-sm text-muted-foreground">
        Which factors lift your mood and which ones weigh on you.
      </p>

      <div className="space-y-3.5">
        {MOOD_FACTORS.map((factor, i) => {
          const tag = MOOD_TAGS.find((t) => t.id === factor.tag)
          const Icon = tag?.icon
          return (
            <div key={factor.tag} className="flex items-center gap-3">
              {/* Label */}
              <div className="flex w-20 shrink-0 items-center gap-1.5">
                {Icon && <Icon className="size-4 text-muted-foreground" strokeWidth={2.2} />}
                <span className="text-xs font-bold text-foreground">{factor.label}</span>
              </div>

              {/* Diverging bar */}
              <div className="flex flex-1 items-center gap-0.5">
                {/* Negative (left) */}
                <div className="flex h-3 flex-1 justify-end overflow-hidden rounded-l-full bg-transparent">
                  <motion.div
                    className="h-full rounded-l-full bg-caramel/50"
                    initial={{ width: 0 }}
                    animate={{ width: `${factor.negative}%` }}
                    transition={{ duration: 0.8, delay: 0.15 + i * 0.08, ease: 'easeOut' }}
                  />
                </div>
                {/* Center divider */}
                <div className="h-5 w-px bg-border" />
                {/* Positive (right) */}
                <div className="flex h-3 flex-1 overflow-hidden rounded-r-full bg-transparent">
                  <motion.div
                    className="h-full rounded-r-full bg-matcha"
                    initial={{ width: 0 }}
                    animate={{ width: `${factor.positive}%` }}
                    transition={{ duration: 0.8, delay: 0.15 + i * 0.08, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-[0.65rem] font-bold text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-caramel/50" />
          Weighs on you
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-matcha" />
          Lifts your mood
        </span>
      </div>
    </motion.section>
  )
}

/* ═══════════════════════════════════════
   Recent Reflections Journal (Feature 5)
   ═══════════════════════════════════════ */
function RecentReflections({ journal }: { journal: MoodEntry[] }) {
  return (
    <motion.section
      variants={fade}
      className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)] sm:p-8"
    >
      <div className="flex items-center gap-2 text-caramel">
        <BookOpen className="size-5" />
        <span className="font-heading text-sm font-semibold uppercase tracking-wide">
          Recent reflections
        </span>
      </div>
      <p className="mt-1 mb-5 text-sm text-muted-foreground">
        A gentle look back at your recent check-ins.
      </p>

      <ol className="relative ml-2 space-y-5 border-l-2 border-dashed border-caramel/40 pl-7">
        {journal.slice(0, 7).map((entry, i) => {
          const Icon = entry.mood.icon
          return (
            <motion.li
              key={entry.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 240, damping: 22 }}
              className="relative"
            >
              {/* Timeline dot */}
              <span
                className={cn(
                  'absolute -left-[2.4rem] grid size-7 place-items-center rounded-full ring-4 ring-card',
                  entry.mood.bg,
                )}
              >
                <Icon className={cn('size-4', entry.mood.iconColor)} strokeWidth={2.6} />
              </span>

              <div className="rounded-2xl bg-secondary/50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-heading text-sm font-bold text-foreground">
                    {entry.mood.label}
                  </p>
                  <span className="shrink-0 text-[0.65rem] font-semibold text-muted-foreground">
                    {entry.timestamp}
                  </span>
                </div>
                {entry.note && (
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {entry.note}
                  </p>
                )}
                {entry.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {entry.tags.map((tagId) => {
                      const tag = MOOD_TAGS.find((t) => t.id === tagId)
                      if (!tag) return null
                      const TagIcon = tag.icon
                      return (
                        <span
                          key={tagId}
                          className="inline-flex items-center gap-1 rounded-full bg-card px-2 py-0.5 text-[0.6rem] font-bold text-muted-foreground"
                        >
                          <TagIcon className="size-2.5" strokeWidth={2.4} />
                          {tag.label}
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.li>
          )
        })}
      </ol>
    </motion.section>
  )
}

/* ═══════════════════════════════════════
   Main MoodAnalytics Page
   ═══════════════════════════════════════ */
export function MoodAnalytics({
  onGoTravel,
  journal,
  heatmap,
}: {
  onGoTravel?: () => void
  journal: MoodEntry[]
  heatmap: (number | null)[][]
}) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-6"
    >
      <motion.header variants={fade} className="px-1">
        <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Your calm, over time
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          No harsh charts here — just soft colors showing how your days have felt.
        </p>
      </motion.header>

      {/* 1. Breathe with Capy */}
      <motion.div variants={fade}>
        <BreatheWithCapy />
      </motion.div>

      {/* 2. Gentle Stats Strip */}
      <motion.div variants={fade} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {MOOD_STATS.map((stat) => (
          <AnimatedStat key={stat.label} stat={stat} />
        ))}
      </motion.div>

      {/* 3. Gentle Insight */}
      <GentleInsight />

      {/* 4. Heatmap */}
      <motion.section
        variants={fade}
        className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)] sm:p-8"
      >
        <div className="flex items-center gap-2 text-caramel">
          <CalendarHeart className="size-5" />
          <span className="font-heading text-sm font-semibold uppercase tracking-wide">
            Mood garden · last 12 weeks
          </span>
        </div>

        <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
          <div className="flex flex-col justify-between pt-[1.35rem] pr-1 text-[0.6rem] font-bold text-muted-foreground">
            {WEEKDAYS.map((d, i) => (
              <span key={i} className="leading-[1.05rem]">
                {d}
              </span>
            ))}
          </div>

          <div className="flex gap-1.5">
            {heatmap.map((week, w) => (
              <div key={w} className="flex flex-col gap-1.5">
                <span className="h-3 text-center text-[0.55rem] font-bold text-muted-foreground/70">
                  {w % 4 === 0 ? `W${w + 1}` : ''}
                </span>
                {week.map((score, d) => (
                  <motion.div
                    key={d}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (w * 7 + d) * 0.004, type: 'spring', stiffness: 300 }}
                    whileHover={{ scale: 1.35, zIndex: 10 }}
                    title={score ? `Mood: ${score}/5` : 'No check-in'}
                    className={cn(
                      'size-[1.05rem] rounded-[0.4rem] ring-1 ring-inset ring-black/5 cursor-pointer transition-shadow hover:shadow-md',
                      scoreColor(score),
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2 text-xs text-muted-foreground">
          <span>Tough</span>
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className={cn('size-3.5 rounded-[0.3rem]', scoreColor(s))} />
          ))}
          <span>Lovely</span>
        </div>
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* 5. Area chart */}
        <motion.section
          variants={fade}
          className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)] sm:p-8 lg:col-span-3"
        >
          <div className="flex items-center gap-2 text-caramel">
            <TrendingUp className="size-5" />
            <span className="font-heading text-sm font-semibold uppercase tracking-wide">
              This week&apos;s gentle wave
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Your mood lifted into the weekend — that&apos;s worth a happy little squeak.
          </p>
          <div className="mt-4">
            <AreaChart />
          </div>
        </motion.section>

        {/* 6. Mood Factors (diverging bar chart) */}
        <motion.div variants={fade} className="lg:col-span-2">
          <MoodFactors />
        </motion.div>
      </div>

      {/* 7. Recent Reflections */}
      <RecentReflections journal={journal} />
    </motion.div>
  )
}
