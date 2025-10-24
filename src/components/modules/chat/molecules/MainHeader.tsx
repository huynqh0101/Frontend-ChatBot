import { LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/custom/button'

export function MainHeader() {
  return (
    <header className="bg-gray-100 px-6 py-4 dark:bg-gray-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-x-3 gap-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
            <span className="text-base font-bold text-white">AI</span>
          </div>
          <div>
            <span className="block text-xl leading-tight font-bold tracking-tight text-gray-900 dark:text-white">
              CHAT A.I+
            </span>
            <span className="-mt-7 text-xs leading-tight text-gray-500 dark:text-gray-400">
              Powered by AI
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="outline"
              size="default"
              className="group gap-2 border-2 border-gray-300 bg-white font-medium text-gray-700 transition-all hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-400"
            >
              <LogIn className="h-4 w-4 transition-transform group-hover:scale-110" />
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              size="default"
              className="group gap-2 bg-gradient-to-r from-blue-600 to-purple-600 font-medium text-white shadow-md transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600"
            >
              <UserPlus className="h-4 w-4 transition-transform group-hover:scale-110" />
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
