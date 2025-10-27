'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Moon,
  Sun,
  User,
  Crown,
  Sparkles,
  Settings as SettingsIcon,
  HelpCircle,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'

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
  const [userEmail, setUserEmail] = useState('')
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const userData =
      localStorage.getItem('user') || sessionStorage.getItem('user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        setUserName(user.name || '')
        setUserEmail(user.email || '')
      } catch {
        setUserName('')
        setUserEmail('')
      }
    }
  }, [])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
    } catch {}
    router.replace('/login')
  }

  if (!mounted) return null

  return (
    <div
      ref={containerRef}
      className="relative mt-auto border-t border-gray-200 pt-4 dark:border-gray-700"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <img
          src={`https://placehold.co/32x32/3B82F6/FFFFFF?text=${getInitials(
            userName
          )}`}
          alt={userName || 'User'}
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="flex flex-1 items-center justify-between text-[15px] font-medium text-zinc-800 dark:text-zinc-100">
          <span className="truncate">{userName || 'Unknown User'}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleToggleTheme()
            }}
            className="ml-2 rounded-md p-1.5 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
            tabIndex={0}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Sun className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
            ) : (
              <Moon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
            )}
          </button>
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="fixed bottom-20 left-4 z-[1000] w-70 rounded-xl border border-gray-200 bg-white/95 p-2 shadow-2xl backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/95"
        >
          {/* Email (header) */}
          <div className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-500 dark:text-gray-400">
            <User className="h-4 w-4" />
            <span className="truncate">{userEmail || 'user@example.com'}</span>
          </div>

          <div className="my-2 h-px bg-gray-200 dark:bg-gray-700" />

          {/* Actions */}
          <button
            onClick={() => router.push('/pricing')}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-800 transition-colors hover:bg-gray-100 dark:text-zinc-100 dark:hover:bg-gray-700"
          >
            <Crown className="h-4 w-4 text-amber-500" />
            <span>Upgrade plan</span>
          </button>

          <button
            onClick={() => router.push('/settings/personalization')}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-800 transition-colors hover:bg-gray-100 dark:text-zinc-100 dark:hover:bg-gray-700"
          >
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span>Personalization</span>
          </button>

          <button
            onClick={() => router.push('/settings')}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-800 transition-colors hover:bg-gray-100 dark:text-zinc-100 dark:hover:bg-gray-700"
          >
            <SettingsIcon className="h-4 w-4" />
            <span>Settings</span>
          </button>

          {/* Help with submenu */}
          <div
            className="relative"
            onMouseEnter={() => setHelpOpen(true)}
            onMouseLeave={() => setHelpOpen(false)}
          >
            <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-800 transition-colors hover:bg-gray-100 dark:text-zinc-100 dark:hover:bg-gray-700">
              <span className="flex items-center gap-3">
                <HelpCircle className="h-4 w-4" />
                Help
              </span>
              <ChevronRight className="h-4 w-4 opacity-70" />
            </button>

            {helpOpen && (
              <div className="absolute top-0 right-[-10.5rem] z-50 w-40 rounded-lg border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                <button
                  onClick={() => router.push('/help/docs')}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Documentation
                </button>
                <button
                  onClick={() => router.push('/help/shortcuts')}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Keyboard shortcuts
                </button>
              </div>
            )}
          </div>

          <div className="my-2 h-px bg-gray-200 dark:bg-gray-700" />

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  )
}
