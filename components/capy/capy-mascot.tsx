'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export function CapyMascot({
  size = 168,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      {/* soft glow halo */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full bg-honey/40 blur-2xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* breathing mascot */}
      <motion.div
        className="relative h-full w-full"
        animate={{ scale: [1, 1.045, 1], y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image
          src="/new-welcomelogo.png"
          alt="Capy, a friendly cartoon capybara mascot with a gentle smile"
          fill
          sizes="200px"
          className="object-contain drop-shadow-[0_18px_24px_rgba(120,80,40,0.22)]"
          priority
        />
      </motion.div>
    </div>
  )
}
