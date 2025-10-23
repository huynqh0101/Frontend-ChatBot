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
  const [currentConversationExists, setCurrentConversationExists] =
    useState(true)
  const [isDeletingCurrentConversation, setIsDeletingCurrentConversation] =
    useState(false)

  useEffect(() => {
    const loadInitialMessages = async () => {
      if (!conversationId) return
      if (!isLoggedIn) {
        const savedMessages = sessionStorage.getItem('initialMessages')
        if (savedMessages) {
          try {
            const messages = JSON.parse(savedMessages)
            setInitialMessages(messages)
          } catch (e) {
            setInitialMessages([])
          }
        } else {
          setInitialMessages([])
        }
        setLoading(false)
        return
      }
      try {
        const messages = await fetchMessages(conversationId)
        if (messages && messages.length > 0) {
          setInitialMessages(messages)
          setLoading(false)
          return
        }
      } catch (error) {
        const savedMessages = sessionStorage.getItem('initialMessages')
        if (savedMessages) {
          try {
            const messages = JSON.parse(savedMessages)
            setInitialMessages(messages)
          } catch (e) {
            setInitialMessages([])
          }
        } else {
          setInitialMessages([])
        }
      }
      setLoading(false)
    }
    if (!authLoading) {
      loadInitialMessages()
    }
  }, [conversationId, isLoggedIn, authLoading])

  const handleSelectConversation = (id: string | null) => {
    if (isDeletingCurrentConversation) return
    if (id === null) {
      router.replace('/conversation')
    } else if (id !== conversationId) {
      router.push(`/conversation/${id}`)
    }
  }

  const handleConversationDeleted = (deletedId: string) => {
    if (deletedId === conversationId) {
      setIsDeletingCurrentConversation(true)
      setCurrentConversationExists(false)
      setTimeout(() => {
        router.replace('/conversation')
      }, 300)
    } else {
      setRefreshConversations(Date.now())
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent dark:border-blue-400"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {authLoading
              ? 'Checking authentication...'
              : 'Loading conversation...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {isLoggedIn && (
        <Sidebar
          onSelectConversation={handleSelectConversation}
          selectedConversationId={conversationId}
          refreshTrigger={refreshConversations}
          collapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onConversationDeleted={handleConversationDeleted}
        />
      )}
      <div className="flex-1">
        {currentConversationExists && !isDeletingCurrentConversation ? (
          <MainContent2
            conversationId={conversationId}
            initialMessages={initialMessages}
            onNewMessage={() => setRefreshConversations(Date.now())}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-50 dark:bg-gray-800">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent dark:border-blue-400"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Conversation deleted
              </p>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                Redirecting to new chat...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
