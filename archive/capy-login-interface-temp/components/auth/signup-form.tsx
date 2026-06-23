"use client"

import { useState } from "react"
import { Mail, Lock, User } from "lucide-react"
import { CozyField } from "./cozy-field"
import { CozyButton } from "./cozy-button"
import { GoogleButton } from "./google-button"
import { AuthDivider } from "./auth-divider"

interface SignupFormProps {
  onLogin: () => void
}

export function SignupForm({ onLogin }: SignupFormProps) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = String(form.get("name") ?? "")
    const email = String(form.get("email") ?? "")
    const password = String(form.get("password") ?? "")

    setLoading(true)
    try {
      // TODO: wire this to your backend, e.g.
      // await signUp({ name, email, password })
      console.log("[v0] signup submit", { name, email, password })
      await new Promise((r) => setTimeout(r, 900))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    // TODO: wire this to your backend's Google OAuth flow
    console.log("[v0] google sign-up")
    await new Promise((r) => setTimeout(r, 900))
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5 text-center sm:text-left">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground text-balance">
          Join the cozy burrow
        </h1>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          Make a little home for your moods and travels. Capy will be right here with you.
        </p>
      </header>

      <GoogleButton label="Sign up with Google" onClick={handleGoogle} />
      <AuthDivider />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <CozyField
          name="name"
          type="text"
          label="What should Capy call you?"
          placeholder="Your name"
          autoComplete="name"
          required
          icon={<User className="size-4" />}
        />
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
          placeholder="Pick a comfy secret"
          autoComplete="new-password"
          required
          minLength={8}
          hint="At least 8 characters, friend."
          icon={<Lock className="size-4" />}
        />

        <CozyButton type="submit" loading={loading} loadingText="Building your burrow…" className="mt-1">
          Create account
        </CozyButton>

        <p className="px-1 text-center text-xs leading-relaxed text-muted-foreground">
          By joining, you agree to be kind to yourself and to Capy&apos;s{" "}
          <a href="#" className="font-semibold text-primary underline-offset-4 hover:underline">
            Terms
          </a>{" "}
          &{" "}
          <a href="#" className="font-semibold text-primary underline-offset-4 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have a burrow?{" "}
        <button
          type="button"
          onClick={onLogin}
          className="rounded-md font-bold text-primary underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          Sign in
        </button>
      </p>
    </div>
  )
}
