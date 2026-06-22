import { CapyAuth } from '@/components/auth/capy-auth'
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

  return <CapyAuth />
}
