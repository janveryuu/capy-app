import { CapyAuth } from '@/components/auth/capy-auth'
import { CapyMobileAuth } from '@/components/auth/capy-mobile-auth'
import { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Login - Capy',
}

export default async function LoginPage() {
  const session = await auth()
  
  if (session) {
    redirect('/')
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
