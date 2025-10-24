'use client'
import { MainContent } from '@/components/modules/chat/organisms/MainContent'
import { useEffect } from 'react'
import { sendMessage, sendAnonymousMessage } from '@/services/chatService'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/core/useAuth'
import { ApiMessage } from '@/contents/interfaces'
import { Loading } from '@/components/base/loading/Loading' // Thêm dòng này

export default function HomePage() {
  const { isLoggedIn, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Auto redirect if logged in
    if (!isLoading && isLoggedIn) {
      router.replace('/conversation')
    }
  }, [isLoggedIn, isLoading, router])

  const handleStartNewChat = async (firstMessage: string) => {
    try {
      // Chỉ dùng sendMessage cho tất cả cases
      const result = await sendMessage(firstMessage, null)

      console.log('API Response:', result)

      const conversationId = result.conversation?.id || `local-${Date.now()}`

      // Tạo initial messages từ response
      let initialMessages: ApiMessage[] = []

      if (result.messages && Array.isArray(result.messages)) {
        // Nếu BE trả về messages array (format mới)
        initialMessages = result.messages
      } else {
        // Fallback: tạo messages từ input và response
        initialMessages = [
          {
            id: 'user-' + Date.now(),
            conversationId: conversationId,
            role: 'user',
            content: firstMessage,
            createdAt: new Date().toISOString(),
          },
        ]

        // Add bot response nếu có
        if (result.message) {
          if (typeof result.message === 'object' && result.message.content) {
            initialMessages.push(result.message)
          } else if (typeof result.message === 'string') {
            initialMessages.push({
              id: 'bot-' + Date.now(),
              conversationId: conversationId,
              role: 'assistant',
              content: result.message,
              createdAt: new Date().toISOString(),
            })
          }
        }
      }

      console.log('Initial messages:', initialMessages) // Debug log

      // Save to sessionStorage
      sessionStorage.setItem('initialMessages', JSON.stringify(initialMessages))

      // Save anonymous conversation ID if not logged in
      if (!isLoggedIn) {
        localStorage.setItem('anonymousConversationId', conversationId)
      }

      router.push(`/conversation/${conversationId}`)
    } catch (error) {
      console.error('Error creating conversation:', error)

      // Fallback to local conversation
      const localId = 'local-' + Date.now()
      const fallbackMessages: ApiMessage[] = [
        {
          id: 'user-' + Date.now(),
          conversationId: localId,
          role: 'user',
          content: firstMessage,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'bot-' + Date.now(),
          conversationId: localId,
          role: 'assistant',
          content:
            "Sorry, I'm having trouble connecting. Please try again later.",
          createdAt: new Date().toISOString(),
        },
      ]

      sessionStorage.setItem(
        'initialMessages',
        JSON.stringify(fallbackMessages)
      )
      router.push(`/conversation/${localId}`)
    }
  }

  // Loading state
  if (isLoading) {
    return <Loading variant="circle" size={48} text="Loading..." />
  }

  // Redirecting state
  if (isLoggedIn) {
    return <Loading variant="circle" size={48} text="Redirecting..." />
  }

  // Main content for non-logged in users
  return (
    <div className="h-screen bg-white">
      <MainContent
        onStartNewChat={handleStartNewChat}
        isLoggedIn={isLoggedIn}
      />
    </div>
  )
}
