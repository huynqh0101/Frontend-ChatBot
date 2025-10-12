'use client'
import { MainContent } from '@/components/modules/chat/organisms/MainContent'
import { Sidebar } from '@/components/modules/chat/organisms/Sidebar'
import { useState, useEffect } from 'react'
import { sendMessage } from '@/services/chatService'
import { useRouter } from 'next/navigation'

export default function ConversationPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [refreshConversations, setRefreshConversations] = useState<number>(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('accessToken')
      const loggedIn = !!token
      setIsLoggedIn(loggedIn)

      // Nếu chưa đăng nhập, chuyển về trang chủ
      if (!loggedIn) {
        router.replace('/')
      }
    }
    checkToken()
    window.addEventListener('storage', checkToken)
    return () => window.removeEventListener('storage', checkToken)
  }, [router])

  // Hàm xử lý tạo conversation mới bằng cách gửi tin nhắn đầu tiên
  const handleStartNewChat = async (firstMessage: string) => {
    try {
      const token = localStorage.getItem('accessToken') || ''
      const result = await sendMessage(token, firstMessage, null)
      const conversationId =
        result.conversation?.id ||
        result.conversationId ||
        result.conversation_id ||
        result.id ||
        'local-' + Date.now()

      // Chuyển đến trang conversation với ID
      router.push(`/conversation/${conversationId}`)
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  const handleSelectConversation = (id: string | null) => {
    if (id === null) {
      // Khi chọn "New Chat" - stay ở trang hiện tại
      return
    } else {
      // Chuyển đến conversation cụ thể
      router.push(`/conversation/${id}`)
    }
  }

  // Nếu chưa đăng nhập, không hiển thị gì (sẽ redirect)
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
    <div className="relative flex h-screen bg-white">
      {/* Sidebar với toggle button */}
      <Sidebar
        onSelectConversation={handleSelectConversation}
        selectedConversationId={null} // Không có conversation nào được select
        refreshTrigger={refreshConversations}
        collapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
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
