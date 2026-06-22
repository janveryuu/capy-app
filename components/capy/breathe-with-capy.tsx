'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Wind, Play, Pause, RotateCcw } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const PHASES = [
  { label: 'Breathe in…', duration: 4 },
  { label: 'Hold…', duration: 4 },
  { label: 'Breathe out…', duration: 4 },
  { label: 'Hold…', duration: 4 },
] as const

const TOTAL_CYCLE = PHASES.reduce((s, p) => s + p.duration, 0) // 16s

export function BreatheWithCapy() {
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0) // seconds within cycle
  const [cycles, setCycles] = useState(0)

  // Determine the current phase from elapsed time
  const getPhase = useCallback((t: number) => {
    let acc = 0
    for (let i = 0; i < PHASES.length; i++) {
      acc += PHASES[i].duration
      if (t < acc) {
        const phaseElapsed = t - (acc - PHASES[i].duration)
        return { index: i, ...PHASES[i], phaseElapsed }
      }
    }
    return { index: 0, ...PHASES[0], phaseElapsed: 0 }
  }, [])

  // Tick every 100ms for smoothness
  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 0.1
        if (next >= TOTAL_CYCLE) {
          setCycles((c) => c + 1)
          return 0
        }
        return next
      })
    }, 100)
    return () => clearInterval(interval)
  }, [running])

  const phase = getPhase(elapsed)

  // inhale = phase 0 (breathe in) or phase 1 (hold full)
  // exhale = phase 2 (breathe out) or phase 3 (hold empty)
  const isInhale = !running || phase.index === 0 || phase.index === 1
  const mascotKey = running ? (isInhale ? 'in' : 'out') : 'idle'

  // Orb scale for breathing effect
  const orbScale =
    phase.index === 0
      ? 1 + (phase.phaseElapsed / phase.duration) * 0.3 // expand
      : phase.index === 1
        ? 1.3 // hold expanded
        : phase.index === 2
          ? 1.3 - (phase.phaseElapsed / phase.duration) * 0.3 // contract
          : 1 // hold contracted

  // Progress ring
  const totalProgress = elapsed / TOTAL_CYCLE
  const ringRadius = 78
  const circumference = 2 * Math.PI * ringRadius
  const strokeOffset = circumference * (1 - totalProgress)

  const reset = () => {
    setRunning(false)
    setElapsed(0)
    setCycles(0)
  }

  return (
    <section className="rounded-[2rem] border border-border bg-gradient-to-br from-matcha/20 via-card to-honey/20 p-6 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)] sm:p-8">
      <div className="flex items-center gap-2 text-caramel">
        <Wind className="size-5" />
        <span className="font-heading text-sm font-semibold uppercase tracking-wide">
          Breathe with Capy
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        A gentle box-breathing exercise. Four breaths. Sixteen seconds of calm.
      </p>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
        {/* Breathing orb + progress ring */}
        <div className="relative flex items-center justify-center">
          {/* SVG progress ring */}
          <svg
            width="180"
            height="180"
            viewBox="0 0 180 180"
            className="absolute"
            style={{ transform: 'rotate(-90deg)' }}
          >
            {/* track */}
            <circle
              cx="90"
              cy="90"
              r={ringRadius}
              fill="none"
              stroke="oklch(0.89 0.03 75)"
              strokeWidth="4"
            />
            {/* progress */}
            <circle
              cx="90"
              cy="90"
              r={ringRadius}
              fill="none"
              stroke={running && !isInhale ? 'oklch(0.68 0.12 55)' : 'oklch(0.65 0.13 145)'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              style={{ transition: 'stroke-dashoffset 0.1s linear, stroke 0.8s ease' }}
            />
          </svg>

          {/* Breathing orb with capybara mascot */}
          <motion.div
            className="relative flex size-36 items-center justify-center overflow-hidden rounded-full"
            style={{
              background: running && !isInhale
                ? 'radial-gradient(circle, oklch(0.94 0.06 55 / 0.75), oklch(0.90 0.05 75 / 0.45))'
                : 'radial-gradient(circle, oklch(0.93 0.07 145 / 0.75), oklch(0.87 0.06 135 / 0.45))',
              boxShadow: running && !isInhale
                ? '0 0 60px -10px oklch(0.78 0.10 55 / 0.55), 0 0 30px 4px oklch(0.78 0.10 55 / 0.25) inset'
                : '0 0 60px -10px oklch(0.75 0.12 145 / 0.55), 0 0 30px 4px oklch(0.75 0.12 145 / 0.25) inset',
            }}
            animate={{ scale: orbScale }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Capybara mascot with cross-fade between breathe-in and breathe-out */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mascotKey}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.55, ease: 'easeInOut' }}
                className="relative size-28"
              >
                <Image
                  src={isInhale ? '/capy-breathe-in.png' : '/capy-breathe-out.png'}
                  alt={isInhale ? 'Capy breathing in' : 'Capy breathing out'}
                  fill
                  className="object-contain drop-shadow-md"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Info panel */}
        <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
          {/* Phase label */}
          <div className="min-h-[3rem]">
            <AnimatePresence mode="wait">
              <motion.p
                key={running ? phase.label + phase.index : 'idle'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="font-heading text-2xl font-bold text-foreground"
              >
                {running ? phase.label : 'Ready when you are'}
              </motion.p>
            </AnimatePresence>
            {running && (
              <p className="mt-1 text-sm text-muted-foreground">
                Phase {phase.index + 1} of 4
              </p>
            )}
          </div>

          {/* Cycle counter */}
          {cycles > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-full bg-matcha/30 px-4 py-1.5 text-xs font-bold text-matcha-foreground"
            >
              {cycles} cycle{cycles > 1 ? 's' : ''} completed 🌿
            </motion.p>
          )}

          {/* Controls */}
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={() => setRunning(!running)}
              whileTap={{ scale: 0.92 }}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold shadow-md transition-all',
                running
                  ? 'bg-secondary text-foreground'
                  : 'bg-caramel text-caramel-foreground',
              )}
            >
              {running ? (
                <>
                  <Pause className="size-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="size-4" /> Start
                </>
              )}
            </motion.button>

            {(running || cycles > 0) && (
              <motion.button
                type="button"
                onClick={reset}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.92 }}
                className="grid size-10 place-items-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
              >
                <RotateCcw className="size-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
