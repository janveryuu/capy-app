'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { MoodId, MoodJournalEntry } from '@/lib/capy-mobile-data'
import { BottomNav } from './bottom-nav'
import { HomeScreen } from './home-screen'
import { MoodScreen } from './mood-screen'
import { TravelScreen } from './travel-screen'
import { ProfileScreen } from './profile-screen'
import { CapyChat } from '../capy/capy-chat'

export type TabId = 'home' | 'mood' | 'travel' | 'chat' | 'profile'

/**
 * Root mobile shell for Capy.
 * ─────────────────────────────────────────────────────────────────
 * Architecture notes:
 * - Centered 400px "phone" column on desktop, full-width on mobile.
 * - Holds the shared mood + journal state so all tabs stay in sync.
 * - Cross-fades + slides between tabs for a soft, smooth feel.
 * - State is lifted here so a future backend swap only touches this
 *   component — individual screens remain pure presentational.
 */
export function CapyMobileApp() {
  // ── Shared state ──────────────────────────────────────────────
  const [tab, setTab] = useState<TabId>('home')
  const [todayMood, setTodayMood] = useState<MoodId | null>(null)
  const [journal, setJournal] = useState<MoodJournalEntry[]>([])

  /** Called when a mood is fully logged (after tags + note). */
  const handleLogMood = (entry: MoodJournalEntry) => {
    setJournal((prev) => [entry, ...prev])
  }

  // ── Screen registry ───────────────────────────────────────────
  const screens: Record<TabId, React.ReactNode> = {
    home: (
      <HomeScreen
        todayMood={todayMood}
        onSelectMood={setTodayMood}
        onNavigate={setTab}
        onLogMood={handleLogMood}
      />
    ),
    mood: (
      <MoodScreen
        todayMood={todayMood}
        onSelectMood={setTodayMood}
        journal={journal}
        onLogMood={handleLogMood}
      />
    ),
    travel: <TravelScreen />,
    chat: (
      <div className="relative -mt-2 flex w-full flex-col overflow-hidden rounded-[2rem] border border-border bg-card shadow-cozy" style={{ height: 'calc(100dvh - 120px)' }}>
        <div className="absolute inset-0 [&>div]:!h-full [&>div]:!border-0 [&>div]:!shadow-none [&>div]:!rounded-none">
          <CapyChat />
        </div>
      </div>
    ),
    profile: <ProfileScreen />,
  }

  return (
    <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[400px] flex-col bg-background">
      {/* Scrollable content region — hides scrollbar for app-like feel */}
      <main className="no-scrollbar flex-1 overflow-y-auto px-4 pb-32 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {screens[tab]}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Sticky bottom nav — fixed to bottom of the mobile container */}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
