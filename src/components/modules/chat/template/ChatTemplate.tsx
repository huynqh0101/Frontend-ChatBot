'use client'
import { useState, useEffect } from 'react'
import { Sidebar } from '../organisms/Sidebar'
import { MainContent } from '../organisms/MainContent'
import { MainContent2 } from '../organisms/MainContent2'
import { sendMessage } from '@/services/chatService'
import { PanelLeft, PanelRight } from 'lucide-react'

export function ChatTemplate() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [refreshConversations, setRefreshConversations] = useState<number>(0) // Trigger để refresh sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  // Hàm xử lý tạo conversation mới bằng cách gửi tin nhắn đầu tiên
  const handleStartNewChat = async (firstMessage: string) => {
    try {
      const token = localStorage.getItem('token')
      // Nếu không có token, vẫn cho phép gửi tin nhắn (ví dụ: gọi API public hoặc tạo conversation local)
      if (!token) {
        // Nếu API yêu cầu token, bạn có thể tạo một conversation tạm thời ở client hoặc gọi API khác
        // Ví dụ: chỉ log ra hoặc tạo conversation local
        console.warn('No token found, creating local conversation')
        setSelectedConversationId('local-' + Date.now())
        return
      }

      // Nếu có token thì gọi API như cũ
      const result = await sendMessage(token, firstMessage, null)
      const conversationId =
        result.conversationId || result.conversation_id || result.id

      if (conversationId) {
        setSelectedConversationId(conversationId)
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

      {/* Main content - bỏ toggle button ở đây */}
      <div className="flex-1">
        {selectedConversationId ? (
          <MainContent2
            conversationId={selectedConversationId}
            key={selectedConversationId}
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
