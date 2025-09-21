'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import { MessageBubble, type Message } from '../molecules/MessageBubble'
import { fetchMessages, sendMessage } from '@/services/chatService'

interface MainContent2Props {
  conversationId: string
  initialMessages?: any[] // nhận từ API khi tạo mới
}

export function MainContent2({
  conversationId,
  initialMessages = [],
}: MainContent2Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Map API messages về dạng MessageBubble.Message
  const mapApiMessages = (msgs: any[]): Message[] =>
    msgs.map((msg) => ({
      sender: msg.role === 'user' ? 'user' : 'bot',
      name: msg.role === 'user' ? 'Andrew Neilson' : 'CHAT A.I+',
      avatar:
        msg.role === 'user'
          ? 'https://placehold.co/40x40/E8E8E8/424242?text=AN'
          : 'https://placehold.co/40x40/171717/FFFFFF?text=A.I',
      text: msg.content,
    }))

  useEffect(() => {
    // Nếu có initialMessages (tạo mới), dùng luôn
    if (initialMessages.length > 0) {
      setMessages(mapApiMessages(initialMessages))
    } else {
      // Nếu chuyển sang conversation cũ, fetch từ API
      const loadMessages = async () => {
        const token = localStorage.getItem('token')
        if (!token) return
        try {
          const msgs = await fetchMessages(token, conversationId)
          setMessages(mapApiMessages(msgs))
        } catch (err) {
          setMessages([])
        }
      }
      loadMessages()
    }
  }, [conversationId, initialMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return
    const token = localStorage.getItem('token')
    if (!token) return

    setIsTyping(true)
    // Gửi tin nhắn lên API
    const result = await sendMessage(token, inputValue, conversationId)
    if (result.messages) {
      setMessages((prev) => [...prev, ...mapApiMessages(result.messages)])
    } else {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'user',
          name: 'Andrew Neilson',
          avatar: 'https://placehold.co/40x40/E8E8E8/424242?text=AN',
          text: inputValue,
        },
        {
          sender: 'bot',
          name: 'CHAT A.I+',
          avatar: 'https://placehold.co/40x40/171717/FFFFFF?text=A.I',
          text: result.message || 'AI is thinking...',
        },
      ])
    }
    setInputValue('')
    setIsTyping(false)
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
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-800 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
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
