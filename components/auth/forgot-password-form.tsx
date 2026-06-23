"use client"

import { useState } from "react"
import { Mail, ArrowLeft, MailCheck } from "lucide-react"
import { CozyField } from "./cozy-field"
import { CozyButton } from "./cozy-button"

interface ForgotPasswordFormProps {
  onLogin: () => void
}

export function ForgotPasswordForm({ onLogin }: ForgotPasswordFormProps) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      // TODO: wire this to your backend, e.g.
      // await requestPasswordReset({ email })
      console.log("[v0] password reset request", { email })
      await new Promise((r) => setTimeout(r, 900))
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <MailCheck className="size-7" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground text-balance">
            Check your inbox
          </h1>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            If an account exists for{" "}
            <span className="font-semibold text-foreground">{email || "that email"}</span>, Capy just sent over a gentle
            link to reset your password.
          </p>
        </div>
        <button
          type="button"
          onClick={onLogin}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          <ArrowLeft className="size-4" />
          Back to sign in
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5 text-center sm:text-left">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground text-balance">
          Forgot your phrase?
        </h1>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          No worries, it happens to the coziest of us. Pop in your email and Capy will send a reset link.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <CozyField
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="size-4" />}
        />
        <CozyButton type="submit" loading={loading} loadingText="Sending some love…">
          Send reset link
        </CozyButton>
      </form>

      <button
        type="button"
        onClick={onLogin}
        className="mx-auto flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        <ArrowLeft className="size-4" />
        Back to sign in
      </button>
    </div>
  )
}
