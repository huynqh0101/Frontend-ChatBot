'use client'
import React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { login } from '@/services/authService'
import { useRouter } from 'next/navigation'

// Component nút social login có thể tái sử dụng
const SocialButton = ({
  icon,
  text,
}: {
  icon: React.ReactNode
  text: string
}) => (
  <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 py-3 transition-colors hover:bg-gray-50">
    {icon}
    <span className="text-sm font-medium text-gray-700">{text}</span>
  </button>
)

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const res = await login({ email, password })
      if (res.token) {
        localStorage.setItem('token', res.token)
      }
      router.push('/')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center bg-white p-8 lg:w-1/2 lg:rounded-r-2xl">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Login to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back! Please enter your details.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address*
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="ex: email@domain.com"
              className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password*
              </label>
              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              placeholder="Enter password"
              className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-9 right-3 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign up
          </Link>
        </div>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 flex-shrink text-xs text-gray-400">
            Or better yet...
          </span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <div className="space-y-4">
          <SocialButton
            icon={
              <Image
                src="/asset/icon/google.svg"
                alt="Google"
                width={20}
                height={20}
              />
            }
            text="Continue with Google"
          />
          <SocialButton
            icon={
              <Image
                src="/asset/icon/apple.svg"
                alt="Apple"
                width={20}
                height={20}
              />
            }
            text="Continue with Apple"
          />
        </div>
      </div>
    </div>
  )
}
