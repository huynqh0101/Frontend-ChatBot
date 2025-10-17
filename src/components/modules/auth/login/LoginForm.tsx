'use client'
import React from 'react'
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { login } from '@/services/authService'
import { useRouter } from 'next/navigation'
import { useTokenStorage } from '@/hooks/core/useTokenStorage'
import { Input } from '@/components/custom/input'
import { Button } from '@/components/custom/button'
import { Checkbox } from '@/components/custom/checkbox'
import { Separator } from '@/components/custom/separator'
import { Card } from '@/components/custom/card'

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [rememberMe, setRememberMe] = React.useState(false)
  const router = useRouter()
  const { setTokens } = useTokenStorage()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const res = await login({ email, password })
      if (res.token && res.refreshToken && res.user) {
        setTokens(
          {
            accessToken: res.token,
            refreshToken: res.refreshToken,
            user: res.user,
          },
          { rememberMe }
        )
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
    <div className="flex min-h-screen w-full flex-row justify-center bg-white dark:bg-gray-900">
      <div className="relative my-8 flex w-full max-w-[1000px] overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
        {/* Form section */}
        <div className="flex flex-1 items-center justify-center px-6 py-8">
          <Card className="w-full max-w-[350px] border-none bg-transparent shadow-none">
            <div className="p-0">
              {/* Form header */}
              <div className="mb-8">
                <h1 className="font-['Poppins'] text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  Welcome back!
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Enter your Credentials to access your account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email field */}
                <div className="space-y-1.5">
                  <label className="font-serif text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                      className="h-10 rounded-lg border-gray-200 bg-white pl-10 font-serif text-sm text-gray-900 placeholder:text-gray-500 focus:border-[#3a5b22] focus:ring-[#3a5b22] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <label className="font-serif text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      className="h-10 rounded-lg border-gray-200 bg-white pr-10 pl-10 font-serif text-sm text-gray-900 placeholder:text-gray-500 focus:border-[#3a5b22] focus:ring-[#3a5b22] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember_me"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                    className="rounded border-gray-300 text-[#3a5b22] focus:ring-[#3a5b22] data-[state=checked]:border-[#3a5b22] data-[state=checked]:bg-[#3a5b22] dark:border-gray-600"
                  />
                  <label
                    htmlFor="remember_me"
                    className="cursor-pointer text-sm text-gray-600 dark:text-gray-300"
                  >
                    Remember for 30 days
                  </label>
                </div>

                {/* Error message */}
                {error && (
                  <div className="text-sm text-red-500 dark:text-red-400">
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-lg bg-[#3a5b22] font-['Poppins'] text-sm font-semibold tracking-wide text-white hover:bg-[#2e4a1b] dark:bg-[#4a6b32] dark:hover:bg-[#3a5b22]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                {/* Separator */}
                <div className="relative flex items-center py-4">
                  <Separator className="w-full dark:bg-gray-600" />
                  <div className="absolute left-1/2 -translate-x-1/2 transform bg-white px-4 dark:bg-gray-800">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social login buttons */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="h-auto flex-1 rounded-lg border-gray-300 bg-white px-5 py-1 font-serif text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    <Image
                      className="mr-2.5 h-6 w-6"
                      alt="Google"
                      src="/google.png"
                      width={24}
                      height={24}
                    />
                    Sign in with Google
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto flex-1 rounded-lg border-gray-300 bg-white px-5 py-1 font-serif text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    <Image
                      className="mr-2.5 h-6 w-6"
                      alt="Apple"
                      src="/icons8-apple-logo-1.svg"
                      width={24}
                      height={24}
                    />
                    Sign in with Apple
                  </Button>
                </div>

                {/* Sign up link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Don&apos;t have an account?{' '}
                    <Link
                      href="/signup"
                      className="font-medium text-[#3a5b22] hover:underline dark:text-[#4a6b32]"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </Card>
        </div>

        {/* Image section */}
        <div className="hidden md:block md:w-1/2">
          <Image
            className="h-full w-full object-cover"
            alt="Login background"
            src="/chris-lee-70l1tdai6rm-unsplash-1.png"
            width={500}
            height={800}
            priority
          />
        </div>
      </div>
    </div>
  )
}
