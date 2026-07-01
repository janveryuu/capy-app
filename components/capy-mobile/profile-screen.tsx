'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import {
  Bell,
  ChevronRight,
  Flame,
  Heart,
  LogOut,
  Moon,
  Settings,
  Sparkles,
} from 'lucide-react'
import { MOOD_HISTORY, TRIPS } from '@/lib/capy-mobile-data'
import { CapyMobileMascot } from './capy-mobile-mascot'
import { cn } from '@/lib/utils'

const STATS = [
  { label: 'Day streak', value: '12', icon: Flame },
  { label: 'Check-ins', value: String(MOOD_HISTORY.length * 9), icon: Heart },
  { label: 'Adventures', value: String(TRIPS.length), icon: Sparkles },
]

function SettingItem({ icon: Icon, label, type, checked, onChange, onClick }: any) {
  return (
    <div
      onClick={type === 'link' ? onClick : onChange}
      className="flex w-full cursor-pointer items-center gap-3 px-4 py-4 text-left outline-none transition-colors hover:bg-secondary focus-visible:bg-secondary"
    >
      <span className="flex size-10 items-center justify-center rounded-2xl bg-secondary">
        <Icon className="size-5 text-primary" strokeWidth={2.4} />
      </span>
      <span className="flex-1 text-sm font-bold text-foreground">
        {label}
      </span>
      {type === 'toggle' ? (
        <div className={cn("relative flex h-6 w-11 shrink-0 items-center rounded-full transition-colors", checked ? "bg-caramel" : "bg-border")}>
          <motion.div className="size-4 rounded-full bg-white shadow-sm" animate={{ x: checked ? 24 : 4 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
        </div>
      ) : (
        <ChevronRight className="size-5 text-muted-foreground" strokeWidth={2.4} />
      )}
    </div>
  )
}

export function ProfileScreen() {
  const { data: session } = useSession()
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [remindersEnabled, setRemindersEnabled] = useState(true)
  const [showComingSoon, setShowComingSoon] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = mounted ? currentTheme === 'dark' : false

  const handleToggleNightMode = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="pt-1">
        <h1 className="text-2xl font-extrabold text-foreground">You</h1>
        <p className="text-sm text-muted-foreground">
          Your cozy corner of the world.
        </p>
      </header>

      {/* ── Profile card ── */}
      <section className="flex flex-col items-center rounded-3xl border border-border/70 bg-card p-6 text-center shadow-cozy">
        <div className="flex size-24 items-center justify-center rounded-full bg-secondary shadow-cozy">
          <CapyMobileMascot size={84} priority />
        </div>
        <h2 className="mt-3 text-xl font-extrabold text-foreground">
          {session?.user?.name || 'Friend'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {session?.user?.email || 'Welcome to Capy!'}
        </p>

        {/* Stats row */}
        <div className="mt-5 grid w-full grid-cols-3 gap-2">
          {STATS.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center gap-1 rounded-2xl bg-secondary px-2 py-3"
              >
                <Icon className="size-5 text-primary" strokeWidth={2.4} />
                <span className="text-lg font-extrabold leading-none text-foreground">
                  {stat.value}
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground">
                  {stat.label}
                </span>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ── Settings list ── */}
      <section className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-cozy flex flex-col">
        <SettingItem
          icon={Bell}
          label="Gentle reminders"
          type="toggle"
          checked={remindersEnabled}
          onChange={() => setRemindersEnabled(!remindersEnabled)}
        />
        <div className="h-px w-full bg-border/50" />
        <SettingItem
          icon={Moon}
          label="Cozy night mode"
          type="toggle"
          checked={isDark}
          onChange={handleToggleNightMode}
        />
        <div className="h-px w-full bg-border/50" />
        <SettingItem
          icon={Settings}
          label="Preferences"
          type="link"
          onClick={() => setShowComingSoon(true)}
        />
      </section>

      {/* Sign out */}
      <button
        type="button"
        onClick={() => setShowLogoutConfirm(true)}
        className="flex items-center justify-center gap-2 rounded-full border border-border/70 bg-card py-3.5 text-sm font-bold text-muted-foreground shadow-cozy outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <LogOut className="size-4" strokeWidth={2.6} />
        Sign out
      </button>

      <p className="pb-2 text-center text-xs font-semibold text-muted-foreground">
        Made with janver · Capy v1.0
      </p>

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

      {/* Coming Soon Modal */}
      <AnimatePresence>
        {showComingSoon && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 px-4 backdrop-blur-sm" onClick={() => setShowComingSoon(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-xs rounded-3xl border border-border bg-card p-5 shadow-xl text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-secondary">
                <Sparkles className="size-6 text-caramel" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">Coming Soon</h3>
              <p className="mt-1 text-sm text-muted-foreground">Capy is still building this cozy corner.</p>
              <button
                onClick={() => setShowComingSoon(false)}
                className="mt-5 w-full rounded-full bg-caramel py-2.5 text-sm font-bold text-caramel-foreground shadow-sm transition-colors hover:bg-caramel/90"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
