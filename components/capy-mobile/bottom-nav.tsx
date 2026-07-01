'use client'

import { motion } from 'motion/react'
import { Compass, HeartPulse, House, MessageCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TabId } from './capy-mobile-app'

const TABS: { id: TabId; label: string; icon: typeof House }[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'mood', label: 'Mood', icon: HeartPulse },
  { id: 'travel', label: 'Travel', icon: Compass },
  { id: 'chat', label: 'Ask Capy', icon: MessageCircle },
  { id: 'profile', label: 'Profile', icon: User },
]

/**
 * Floating, frosted-glass bottom navigation.
 * The active tab gets a soft caramel pill that slides between items
 * using Framer Motion's layoutId for a buttery spring animation.
 */
export function BottomNav({
  active,
  onChange,
}: {
  active: TabId
  onChange: (tab: TabId) => void
}) {
  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <div className="pointer-events-auto flex w-full max-w-[400px] items-center justify-around gap-1 rounded-full border border-border/60 bg-card/80 p-2 shadow-cozy-lg backdrop-blur-xl">
        {TABS.map((tab) => {
          const isActive = active === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={tab.label}
              className="relative flex min-h-[48px] flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-2 py-1.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            >
              {/* Animated pill behind the active tab */}
              {isActive && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-primary shadow-cozy"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <motion.span
                className="relative z-10 flex flex-col items-center gap-0.5"
                animate={{ scale: isActive ? 1.05 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Icon
                  className={cn(
                    'size-[22px] transition-colors',
                    isActive
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground',
                  )}
                  strokeWidth={2.4}
                />
                <span
                  className={cn(
                    'text-[11px] font-bold leading-none transition-colors',
                    isActive
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground',
                  )}
                >
                  {tab.label}
                </span>
              </motion.span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
