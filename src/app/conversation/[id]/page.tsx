'use client'
import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/modules/chat/organisms/Sidebar'
import { MainContent2 } from '@/components/modules/chat/organisms/MainContent2'
import { ApiMessage } from '@/contents/interfaces'
import { useParams, useRouter } from 'next/navigation'
import { fetchMessages } from '@/services/chatService'

export default function ConversationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params.id as string

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [refreshConversations, setRefreshConversations] = useState<number>(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [initialMessages, setInitialMessages] = useState<ApiMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('accessToken')
      setIsLoggedIn(!!token)
    }
    checkToken()
    window.addEventListener('storage', checkToken)
    return () => window.removeEventListener('storage', checkToken)
  }, [])

  useEffect(() => {
    const loadInitialMessages = async () => {
      if (!conversationId) return

      const token = localStorage.getItem('accessToken')
      if (!token) {
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

      try {
        const messages = await fetchMessages(token, conversationId)
        if (messages && messages.length > 0) {
          setInitialMessages(messages)
          setLoading(false)
          return
        }
      } catch (error) {
        console.error('Error loading messages from API:', error)
      }

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
    }

    loadInitialMessages()
  }, [conversationId])

  const handleSelectConversation = (id: string | null) => {
    if (id === null) {
      router.push('/')
    } else if (id !== conversationId) {
      router.push(`/conversation/${id}`)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading conversation...</p>
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
