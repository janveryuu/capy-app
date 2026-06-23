'use client'

import { useMemo } from 'react'
import { motion } from 'motion/react'
import { CalendarHeart, TrendingUp, Activity } from 'lucide-react'
import {
  buildHeatmap,
  scoreColor,
  WEEK_TREND,
  WEEKDAYS,
  MOODS,
} from '@/lib/capy-data'
import { cn } from '@/lib/utils'

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 240, damping: 24 } },
}

/** Build a smooth SVG path (Catmull-Rom -> bezier) from points. */
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

        {/* gridlines */}
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
            <circle cx={p.x} cy={p.y} r="6" fill="oklch(0.985 0.014 84)" />
            <circle cx={p.x} cy={p.y} r="4" fill="oklch(0.6 0.1 120)" />
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

export function MoodAnalytics() {
  const heatmap = useMemo(() => buildHeatmap(12), [])

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

      {/* Heatmap */}
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
          {/* weekday labels */}
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
                      'size-[1.05rem] rounded-[0.4rem] ring-1 ring-inset ring-black/5',
                      scoreColor(score),
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* legend */}
        <div className="mt-5 flex items-center justify-end gap-2 text-xs text-muted-foreground">
          <span>Tough</span>
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className={cn('size-3.5 rounded-[0.3rem]', scoreColor(s))} />
          ))}
          <span>Lovely</span>
        </div>
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Area chart */}
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

        {/* Mood breakdown */}
        <motion.section
          variants={fade}
          className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)] sm:p-8 lg:col-span-2"
        >
          <div className="flex items-center gap-2 text-caramel">
            <Activity className="size-5" />
            <span className="font-heading text-sm font-semibold uppercase tracking-wide">
              Feeling mix
            </span>
          </div>
          <ul className="mt-5 space-y-3">
            {MOODS.map((mood, i) => {
              const pct = [10, 20, 28, 30, 12][i]
              const Icon = mood.icon
              return (
                <li key={mood.id} className="flex items-center gap-3">
                  <Icon className={cn('size-5 shrink-0', mood.iconColor)} strokeWidth={2.2} />
                  <span className="w-16 shrink-0 text-xs font-bold text-foreground">
                    {mood.label}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      className={cn('h-full rounded-full', mood.bg)}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.9, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="w-9 shrink-0 text-right text-xs font-semibold text-muted-foreground">
                    {pct}%
                  </span>
                </li>
              )
            })}
          </ul>
        </motion.section>
      </div>
    </motion.div>
  )
}
