"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { X } from "lucide-react"

interface CapyStoryModalProps {
  onClose: () => void
}

export function CapyStoryModal({ onClose }: CapyStoryModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 px-4 backdrop-blur-sm sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative flex w-full max-w-2xl max-h-[85vh] flex-col overflow-hidden rounded-[2rem] border border-border/50 bg-card shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-black/10 text-foreground/70 backdrop-blur-md transition-colors hover:bg-black/20 hover:text-foreground"
        >
          <X className="size-5" />
          <span className="sr-only">Close</span>
        </button>

        {/* Modal Header & Hero */}
        <div className="relative h-32 w-full shrink-0 bg-primary overflow-hidden sm:h-36">
          <div className="pointer-events-none absolute -bottom-10 -left-10 size-32 rounded-full bg-primary-foreground/10" />
          <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-primary-foreground/10" />
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
            <div className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28">
              <Image
                src="/capymascot-login.png"
                alt="Capy relaxing"
                fill
                className="object-contain drop-shadow-xl animate-capy-bob"
              />
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="mx-auto max-w-lg space-y-6">
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Meet Capy: The World's Most Chilled-Out Travel Buddy
              </h2>
            </div>

            <div className="space-y-4 text-pretty text-[15px] leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground font-semibold">
                  Most people think capybaras are naturally born with zero stress. But not Capy.
                </strong>
              </p>
              <p>
                A few years ago, Capy was a highly strung, over-caffeinated corporate rodent. He lived his life in the fast lane—rushing from one stressful meeting to the next, doomscrolling on his tiny smartphone, and constantly forgetting to use his vacation days. His anxiety was through the roof. He was the only capybara in the world with high blood pressure.
              </p>
              
              <h3 className="font-heading text-lg font-bold text-foreground pt-2">The Turning Point</h3>
              <p>
                Everything changed during a chaotic business trip. After missing a bullet train because he was too busy answering emails, a completely exhausted Capy wandered off the path and stumbled into a quiet, misty <em>onsen</em> (hot spring) in the mountains.
              </p>
              <p>
                He slipped into the warm water, placed a single yuzu fruit on his head, and took a deep breath. For the first time in his life, his heart rate slowed down. He realized that life wasn’t a race to the finish line—it’s a slow, gentle wander.
              </p>

              <div className="my-6 border-l-4 border-caramel pl-4 font-medium text-foreground">
                Capy immediately quit his corporate job, traded his tiny suit for a backpack, and dedicated his life to slow travel and mental well-being.
              </div>

              <h3 className="font-heading text-lg font-bold text-foreground pt-2">Your Mindful Travel Buddy</h3>
              <p>
                Now, he has volunteered to be your personal mood and travel buddy.
              </p>
              <ul className="list-inside list-disc space-y-2 marker:text-caramel">
                <li><strong className="text-foreground font-semibold">Will he judge you if you’re stressed out?</strong> Never. He’s been there. He’ll just sit quietly with you until it passes.</li>
                <li><strong className="text-foreground font-semibold">Will he help you plan the perfect escape?</strong> Yes, as long as it involves taking things slow.</li>
                <li><strong className="text-foreground font-semibold">Will he remind you to take a deep breath today?</strong> Absolutely. That’s his full-time job now.</li>
              </ul>
            </div>

            <div className="mt-8 flex justify-center pb-2">
              <button
                onClick={onClose}
                className="rounded-full bg-caramel px-8 py-3 text-sm font-bold text-caramel-foreground shadow-md transition-all hover:bg-caramel/90 hover:scale-105"
              >
                Let's go, Capy!
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
