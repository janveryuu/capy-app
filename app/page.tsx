import { CapyApp } from '@/components/capy/capy-app'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  return <CapyApp />
}
