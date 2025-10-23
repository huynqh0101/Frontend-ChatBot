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
    <div className="mt-2 flex items-center space-x-2 text-gray-400 dark:text-gray-500">
      <ThumbsUp
        size={14}
        className="cursor-pointer transition-colors hover:text-gray-600 dark:hover:text-gray-300"
      />
      <ThumbsDown
        size={14}
        className="cursor-pointer transition-colors hover:text-gray-600 dark:hover:text-gray-300"
      />
      <Clipboard
        size={14}
        className="cursor-pointer transition-colors hover:text-gray-600 dark:hover:text-gray-300"
      />
      <MoreHorizontal
        size={14}
        className="cursor-pointer transition-colors hover:text-gray-600 dark:hover:text-gray-300"
      />
    </div>
  )

  if (isUser) {
    return (
      <div className="mb-6 flex items-start justify-end gap-x-2 gap-y-3">
        <div className="order-2 mt-3 max-w-[70%]">
          <div className="rounded-2xl rounded-tr-sm bg-blue-500 px-4 py-2.5 text-white shadow-sm dark:bg-blue-600">
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
            unoptimized
          />
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6 flex items-start gap-x-2 gap-y-3">
      <div className="flex-shrink-0">
        <Image
          src={message.avatar}
          alt={message.name}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full"
          unoptimized
        />
      </div>
      <div className="mt-3 max-w-[768px] flex-1">
        <div className="rounded-2xl rounded-tl-sm bg-gray-50 px-4 py-2.5 shadow-sm dark:bg-gray-800">
          <div className="text-sm leading-relaxed text-gray-800 dark:text-gray-100">
            {message.text}
          </div>
        </div>
        <MessageActions />
      </div>
    </div>
  )
}
