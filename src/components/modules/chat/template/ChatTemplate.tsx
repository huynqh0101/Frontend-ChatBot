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
      if (!token) {
        console.error('No token found')
        return
      }

      console.log('Sending first message:', firstMessage) // Debug log

      // Gửi tin nhắn đầu tiên với conversationId: null
      const result = await sendMessage(token, firstMessage, null)

      console.log('API Response:', result) // Debug log

      // Kiểm tra các field khác nhau mà API có thể trả về
      const conversationId =
        result.conversationId || result.conversation_id || result.id

      if (conversationId) {
        setSelectedConversationId(conversationId)
        // Trigger refresh sidebar để hiển thị conversation mới
        setRefreshConversations((prev) => prev + 1)
      } else {
        console.error('No conversation ID in response:', result)
      }
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  return (
    <div className="relative flex h-screen bg-gray-100">
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
