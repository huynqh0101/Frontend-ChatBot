'use client'
import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/organisms/Sidebar'
import { MainContent2 } from '@/components/modules/chat/organisms/MainContent2'
import { ApiMessage } from '@/contents/interfaces'
import { useParams, useRouter } from 'next/navigation'
import { fetchMessages } from '@/services/chatService'
import { useAuth } from '@/hooks/core/useAuth'

export default function ConversationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params.id as string
  const { isLoggedIn, isLoading: authLoading } = useAuth()

  const [refreshConversations, setRefreshConversations] = useState<number>(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [initialMessages, setInitialMessages] = useState<ApiMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInitialMessages = async () => {
      if (!conversationId) return

      // Nếu chưa login, thử lấy từ sessionStorage
      if (!isLoggedIn) {
        const savedMessages = sessionStorage.getItem('initialMessages')
        if (savedMessages) {
          try {
            const messages = JSON.parse(savedMessages)
            setInitialMessages(messages)
          } catch (e) {
            console.error('Error parsing saved messages:', e)
            setInitialMessages([])
          }
        } else {
          setInitialMessages([])
        }
        setLoading(false)
        return
      }

      // Nếu đã login, gọi API (apiClient sẽ tự động handle token)
      try {
        const messages = await fetchMessages(conversationId)
        if (messages && messages.length > 0) {
          setInitialMessages(messages)
          setLoading(false)
          return
        }
      } catch (error) {
        console.error('Error loading messages from API:', error)
        // Nếu API fail, fallback to sessionStorage
        const savedMessages = sessionStorage.getItem('initialMessages')
        if (savedMessages) {
          try {
            const messages = JSON.parse(savedMessages)
            setInitialMessages(messages)
          } catch (e) {
            console.error('Error parsing saved messages:', e)
            setInitialMessages([])
          }
        } else {
          setInitialMessages([])
        }
      }

      setLoading(false)
    }

    // Chỉ load khi auth check xong
    if (!authLoading) {
      loadInitialMessages()
    }
  }, [conversationId, isLoggedIn, authLoading])

  const handleSelectConversation = (id: string | null) => {
    if (id === null) {
      router.push('/')
    } else if (id !== conversationId) {
      router.push(`/conversation/${id}`)
    }
  }

  // Show loading khi đang check auth hoặc load messages
  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">
            {authLoading
              ? 'Checking authentication...'
              : 'Loading conversation...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white">
      {isLoggedIn && (
        <Sidebar
          onSelectConversation={handleSelectConversation}
          selectedConversationId={conversationId}
          refreshTrigger={refreshConversations}
          collapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      )}

      <div className="flex-1">
        <MainContent2
          conversationId={conversationId}
          initialMessages={initialMessages}
          onNewMessage={() => setRefreshConversations(Date.now())}
        />
      </div>
    </div>
  )
}
