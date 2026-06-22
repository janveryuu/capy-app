import { LoginForm } from '@/components/auth/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - Capy',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col justify-center bg-background p-4 sm:p-8">
      <LoginForm />
    </div>
  )
}
