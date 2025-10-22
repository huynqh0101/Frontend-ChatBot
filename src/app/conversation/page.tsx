'use client'
import { MainContent } from '@/components/modules/chat/organisms/MainContent'
import { Sidebar } from '@/components/layout/organisms/Sidebar'
import { useState, useEffect } from 'react'
import { sendMessage } from '@/services/chatService'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/core/useAuth'

export default function ConversationPage() {
  const { isLoggedIn, isLoading: authLoading } = useAuth()
  const [refreshConversations, setRefreshConversations] = useState<number>(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace('/')
    }
  }, [authLoading, isLoggedIn, router])

  const handleStartNewChat = async (firstMessage: string) => {
    try {
      const result = await sendMessage(firstMessage, null)
      const conversationId = result.conversation?.id || `local-${Date.now()}`
      setRefreshConversations(Date.now())
      router.push(`/conversation/${conversationId}`)
    } catch (error) {}
  }

  const handleSelectConversation = (id: string | null) => {
    if (id === null) {
      return
    } else {
      router.push(`/conversation/${id}`)
    }
  }

  const handleConversationDeleted = (deletedId: string) => {
    setRefreshConversations(Date.now())
  }

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-screen bg-gray-100">
      <Sidebar
        onSelectConversation={handleSelectConversation}
        selectedConversationId={null}
        refreshTrigger={refreshConversations}
        collapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onConversationDeleted={handleConversationDeleted}
      />
      <div className="flex-1">
        <MainContent
          onStartNewChat={handleStartNewChat}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  )
}
