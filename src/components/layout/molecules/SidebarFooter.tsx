'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

function getInitials(name: string) {
  if (!name) return 'AN'
  const words = name.trim().split(' ')
  const initials = words
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return initials.slice(0, 2)
}

export default function SidebarFooter() {
  const [userName, setUserName] = useState('')
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const userData =
      localStorage.getItem('user') || sessionStorage.getItem('user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        setUserName(user.name || '')
      } catch {
        setUserName('')
      }
    }
  }, [])

  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="mt-auto border-t border-gray-200 pt-4 dark:border-gray-700">
      <button className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
        <img
          src={`https://placehold.co/32x32/3B82F6/FFFFFF?text=${getInitials(
            userName
          )}`}
          alt={userName || 'User'}
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="flex flex-1 items-center justify-between text-[15px] font-medium text-zinc-800 dark:text-zinc-100">
          <span>{userName || 'Unknown User'}</span>
          <span
            onClick={handleToggleTheme}
            className="cursor-pointer rounded-md p-1.5 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {theme === 'light' ? (
              <Sun className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
            ) : (
              <Moon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
            )}
          </span>
        </span>
      </button>
    </div>
  )
}
