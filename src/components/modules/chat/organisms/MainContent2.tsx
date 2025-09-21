'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import { MessageBubble, type Message } from '../molecules/MessageBubble'

interface MainContent2Props {
  conversationId: string
}

// Dữ liệu mẫu cho cuộc hội thoại
const initialMessages: Message[] = [
  {
    sender: 'user',
    name: 'Andrew Neilson',
    avatar: 'https://placehold.co/40x40/E8E8E8/424242?text=AN',
    text: 'Create a chatbot gpt using python language what will be step for that',
  },
  {
    sender: 'bot',
    name: 'CHAT A.I+',
    avatar: 'https://placehold.co/40x40/171717/FFFFFF?text=A.I',
    text: (
      <>
        <p className="mb-4">
          Sure, I can help you get started with creating a chatbot using GPT in
          Python. Here are the basic steps you&apos;ll need to follow:
        </p>
        <ol className="space-y-2 pl-4">
          <li className="flex">
            <span className="mr-2 font-semibold text-blue-600">1.</span>
            <div>
              <strong>Install the required libraries:</strong> You&apos;ll need
              to install the transformers library from Hugging Face to use GPT.
              You can install it using pip.
            </div>
          </li>
          <li className="flex">
            <span className="mr-2 font-semibold text-blue-600">2.</span>
            <div>
              <strong>Load the pre-trained model:</strong> GPT comes in several
              sizes and versions, so you&apos;ll need to choose the one that
              fits your needs.
            </div>
          </li>
          <li className="flex">
            <span className="mr-2 font-semibold text-blue-600">3.</span>
            <div>
              <strong>Create a chatbot loop:</strong> You&apos;ll need to create
              a loop that takes user input, generates a response using the GPT
              model, and outputs it to the user.
            </div>
          </li>
          <li className="flex">
            <span className="mr-2 font-semibold text-blue-600">4.</span>
            <div>
              <strong>Add some personality to the chatbot:</strong> While GPT
              can generate text, it doesn&apos;t have any inherent personality
              or style.
            </div>
          </li>
        </ol>
        <p className="mt-4 text-gray-600">
          These are just the basic steps to get started with a GPT chatbot in
          Python. Good luck with your project! 🚀
        </p>
      </>
    ),
  },
]

export function MainContent2({ conversationId }: MainContent2Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newUserMessage: Message = {
        sender: 'user',
        name: 'Andrew Neilson',
        avatar: 'https://placehold.co/40x40/E8E8E8/424242?text=AN',
        text: inputValue,
      }
      setMessages((prev) => [...prev, newUserMessage])
      setInputValue('')
      setIsTyping(true)

      // Simulate bot response
      setTimeout(() => {
        const botResponse: Message = {
          sender: 'bot',
          name: 'CHAT A.I+',
          avatar: 'https://placehold.co/40x40/171717/FFFFFF?text=A.I',
          text: `I understand you're asking about "${inputValue}". Let me help you with that...`,
        }
        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      }, 2000)
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
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-100 bg-white text-gray-800 shadow-sm'
                }`}
              >
                <div className="prose prose-sm max-w-none">
                  {typeof msg.text === 'string' ? (
                    <p
                      className={
                        msg.sender === 'user' ? 'text-white' : 'text-gray-800'
                      }
                    >
                      {msg.text}
                    </p>
                  ) : (
                    <div className="text-gray-800">{msg.text}</div>
                  )}
                </div>

                {msg.sender === 'bot' && (
                  <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-2">
                    <button className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-100">
                      <Copy className="h-3 w-3" />
                      Copy
                    </button>
                    <button className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-100">
                      <ThumbsUp className="h-3 w-3" />
                    </button>
                    <button className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-100">
                      <ThumbsDown className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-300">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              )}
            </div>
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
