import { CapyApp } from '@/components/capy/capy-app'
import { CapyMobileApp } from '@/components/capy-mobile/capy-mobile-app'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE

function WelcomeHeader({ name }: { name?: string | null }) {
  const firstName = name?.trim().split(/\s+/)[0]
  return (
    <header className="capy-paper">
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Welcome{firstName ? `, ${firstName}` : ''} to CAPY
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your cozy corner for moods &amp; travels.
        </p>
      </div>
    </header>
  )
}

export default async function Page() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const name = session.user?.name

  // If the deployment is forced to a specific mode via env var, render that directly.
  // Otherwise fall back to responsive CSS breakpoint behavior (for local dev).
  if (APP_MODE === 'mobile') {
    return (
      <>
        <WelcomeHeader name={name} />
        <CapyMobileApp />
      </>
    )
  }

  if (APP_MODE === 'web') {
    return (
      <>
        <WelcomeHeader name={name} />
        <CapyApp />
      </>
    )
  }

  return (
    <>
      <WelcomeHeader name={name} />
      <div className="hidden md:block">
        <CapyApp />
      </div>
      <div className="block md:hidden">
        <CapyMobileApp />
      </div>
    </>
  )
}
