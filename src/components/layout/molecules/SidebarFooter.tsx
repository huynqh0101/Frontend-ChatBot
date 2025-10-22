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
  const { theme, setTheme } = useTheme()

  useEffect(() => {
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

  return (
    <div className="mt-auto border-t pt-4">
      <button className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2">
        <img
          src={`https://placehold.co/32x32/3B82F6/FFFFFF?text=${getInitials(
            userName
          )}`}
          alt={userName || 'User'}
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="-mt-0.5 flex items-center gap-[95px] text-[15px] font-medium text-zinc-800">
          {userName || 'Unknown User'}
          <span onClick={handleToggleTheme} className="cursor-pointer">
            {theme === 'light' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </span>
        </span>
      </button>
    </div>
  )
}
