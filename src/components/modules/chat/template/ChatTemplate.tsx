'use client'
import { useState, useEffect } from 'react'
import { Sidebar } from '../organisms/Sidebar'
import { MainContent } from '../organisms/MainContent'
import { MainContent2 } from '../organisms/MainContent2'
import { sendMessage } from '@/services/chatService'
import { ApiMessage } from '@/contents/interfaces'

export function ChatTemplate() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [refreshConversations, setRefreshConversations] = useState<number>(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [initialMessages, setInitialMessages] = useState<ApiMessage[]>([])

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('accessToken')
      setIsLoggedIn(!!token)
    }
    checkToken()
    window.addEventListener('storage', checkToken)
    return () => window.removeEventListener('storage', checkToken)
  }, [])

  // Hàm xử lý tạo conversation mới bằng cách gửi tin nhắn đầu tiên
  const handleStartNewChat = async (firstMessage: string) => {
    try {
      const token = localStorage.getItem('accessToken') || ''
      // Luôn gọi API
      const result = await sendMessage(token, firstMessage, null)
      const conversationId =
        result.conversation?.id ||
        result.conversationId ||
        result.conversation_id ||
        result.id ||
        'local-' + Date.now()

      setSelectedConversationId(conversationId)
      setInitialMessages(
        result.messages && result.messages.length > 0
          ? result.messages
          : [
              {
                id: conversationId + '-user',
                conversationId,
                role: 'user',
                content: firstMessage,
                createdAt: new Date().toISOString(),
              },
              result.message
                ? {
                    id: conversationId + '-ai',
                    conversationId,
                    role: 'bot',
                    content: result.message,
                    createdAt: new Date().toISOString(),
                  }
                : null,
            ].filter(Boolean)
      )
      setRefreshConversations((prev) => prev + 1)
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  return (
    <div className="relative flex h-screen bg-white">
      {/* Sidebar với toggle button bên trong */}
      {isLoggedIn && (
        <Sidebar
          onSelectConversation={setSelectedConversationId}
          selectedConversationId={selectedConversationId}
          refreshTrigger={refreshConversations}
          collapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      )}

      <div className="flex-1">
        {selectedConversationId ? (
          <MainContent2
            conversationId={selectedConversationId}
            initialMessages={initialMessages}
          />
        ) : (
          <MainContent
            onStartNewChat={handleStartNewChat}
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>
    </div>
  )
}
