"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"
import { ForgotPasswordForm } from "./forgot-password-form"
import { CapyStoryModal } from "./capy-story-modal"

type View = "login" | "signup" | "forgot"

export function CapyMobileAuth() {
  const [view, setView] = useState<View>("login")
  const [showStory, setShowStory] = useState(false)

  return (
    <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[400px] flex-col bg-background sm:hidden">
      {/* ── SPLASH AREA (Top half) ── */}
      <div className="relative flex h-[45dvh] shrink-0 flex-col items-center justify-center overflow-hidden bg-primary text-primary-foreground">
        {/* Soft decorative blobs */}
        <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-primary-foreground/10" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 size-48 rounded-full bg-primary-foreground/10" />
        <div className="absolute inset-0 -z-0 m-auto size-48 rounded-full bg-primary-foreground/10 blur-2xl" />

        {/* Header Logo */}
        <div className="absolute top-6 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-xl bg-primary-foreground/15">
              <Sparkles className="size-4" />
            </div>
            <div className="flex flex-col leading-none text-left">
              <span className="font-heading text-lg font-bold">Capy</span>
              <span className="text-[10px] text-primary-foreground/80">mood &amp; travel buddy</span>
            </div>
          </div>
        </div>

        {/* Mascot */}
        <div className="relative z-10 mt-6 flex flex-col items-center">
          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute -right-12 top-0 z-20 rounded-2xl bg-white px-3 py-1.5 text-xs font-bold text-caramel shadow-xl rotate-12"
          >
            Click me! ✨
            <div className="absolute -bottom-1 left-4 size-3 rotate-45 bg-white" />
          </motion.div>

          <div
            className="relative cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
            onClick={() => setShowStory(true)}
          >
            <div className="absolute inset-0 m-auto size-[180px] rounded-full border-4 border-white/20 animate-ping opacity-50" />
            <Image
              src="/capymascot-login.png"
              alt="Capy mascot"
              width={180}
              height={180}
              priority
              className="relative size-44 animate-capy-bob drop-shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* ── FORM AREA (Bottom half overlapping) ── */}
      <div className="relative z-20 -mt-8 flex flex-1 flex-col rounded-t-[2rem] bg-card px-6 pb-12 pt-8 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex w-full flex-col"
          >
            {view === "login" && (
              <LoginForm onForgot={() => setView("forgot")} onSignup={() => setView("signup")} />
            )}
            {view === "signup" && (
              <SignupForm onLogin={() => setView("login")} />
            )}
            {view === "forgot" && (
              <ForgotPasswordForm onLogin={() => setView("login")} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showStory && <CapyStoryModal onClose={() => setShowStory(false)} />}
      </AnimatePresence>
    </div>
  )
}
