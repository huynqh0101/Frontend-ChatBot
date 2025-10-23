import { LoginForm } from '@/components/modules/auth/login/LoginForm'
import { Toaster } from 'sonner'
export default function LoginPage() {
  return (
    <div className="-m-4 flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <LoginForm />
      <Toaster position="bottom-right" richColors />
    </div>
  )
}
//update
