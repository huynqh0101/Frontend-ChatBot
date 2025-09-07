'use client'
import React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

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

export function SignupForm() {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="flex w-full flex-col items-center justify-center bg-white p-8 lg:w-1/2 lg:rounded-r-2xl">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Sign up with free trail
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Empower your experience, sign up for a free account today.
          </p>
        </div>

        <form className="mt-8 space-y-6">
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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password*
            </label>
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

          <p className="text-xs text-gray-500">
            By registering for an account, you are consenting to our{' '}
            <a href="#" className="font-medium text-blue-600 hover:underline">
              Terms of Service
            </a>{' '}
            and confirming that you have reviewed and accepted the{' '}
            <a href="#" className="font-medium text-blue-600 hover:underline">
              Global Privacy Statement
            </a>
            .
          </p>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Get started free
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="#" className="font-medium text-blue-600 hover:underline">
            Login
          </a>
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
