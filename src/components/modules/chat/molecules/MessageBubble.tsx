import React from 'react'
import Image from 'next/image'
import { ThumbsUp, ThumbsDown, Clipboard, MoreHorizontal } from 'lucide-react'

// Định nghĩa kiểu dữ liệu cho một tin nhắn
export type Message = {
  sender: 'user' | 'bot'
  text: string | React.ReactNode
  avatar: string
  name: string
}

type MessageBubbleProps = {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user'

  // Component cho các nút hành động dưới tin nhắn của bot
  const MessageActions = () => (
    <div className="mt-2 flex items-center space-x-2 text-gray-400">
      <ThumbsUp
        size={14}
        className="cursor-pointer transition-colors hover:text-gray-600"
      />
      <ThumbsDown
        size={14}
        className="cursor-pointer transition-colors hover:text-gray-600"
      />
      <Clipboard
        size={14}
        className="cursor-pointer transition-colors hover:text-gray-600"
      />
      <MoreHorizontal
        size={14}
        className="cursor-pointer transition-colors hover:text-gray-600"
      />
    </div>
  )

  if (isUser) {
    return (
      <div className="mb-6 flex items-start justify-end gap-3">
        <div className="order-2 max-w-[70%]">
          <div className="rounded-2xl rounded-br-sm bg-blue-500 px-4 py-2.5 text-white shadow-sm">
            <div className="text-sm leading-relaxed">{message.text}</div>
          </div>
        </div>
        <div className="order-3 flex-shrink-0">
          <Image
            src={message.avatar}
            alt={message.name}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex-shrink-0">
        <Image
          src={message.avatar}
          alt={message.name}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full"
        />
      </div>
      <div className="max-w-[768px] flex-1">
        <div className="rounded-2xl rounded-bl-sm bg-gray-50 px-4 py-2.5 shadow-sm">
          <div className="text-sm leading-relaxed text-gray-800">
            {message.text}
          </div>
        </div>
        <MessageActions />
      </div>
    </div>
  )
}
