'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm rounded-[2rem] border border-border bg-card p-8 shadow-sm">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="relative mb-4 size-16 overflow-hidden rounded-full border border-border bg-muted shadow-sm">
          <Image src="/capy-newicon.png" alt="Capy" fill className="object-cover" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to sync your mood and trips</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-caramel/50 focus:ring-2 focus:ring-caramel/20"
            placeholder="capy@example.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-caramel/50 focus:ring-2 focus:ring-caramel/20"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full flex items-center justify-center gap-2 rounded-full bg-caramel px-4 py-3.5 text-sm font-bold text-caramel-foreground shadow-sm transition-all hover:bg-caramel/90 disabled:opacity-50"
        >
          {isLoading && <Loader2 className="size-4 animate-spin" />}
          {isLoading ? 'Signing in...' : 'Sign in (or create account)'}
        </button>
      </form>
    </div>
  )
}
