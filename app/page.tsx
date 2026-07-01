import { CapyApp } from '@/components/capy/capy-app'
import { CapyMobileApp } from '@/components/capy-mobile/capy-mobile-app'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <>
      <div className="hidden md:block">
        <CapyApp />
      </div>
      <div className="block md:hidden">
        <CapyMobileApp />
      </div>
    </>
  )
}
