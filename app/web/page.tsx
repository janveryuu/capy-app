import { CapyApp } from '@/components/capy/capy-app'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

/**
 * /web route — renders the full desktop website version.
 */
export default async function WebPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  return <CapyApp />
}
