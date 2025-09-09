'use client'
import { useEffect, useState } from 'react'
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
}

export function Sidebar({
  onSelectConversation,
  selectedConversationId,
  refreshTrigger,
}: SidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])

  useEffect(() => {
    const loadConversations = async () => {
      const token = localStorage.getItem('token')
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
      const token = localStorage.getItem('token')
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
      const token = localStorage.getItem('token')
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
    <aside className="my-3 ml-3 hidden h-[calc(100vh-24px)] w-72 flex-col rounded-2xl border bg-white p-4 shadow-lg lg:flex">
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
    </aside>
  )
}
