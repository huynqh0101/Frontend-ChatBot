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
      const token = localStorage.getItem('accessToken')
      if (!token) {
        setSelectedConversationId('local-' + Date.now())
        setInitialMessages([
          {
            id: 'local-' + Date.now(),
            conversationId: 'local-' + Date.now(),
            role: 'user',
            content: firstMessage,
            createdAt: new Date().toISOString(),
          },
        ])
        return
      }

      const result = await sendMessage(token, firstMessage, null)
      const conversationId =
        result.conversation?.id ||
        result.conversationId ||
        result.conversation_id ||
        result.id

      if (conversationId) {
        setSelectedConversationId(conversationId)
        setInitialMessages(result.messages || [])
        setRefreshConversations((prev) => prev + 1)
      } else {
        console.error('No conversation ID in response:', result)
      }
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
