'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Home, LineChart, Plane, MessageCircle, Leaf } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Dashboard } from './dashboard'
import { MoodAnalytics } from './mood-analytics'
import { Travel } from './travel'
import { CapyChat } from './capy-chat'
import { cn } from '@/lib/utils'
import { MOOD_JOURNAL, buildHeatmap, type MoodEntry, type Mood } from '@/lib/capy-data'

type View = 'home' | 'mood' | 'travel' | 'chat'

const TABS: { id: View; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'mood', label: 'Mood', icon: LineChart },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'chat', label: 'Ask Capy', icon: MessageCircle },
]

export function CapyApp() {
  const router = useRouter()
  const { data: session } = useSession()
  const [view, setView] = useState<View>('home')
  const [journal, setJournal] = useState<MoodEntry[]>(MOOD_JOURNAL)
  const [heatmap, setHeatmap] = useState<(number | null)[][]>(() => buildHeatmap(12))
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogMood = (mood: Mood, tags: string[], note: string) => {
    // 1. Add to journal
    const newEntry: MoodEntry = {
      id: `j-new-${Date.now()}`,
      mood,
      tags,
      note,
      timestamp: 'Just now',
    }
    setJournal((prev) => [newEntry, ...prev])

    // 2. Update heatmap (find the first null in the last week, or just overwrite the last day if full)
    setHeatmap((prev) => {
      const next = [...prev.map(week => [...week])]
      const lastWeek = next[next.length - 1]
      const nullIdx = lastWeek.findIndex(d => d === null)
      if (nullIdx !== -1) {
        lastWeek[nullIdx] = mood.score
      } else {
        lastWeek[lastWeek.length - 1] = mood.score
      }
      return next
    })
  }

  return (
    <div className="capy-paper min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 pb-32 pt-6 sm:px-6 sm:pt-8">
        {/* Top bar */}
        <header className="mb-6 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView('home')}
          >
            <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-border/50 bg-card shadow-sm">
              <Image src="/capy-newicon.png" alt="Capy Logo" fill className="object-cover" />
            </div>
            <div className="leading-none">
              <p className="font-heading text-xl font-bold text-foreground">Capy</p>
              <p className="text-[0.7rem] font-semibold text-muted-foreground">
                mood &amp; travel buddy
              </p>
            </div>
          </motion.div>
          <div className="flex items-center gap-3">
            <motion.div 
              className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-bold text-muted-foreground shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <motion.span 
                className="size-2 rounded-full bg-matcha-foreground/70"
                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
              Calm mode on
            </motion.div>
            
            {session ? (
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="rounded-full bg-secondary px-4 py-1.5 text-xs font-bold text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80"
              >
                Log out
              </button>
            ) : (
              <button 
                onClick={() => router.push('/login')}
                className="rounded-full bg-caramel px-4 py-1.5 text-xs font-bold text-caramel-foreground shadow-sm transition-colors hover:bg-caramel/90"
              >
                Log in
              </button>
            )}
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
              {view === 'home' && <Dashboard onGoTravel={() => setView('travel')} onLogMood={handleLogMood} />}
              {view === 'mood' && <MoodAnalytics onGoTravel={() => setView('travel')} journal={journal} heatmap={heatmap} />}
              {view === 'travel' && <Travel />}
              {view === 'chat' && <CapyChat />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 px-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm rounded-[2rem] border border-border/50 bg-card p-6 shadow-xl"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative size-20 overflow-hidden rounded-full border-4 border-card shadow-sm">
                  <Image src="/capymascot-login.png" alt="Capy" fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                    Leaving so soon?
                  </h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                    Capy will be right here waiting to hear about your next little adventure. Are you sure you want to log out?
                  </p>
                </div>
                <div className="mt-2 flex w-full gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 rounded-full bg-secondary py-2.5 text-sm font-bold text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Stay
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="flex-1 rounded-full bg-destructive/10 py-2.5 text-sm font-bold text-destructive shadow-sm transition-colors hover:bg-destructive/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/60"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating bottom nav */}
      <nav className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
        <motion.div 
          className="capy-glass flex items-center gap-1 rounded-full border border-border p-1.5 shadow-[0_14px_40px_-12px_rgba(120,80,40,0.45)]"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
        >
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
        </motion.div>
      </nav>
    </div>
  )
}
