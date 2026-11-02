import { CapyAuth } from '@/components/auth/capy-auth'
import { CapyMobileAuth } from '@/components/auth/capy-mobile-auth'
import { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Login - Capy',
}

const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE

export default async function LoginPage() {
  const session = await auth()
  
  if (session) {
    redirect('/')
  }

  // Force the correct UI per deployment, with responsive fallback for local dev.
  if (APP_MODE === 'mobile') {
    return <CapyMobileAuth />
  }

  if (APP_MODE === 'web') {
    return <CapyAuth />
  }

  return (
    <>
      <div className="hidden sm:block">
        <CapyAuth />
      </div>
      <div className="block sm:hidden">
        <CapyMobileAuth />
      </div>
    </>
  )
}
