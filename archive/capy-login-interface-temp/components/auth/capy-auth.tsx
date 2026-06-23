"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Plane, Sparkles } from "lucide-react"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"
import { ForgotPasswordForm } from "./forgot-password-form"

type View = "login" | "signup" | "forgot"

const PANEL_COPY: Record<View, { title: string; subtitle: string }> = {
  login: {
    title: "A soft place to land.",
    subtitle: "Track how your heart feels and plan gentle adventures, one cozy day at a time.",
  },
  signup: {
    title: "Let's make this home.",
    subtitle: "Capy keeps your moods safe and your travels dreamy. Pull up a warm spot.",
  },
  forgot: {
    title: "We'll get you back in.",
    subtitle: "Even capybaras forget things sometimes. Let's sort it out together, no rush.",
  },
}

export function CapyAuth() {
  const [view, setView] = useState<View>("login")

  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_30px_80px_-40px_var(--primary)] lg:grid-cols-2">
        {/* Decorative cozy panel */}
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
          {/* soft blobs */}
          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary-foreground/10" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-primary-foreground/10" />
          <Image
            src="/capy-leaves.png"
            alt=""
            width={520}
            height={520}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 size-full object-cover opacity-[0.12] mix-blend-soft-light"
          />

          <div className="relative flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-2xl bg-primary-foreground/15">
              <Sparkles className="size-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading text-xl font-bold">Capy</span>
              <span className="text-xs text-primary-foreground/70">mood &amp; travel buddy</span>
            </div>
          </div>

          <div className="relative flex flex-col items-center gap-6 py-6">
            <div className="relative">
              <div className="absolute inset-0 -z-0 m-auto size-52 rounded-full bg-primary-foreground/10 blur-2xl" />
              <Image
                src="/capy-mascot.png"
                alt="Capy, a cheerful cartoon capybara mascot"
                width={260}
                height={260}
                priority
                className="relative z-10 size-56 animate-capy-bob drop-shadow-xl"
              />
            </div>
            <div className="flex flex-col gap-2 text-center">
              <h2 className="font-heading text-2xl font-bold leading-tight text-balance">{PANEL_COPY[view].title}</h2>
              <p className="text-pretty text-sm leading-relaxed text-primary-foreground/80">
                {PANEL_COPY[view].subtitle}
              </p>
            </div>
          </div>

          <div className="relative flex items-center justify-center gap-5 text-xs font-semibold text-primary-foreground/80">
            <span className="flex items-center gap-1.5">
              <Heart className="size-4" /> Track moods
            </span>
            <span className="size-1 rounded-full bg-primary-foreground/40" />
            <span className="flex items-center gap-1.5">
              <Plane className="size-4" /> Plan trips
            </span>
          </div>
        </aside>

        {/* Form side */}
        <section className="flex flex-col justify-center p-6 sm:p-10">
          {/* Mobile header with mascot */}
          <div className="mb-6 flex items-center justify-center gap-3 lg:hidden">
            <Image
              src="/capy-mascot.png"
              alt="Capy mascot"
              width={64}
              height={64}
              priority
              className="size-16 animate-capy-bob drop-shadow"
            />
            <div className="flex flex-col leading-none">
              <span className="font-heading text-2xl font-bold text-foreground">Capy</span>
              <span className="text-xs text-muted-foreground">mood &amp; travel buddy</span>
            </div>
          </div>

          <div key={view} className="animate-capy-fade-up">
            {view === "login" && <LoginForm onForgot={() => setView("forgot")} onSignup={() => setView("signup")} />}
            {view === "signup" && <SignupForm onLogin={() => setView("login")} />}
            {view === "forgot" && <ForgotPasswordForm onLogin={() => setView("login")} />}
          </div>
        </section>
      </div>
    </main>
  )
}
