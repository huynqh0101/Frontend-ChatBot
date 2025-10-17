import { SignupForm } from '@/components/modules/auth/signup/SignupForm'
import { Toaster } from 'sonner'
export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <SignupForm />
      <Toaster position="bottom-right" richColors />
    </div>
  )
}
