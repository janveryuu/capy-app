'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Home, LineChart, Plane, Leaf } from 'lucide-react'
import { Dashboard } from './dashboard'
import { MoodAnalytics } from './mood-analytics'
import { Travel } from './travel'
import { cn } from '@/lib/utils'

type View = 'home' | 'mood' | 'travel'

const TABS: { id: View; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'mood', label: 'Mood', icon: LineChart },
  { id: 'travel', label: 'Travel', icon: Plane },
]

export function CapyApp() {
  const [view, setView] = useState<View>('home')

  return (
    <div className="capy-paper min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 pb-32 pt-6 sm:px-6 sm:pt-8">
        {/* Top bar */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-2xl bg-caramel text-caramel-foreground shadow-sm">
              <Leaf className="size-5" strokeWidth={2.4} />
            </span>
            <div className="leading-none">
              <p className="font-heading text-xl font-bold text-foreground">Capy</p>
              <p className="text-[0.7rem] font-semibold text-muted-foreground">
                mood &amp; travel buddy
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-bold text-muted-foreground">
            <span className="size-2 rounded-full bg-matcha-foreground/70" />
            Calm mode on
          </div>
        </header>

        {/* Views */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {view === 'home' && <Dashboard onGoTravel={() => setView('travel')} />}
              {view === 'mood' && <MoodAnalytics />}
              {view === 'travel' && <Travel />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating bottom nav */}
      <nav className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
        <div className="capy-glass flex items-center gap-1 rounded-full border border-border p-1.5 shadow-[0_14px_40px_-12px_rgba(120,80,40,0.45)]">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const active = view === tab.id
            return (
              <motion.button
                key={tab.id}
                type="button"
                onClick={() => setView(tab.id)}
                whileTap={{ scale: 0.9 }}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-colors',
                  active ? 'text-caramel-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="capy-nav-pill"
                    className="absolute inset-0 rounded-full bg-caramel"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon className="relative size-5" strokeWidth={2.3} />
                <span className="relative hidden sm:inline">{tab.label}</span>
              </motion.button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
