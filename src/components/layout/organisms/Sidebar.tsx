'use client'
import { useEffect, useState } from 'react'
import { Pen, Search, Settings, PanelLeft } from 'lucide-react'
import SidebarHeader from '../molecules/SidebarHeader'
import SidebarConversations from '../molecules/SidebarConversations'
import SidebarFooter from '../molecules/SidebarFooter'
import SidebarLast7Days from '../molecules/SidebarLast7Days'
import { useAuth } from '@/hooks/core/useAuth'
import {
  fetchConversations,
  updateConversationTitle,
} from '@/services/chatService'
import { Conversation } from '@/contents/interfaces'

interface SidebarProps {
  onSelectConversation: (id: string | null) => void
  selectedConversationId: string | null
  refreshTrigger?: number
  collapsed?: boolean
  onToggle?: () => void
  onConversationDeleted?: (conversationId: string) => void
}

function getInitials(name: string) {
  if (!name) return 'AN'
  const words = name.trim().split(' ')
  const initials = words
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return initials.slice(0, 2)
}

export function Sidebar({
  onSelectConversation,
  selectedConversationId,
  refreshTrigger,
  collapsed = false,
  onToggle,
  onConversationDeleted,
}: SidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const { isLoggedIn } = useAuth()

  const loadConversations = async () => {
    if (!isLoggedIn) {
      setConversations([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const conversationList = await fetchConversations()
      setConversations(conversationList)
    } catch (error) {
      setConversations([])
    } finally {
      setLoading(false)
    }
  }
  const [userName, setUserName] = useState('')

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

  useEffect(() => {
    loadConversations()
  }, [isLoggedIn, refreshTrigger])

  const handleNewChat = () => {
    onSelectConversation(null)
  }

  const handleEditConversation = async (
    conversationId: string,
    newName: string
  ) => {
    try {
      await updateConversationTitle(conversationId, newName)
      setConversations((prev) =>
        prev.map((item) =>
          item.id === conversationId ? { ...item, title: newName } : item
        )
      )
    } catch (error) {}
  }

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      setConversations((prev) =>
        prev.filter((item) => item.id !== conversationId)
      )
      if (onConversationDeleted) {
        onConversationDeleted(conversationId)
      }
    } catch (error) {
      loadConversations()
    }
  }

  const handleClearAll = async () => {
    try {
      setConversations([])
      onSelectConversation(null)
    } catch (error) {
      loadConversations()
    }
  }

  const last7Days = [
    'Crypto Lending App Name',
    'Operator Grammar Types',
    'Min States For Binary DFA',
    'React State Management',
    'Next.js SSR vs SSG',
    'Deploy Node App to Vercel',
    'JWT Authentication Flow',
    'Responsive Navbar Example',
    'Redux vs Context API',
    'Best UI Libraries 2025',
    'How to use SWR',
  ]

  const handleSearchChange = (searchTerm: string) => {}

  return (
    <aside
      className={`flex flex-col border border-gray-200 bg-white shadow-lg transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 ${
        collapsed
          ? 'h-full w-16 items-center p-2'
          : 'my-3 ml-3 h-[calc(100vh-24px)] w-72 rounded-2xl p-4'
      }`}
    >
      {collapsed ? (
        <div className="flex h-full flex-1 flex-col items-center gap-4">
          <button
            onClick={onToggle}
            title="Open sidebar"
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <PanelLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button title="New chat" onClick={handleNewChat}>
            <Pen className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>
          <button title="Search">
            <Search className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>
          <button title="Settings">
            <Settings className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>
          <div className="mt-auto mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3B82F6] font-bold text-white dark:bg-blue-600">
              {getInitials(userName)}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
              CHAT A.I+
            </h1>
            <button
              onClick={onToggle}
              title="Close sidebar"
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <PanelLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
          <SidebarHeader
            onNewChat={handleNewChat}
            onSearchChange={handleSearchChange}
          />
          <div className="scrollbar-hide mt-6 flex-1 overflow-y-auto pr-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent dark:border-blue-400"></div>
              </div>
            ) : (
              <>
                <SidebarConversations
                  conversations={conversations}
                  selectedConversationId={selectedConversationId}
                  onEdit={handleEditConversation}
                  onDelete={handleDeleteConversation}
                  onClearAll={handleClearAll}
                  onSelect={onSelectConversation}
                  onRefresh={loadConversations}
                />
                <SidebarLast7Days items={last7Days} />
              </>
            )}
          </div>
          <SidebarFooter />
        </>
      )}
    </aside>
  )
}
