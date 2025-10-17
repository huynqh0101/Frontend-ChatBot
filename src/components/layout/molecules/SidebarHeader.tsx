import { Plus, Search, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface SidebarHeaderProps {
  onNewChat: () => void
  onSearchChange?: (searchValue: string) => void
}

export default function SidebarHeader({
  onNewChat,
  onSearchChange,
}: SidebarHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen)
    if (isSearchOpen) {
      setSearchValue('')
      onSearchChange?.('')
    }
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    onSearchChange?.(value)
  }

  // Click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        if (isSearchOpen) {
          setIsSearchOpen(false)
          setSearchValue('')
          onSearchChange?.('')
        }
      }
    }

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSearchOpen, onSearchChange])

  if (isSearchOpen) {
    return (
      <div ref={searchContainerRef}>
        <div className="mt-6 flex w-full items-center gap-3">
          <button
            className="flex flex-shrink-0 items-center justify-center rounded-full bg-[#5561F7] p-3 transition-transform duration-150 hover:scale-[1.02]"
            onClick={handleSearchToggle}
          >
            <Plus className="h-5 w-5 text-white" />
          </button>
          <div className="animate-in slide-in-from-right flex min-w-0 flex-1 items-center gap-3 rounded-full bg-black px-4 py-2.5 duration-500 ease-out">
            <Search className="h-5 w-5 flex-shrink-0 text-white" />
            <input
              type="text"
              placeholder="Search Conversation..."
              value={searchValue}
              onChange={handleSearchInputChange}
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder-gray-400 outline-none"
              autoFocus
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mt-6 flex w-full items-center gap-3">
        <button
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#5561F7] py-2.5 text-white transition-all duration-150 hover:scale-[1.02] hover:bg-[#4854e0]"
          onClick={onNewChat}
        >
          <Plus className="h-5 w-5" />
          <span className="font-semibold">New chat</span>
        </button>
        <button
          className="flex flex-shrink-0 items-center justify-center rounded-full bg-black p-3 transition-transform duration-150 hover:scale-[1.02]"
          onClick={handleSearchToggle}
        >
          <Search className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  )
}
