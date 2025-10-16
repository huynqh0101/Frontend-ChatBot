'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot } from 'lucide-react'
import { MessageBubble, type Message } from '../molecules/MessageBubble'
import { sendMessage, sendAnonymousMessage } from '@/services/chatService'
import { ApiMessage } from '@/contents/interfaces'
import { useAuth } from '@/hooks/core/useAuth'

interface MainContent2Props {
  conversationId: string
  initialMessages: ApiMessage[]
  onNewMessage?: () => void
}

export function MainContent2({
  conversationId,
  initialMessages = [],
  onNewMessage,
}: MainContent2Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { isLoggedIn } = useAuth()

  const mapApiMessages = (msgs: ApiMessage[]): Message[] =>
    msgs.map((msg) => ({
      sender: msg.role === 'user' ? 'user' : 'bot',
      name: msg.role === 'user' ? 'Andrew Nelson' : 'CHAT A.I+',
      avatar:
        msg.role === 'user'
          ? 'https://placehold.co/40x40/E8E8E8/424242?text=AN'
          : 'https://placehold.co/40x40/171717/FFFFFF?text=A.I',
      text: msg.content,
    }))

  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setMessages(mapApiMessages(initialMessages))
    } else {
      // Reset messages if no initial messages
      setMessages([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    setInputValue('')
    setIsTyping(true)

    const newUserMessage: Message = {
      sender: 'user',
      name: 'Andrew Nelson',
      avatar: 'https://placehold.co/40x40/E8E8E8/424242?text=AN',
      text: userMessage,
    }
    setMessages((prev) => [...prev, newUserMessage])

    try {
      // Chỉ dùng sendMessage cho cả anonymous và authenticated
      const result = await sendMessage(userMessage, conversationId)

      console.log('API Response:', result)

      if (
        result.messages &&
        Array.isArray(result.messages) &&
        result.messages.length > 0
      ) {
        // Replace toàn bộ messages với data từ backend
        setMessages(mapApiMessages(result.messages))
      } else {
        // Fallback: thêm bot response manually
        let botResponseText = ''

        if (result.message) {
          if (typeof result.message === 'object' && result.message.content) {
            botResponseText = result.message.content
          } else if (typeof result.message === 'string') {
            botResponseText = result.message
          }
        }

        if (!botResponseText) {
          botResponseText =
            'I received your message but had trouble responding. Please try again.'
        }

        const botMessage: Message = {
          sender: 'bot',
          name: 'CHAT A.I+',
          avatar: 'https://placehold.co/40x40/171717/FFFFFF?text=A.I',
          text: botResponseText,
        }
        setMessages((prev) => [...prev, botMessage])
      }

      // Trigger refresh conversations list nếu có callback và user đã login
      if (isLoggedIn && onNewMessage) {
        onNewMessage()
      }
    } catch (error) {
      console.error('Error sending message:', error)

      const errorMessage: Message = {
        sender: 'bot',
        name: 'CHAT A.I+',
        avatar: 'https://placehold.co/40x40/171717/FFFFFF?text=A.I',
        text: 'Sorry, I encountered an error. Please try again or check your connection.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <main className="flex h-screen flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.length === 0 && !isTyping && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Bot className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-500">Start a conversation...</p>
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}

          {isTyping && (
            <div className="flex justify-start gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white/80 p-4 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl">
          <div className="relative flex items-end gap-3">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-800 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-xl bg-blue-600 p-2 text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-gray-500">
            AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </main>
  )
}
