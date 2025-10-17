'use client'
import { MainContent } from '@/components/modules/chat/organisms/MainContent'
import { Sidebar } from '@/components/layout/organisms/Sidebar'
import { useState } from 'react'
import { sendMessage } from '@/services/chatService'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/core/useAuth'

export default function ConversationPage() {
  const { isLoggedIn, isLoading: authLoading } = useAuth()
  const [refreshConversations, setRefreshConversations] = useState<number>(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  // Hàm xử lý tạo conversation mới bằng cách gửi tin nhắn đầu tiên
  const handleStartNewChat = async (firstMessage: string) => {
    try {
      // Không cần truyền token, apiClient sẽ tự động handle
      const result = await sendMessage(firstMessage, null)
      const conversationId = result.conversation?.id || 'local-' + Date.now()

      // Chuyển đến trang conversation với ID
      router.push(`/conversation/${conversationId}`)
    } catch (error) {
      console.error('Error creating conversation:', error)
      // Có thể thêm toast notification ở đây
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

  // Show loading khi đang check auth
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

  // Nếu chưa đăng nhập, redirect về trang chủ
  if (!isLoggedIn) {
    router.replace('/')
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
        selectedConversationId={null}
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
