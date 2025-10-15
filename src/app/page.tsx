'use client'
import { MainContent } from '@/components/modules/chat/organisms/MainContent'
import { useState, useEffect } from 'react'
import { sendMessage } from '@/services/chatService'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('accessToken')
      const loggedIn = !!token
      setIsLoggedIn(loggedIn)
      setIsLoading(false)
      if (loggedIn) {
        router.replace('/conversation')
      }
    }

    checkToken()
    window.addEventListener('storage', checkToken)
    return () => window.removeEventListener('storage', checkToken)
  }, [router])

  const handleStartNewChat = async (firstMessage: string) => {
    try {
      console.log('=== STARTING NEW CHAT ===')
      console.log('First message:', firstMessage)

      const token = localStorage.getItem('accessToken')
      console.log('Has token:', !!token)

      const result = await sendMessage(token || '', firstMessage, null)
      console.log('Send message result:', result)

      const conversationId =
        result.conversation?.id ||
        result.conversationId ||
        result.conversation_id ||
        result.id ||
        'local-' + Date.now()

      console.log('Conversation ID:', conversationId)

      // Tạo messages array từ response
      let initialMessages = []

      if (result.messages && result.messages.length > 0) {
        // Nếu API trả về messages array
        initialMessages = result.messages
        console.log('Using API messages:', initialMessages)
      } else {
        // Nếu không có messages array, tạo manually từ input và response
        const userMessage = {
          role: 'user',
          content: firstMessage,
          createdAt: new Date().toISOString(),
        }

        const botResponse =
          result.message || result.content || 'Hello! How can I help you?'
        const botMessage = {
          role: 'assistant',
          content: botResponse,
          createdAt: new Date().toISOString(),
        }

        initialMessages = [userMessage, botMessage]
        console.log('Created manual messages:', initialMessages)
      }

      // Luôn lưu vào sessionStorage (dù có login hay không)
      console.log('Saving to sessionStorage:', initialMessages)
      sessionStorage.setItem('initialMessages', JSON.stringify(initialMessages))

      // Verify sessionStorage
      const saved = sessionStorage.getItem('initialMessages')
      console.log('Verified sessionStorage save:', !!saved)

      // Lưu anonymous conversation ID nếu chưa đăng nhập
      if (!token) {
        localStorage.setItem('anonymousConversationId', conversationId)
        console.log('Saved anonymous conversation ID')
      }

      console.log('Redirecting to conversation...')
      router.push(`/conversation/${conversationId}`)
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="h-screen bg-white">
        <MainContent
          onStartNewChat={handleStartNewChat}
          isLoggedIn={isLoggedIn}
        />
      </div>
    )
  }

  return null
}
