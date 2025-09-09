'use client'
import React, { useState } from 'react'
import { Send } from 'lucide-react'
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
        <p>
          Sure, I can help you get started with creating a chatbot using GPT in
          Python. Here are the basic steps you&apos;ll need to follow:
        </p>
        <ol>
          <li>
            <strong>Install the required libraries:</strong> You&apos;ll need to
            install the transformers library from Hugging Face to use GPT. You
            can install it using pip.
          </li>
          <li>
            <strong>Load the pre-trained model:</strong> GPT comes in several
            sizes and versions, so you&apos;ll need to choose the one that fits
            your needs. You can load a pre-trained GPT model. This loads the
            1.3B parameter version of GPT-Neo, which is a powerful and
            relatively recent model.
          </li>
          <li>
            <strong>Create a chatbot loop:</strong> You&apos;ll need to create a
            loop that takes user input, generates a response using the GPT
            model, and outputs it to the user.
          </li>
          <li>
            <strong>Add some personality to the chatbot:</strong> While GPT can
            generate text, it doesn&apos;t have any inherent personality or
            style. You can make your chatbot more interesting by adding custom
            prompts or responses that reflect your desired personality.
          </li>
        </ol>
        <p>
          These are just the basic steps to get started with a GPT chatbot in
          Python. Depending on your requirements, you may need to add more
          features or complexity to the chatbot. Good luck!
        </p>
      </>
    ),
  },
  {
    sender: 'user',
    name: 'Andrew Neilson',
    avatar: 'https://placehold.co/40x40/E8E8E8/424242?text=AN',
    text: 'What is use of that chatbot?',
  },
  {
    sender: 'bot',
    name: 'CHAT A.I+',
    avatar: 'https://placehold.co/40x40/171717/FFFFFF?text=A.I',
    text: 'Chatbots can be used for a wide range of purposes, including: Customer service chatbots can handle frequently asked questions, provide basic support, and help customers navigate...',
  },
]

export function MainContent2({ conversationId }: MainContent2Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')

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
      // TODO: Thêm logic gọi API và nhận phản hồi từ bot ở đây
    }
  }

  return (
    <main className="relative flex-1 bg-white">
      {/* Scrollable chat area */}
      <div className="h-[calc(100vh-80px)] overflow-y-auto p-6 md:p-10">
        <div className="mx-auto max-w-3xl space-y-8">
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="absolute bottom-4 left-1/2 w-full max-w-3xl -translate-x-1/2 px-4">
        <div className="relative">
          <input
            type="text"
            placeholder="What's in your mind?..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="w-full rounded-full border bg-white py-4 pr-16 pl-6 text-zinc-800 shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-blue-600 p-3 text-white transition-colors hover:bg-blue-700"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </main>
  )
}
