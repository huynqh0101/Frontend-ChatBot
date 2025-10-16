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
  deleteConversation,
  deleteAllConversations,
  updateConversationTitle,
} from '@/services/chatService'
import { Conversation } from '@/contents/interfaces'

interface SidebarProps {
  onSelectConversation: (id: string | null) => void
  selectedConversationId: string | null
  refreshTrigger?: number
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({
  onSelectConversation,
  selectedConversationId,
  refreshTrigger,
  collapsed = false,
  onToggle,
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
      // apiClient sẽ tự động handle authentication và refresh token
      const conversationList = await fetchConversations()
      setConversations(conversationList)
    } catch (error) {
      console.error('Error loading conversations:', error)
      // apiClient sẽ handle redirect to login nếu cần
      setConversations([])
    } finally {
      setLoading(false)
    }
  }

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
      // apiClient sẽ tự động handle authentication
      await updateConversationTitle(conversationId, newName)

      // Optimistic update
      setConversations((prev) =>
        prev.map((item) =>
          item.id === conversationId ? { ...item, title: newName } : item
        )
      )
    } catch (error) {
      console.error('Error updating conversation title:', error)
      // Có thể thêm toast notification ở đây
    }
  }

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      // apiClient sẽ tự động handle authentication
      await deleteConversation(conversationId)

      // Optimistic update
      setConversations((prev) =>
        prev.filter((item) => item.id !== conversationId)
      )

      // If deleted conversation was selected, redirect to new chat
      if (selectedConversationId === conversationId) {
        onSelectConversation(null)
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
      alert('Failed to delete conversation')
    }
  }

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete all conversations?')) {
      return
    }

    try {
      // apiClient sẽ tự động handle authentication
      await deleteAllConversations()

      // Clear local state
      setConversations([])

      // Redirect to new chat
      onSelectConversation(null)
    } catch (error) {
      console.error('Error deleting all conversations:', error)
      alert('Failed to delete all conversations')
    }
  }

  const handleSearchChange = (searchValue: string) => {
    console.log('Search:', searchValue)
    // TODO: Implement search functionality
  }

  const handleSelectConversation = (conversationId: string) => {
    onSelectConversation(conversationId)
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

  return (
    <aside
      className={`flex flex-col border bg-white shadow-lg transition-all duration-300 ${
        collapsed
          ? 'h-full w-16 items-center p-2'
          : 'my-3 ml-3 h-[calc(100vh-24px)] w-72 rounded-2xl p-4'
      }`}
    >
      {collapsed ? (
        <div className="flex h-full flex-1 flex-col items-center gap-4">
          {/* Toggle button khi collapsed */}
          <button
            onClick={onToggle}
            title="Open sidebar"
            className="rounded-lg border border-gray-200 bg-gray-50 p-2 transition-colors hover:bg-gray-100"
          >
            <PanelLeft className="h-5 w-5 text-gray-700" />
          </button>

          <button title="New chat" onClick={handleNewChat}>
            <Pen className="h-6 w-6 text-gray-700" />
          </button>
          <button title="Search">
            <Search className="h-6 w-6 text-gray-700" />
          </button>
          <button title="Settings">
            <Settings className="h-6 w-6 text-gray-700" />
          </button>
          <div className="mt-auto mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
              HN
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Toggle button khi expanded */}
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-lg font-bold text-zinc-800">CHAT A.I+</h1>
            <button
              onClick={onToggle}
              title="Close sidebar"
              className="rounded-lg border border-gray-200 bg-gray-50 p-2 transition-colors hover:bg-gray-100"
            >
              <PanelLeft className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          <SidebarHeader
            onNewChat={handleNewChat}
            onSearchChange={handleSearchChange}
          />

          <div className="scrollbar-hide mt-6 flex-1 overflow-y-auto pr-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              </div>
            ) : (
              <>
                <SidebarConversations
                  conversations={conversations}
                  selectedConversationId={selectedConversationId}
                  onEdit={handleEditConversation}
                  onDelete={handleDeleteConversation}
                  onClearAll={handleClearAll}
                  onSelect={handleSelectConversation}
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
