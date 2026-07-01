'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * The Capy mascot with a gentle, perpetual floating idle animation.
 * Tapping triggers a soft, springy bounce — a cozy micro-interaction.
 */
export function CapyMobileMascot({
  size = 120,
  className,
  float = true,
  priority = false,
}: {
  size?: number
  className?: string
  float?: boolean
  priority?: boolean
}) {
  return (
    <motion.div
      className={cn('select-none', className)}
      style={{ width: size, height: size }}
      animate={float ? { y: [0, -8, 0] } : undefined}
      transition={
        float
          ? { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
          : undefined
      }
      whileTap={{ scale: 0.92, rotate: -3 }}
    >
      <Image
        src="/capy-mascot.png"
        alt="Capy, a cheerful cartoon capybara holding a warm drink"
        width={size}
        height={size}
        priority={priority}
        className="h-full w-full object-contain drop-shadow-[0_12px_18px_rgba(120,80,40,0.18)]"
        draggable={false}
      />
    </motion.div>
  )
}
