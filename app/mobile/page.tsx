import { CapyMobileApp } from '@/components/capy-mobile/capy-mobile-app'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function MobilePage() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  return <CapyMobileApp />
}
