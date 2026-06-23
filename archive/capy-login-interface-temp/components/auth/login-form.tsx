"use client"

import { useState } from "react"
import { Mail, Lock } from "lucide-react"
import { CozyField } from "./cozy-field"
import { CozyButton } from "./cozy-button"
import { GoogleButton } from "./google-button"
import { AuthDivider } from "./auth-divider"

interface LoginFormProps {
  onForgot: () => void
  onSignup: () => void
}

export function LoginForm({ onForgot, onSignup }: LoginFormProps) {
  const [loading, setLoading] = useState(false)
  const [remember, setRemember] = useState(true)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = String(form.get("email") ?? "")
    const password = String(form.get("password") ?? "")

    setLoading(true)
    try {
      // TODO: wire this to your backend, e.g.
      // await signIn({ email, password, remember })
      console.log("[v0] login submit", { email, password, remember })
      await new Promise((r) => setTimeout(r, 900))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    // TODO: wire this to your backend's Google OAuth flow
    console.log("[v0] google sign-in")
    await new Promise((r) => setTimeout(r, 900))
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5 text-center sm:text-left">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground text-balance">
          Welcome back, friend
        </h1>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          Capy missed you. Sign in to check in on your moods and your next little adventure.
        </p>
      </header>

      <GoogleButton label="Continue with Google" onClick={handleGoogle} />
      <AuthDivider />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <CozyField
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          icon={<Mail className="size-4" />}
        />
        <CozyField
          name="password"
          type="password"
          label="Password"
          placeholder="Your secret cozy phrase"
          autoComplete="current-password"
          required
          icon={<Lock className="size-4" />}
        />

        <div className="flex items-center justify-between gap-2 px-1">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 cursor-pointer rounded-md border-input accent-primary"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={onForgot}
            className="rounded-md text-sm font-bold text-primary underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            Forgot password?
          </button>
        </div>

        <CozyButton type="submit" loading={loading} loadingText="Snuggling in…">
          Sign in
        </CozyButton>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        New around here?{" "}
        <button
          type="button"
          onClick={onSignup}
          className="rounded-md font-bold text-primary underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          Make a cozy account
        </button>
      </p>
    </div>
  )
}
