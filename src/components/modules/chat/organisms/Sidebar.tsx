'use client'
import { useEffect, useState } from 'react'
import { Pen, Search, Settings, PanelLeft } from 'lucide-react'
import SidebarHeader from '../molecules/SidebarHeader'
import SidebarConversations from '../molecules/SidebarConversations'
import SidebarFooter from '../molecules/SidebarFooter'
import SidebarLast7Days from '../molecules/SidebarLast7Days'
import {
  fetchConversations,
  deleteConversation,
  deleteAllConversations,
  Conversation,
} from '@/services/chatService'

interface SidebarProps {
  onSelectConversation: (id: string | null) => void
  selectedConversationId: string | null
  refreshTrigger?: number
  collapsed?: boolean
  onToggle?: () => void // Thêm prop để toggle
}

export function Sidebar({
  onSelectConversation,
  selectedConversationId,
  refreshTrigger,
  collapsed = false,
  onToggle,
}: SidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])

  useEffect(() => {
    const loadConversations = async () => {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      try {
        const conversationList = await fetchConversations(token)
        setConversations(conversationList)
      } catch (error) {
        console.error('Error loading conversations:', error)
        setConversations([])
      }
    }

    loadConversations()
  }, [refreshTrigger])

  const handleNewChat = () => {
    onSelectConversation(null)
  }

  const handleEditConversation = async (index: number, newName: string) => {
    setConversations((prev) =>
      prev.map((item, i) => (i === index ? { ...item, title: newName } : item))
    )

    // TODO: Call API to update conversation title
    // await updateConversationTitle(token, conversations[index].id, newName)
  }

  const handleDeleteConversation = async (index: number) => {
    const conversation = conversations[index]
    if (!conversation) return

    try {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      await deleteConversation(token, conversation.id)

      setConversations((prev) => prev.filter((_, i) => i !== index))

      if (selectedConversationId === conversation.id) {
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
      const token = localStorage.getItem('accessToken')
      if (!token) return

      await deleteAllConversations(token)

      setConversations([])

      onSelectConversation(null)
    } catch (error) {
      console.error('Error deleting all conversations:', error)
      alert('Failed to delete all conversations')
    }
  }

  const handleSearchChange = (searchValue: string) => {
    console.log('Search:', searchValue)
  }

  const handleSelectConversation = (index: number) => {
    const conversation = conversations[index]
    if (conversation) {
      onSelectConversation(conversation.id)
    }
  }

  const last7Days = [
    'Crypto Lending App Name',
    'Operator Grammer Types',
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
            title="Mở sidebar"
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
          {/* Toggle button khi expanded - ở góc trên bên phải của sidebar */}
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-lg font-bold text-zinc-800">CHAT A.I+</h1>
            <button
              onClick={onToggle}
              title="Đóng sidebar"
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
            <SidebarConversations
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onEdit={handleEditConversation}
              onDelete={handleDeleteConversation}
              onClearAll={handleClearAll}
              onSelect={handleSelectConversation}
            />
            <SidebarLast7Days items={last7Days} />
          </div>
          <SidebarFooter />
        </>
      )}
    </aside>
  )
}
