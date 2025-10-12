'use client'
import { MainContent } from '../organisms/MainContent'
import { useState, useEffect } from 'react'
import { sendMessage } from '@/services/chatService'
import { useRouter } from 'next/navigation'

// Simplified ChatTemplate - redirect to page-based routing
export function ChatTemplate() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    // Redirect to new routing structure
    router.replace('/')
  }, [router])

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('accessToken')
      setIsLoggedIn(!!token)
    }
    checkToken()
    window.addEventListener('storage', checkToken)
    return () => window.removeEventListener('storage', checkToken)
  }, [])

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

  return (
    <div className="h-screen bg-white">
      <MainContent
        onStartNewChat={handleStartNewChat}
        isLoggedIn={isLoggedIn}
      />
    </div>
  )
}
