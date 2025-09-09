'use client'
import { useState, useEffect } from 'react'
import { Sidebar } from '../organisms/Sidebar'
import { MainContent } from '../organisms/MainContent'
import { MainContent2 } from '../organisms/MainContent2'

export function ChatTemplate() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    // Kiểm tra token trong localStorage
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chỉ hiển thị Sidebar khi đã đăng nhập */}
      {isLoggedIn && (
        <Sidebar
          onSelectConversation={setSelectedConversationId}
          selectedConversationId={selectedConversationId}
        />
      )}

      {/* MainContent sẽ chiếm toàn bộ width khi không có Sidebar */}
      <div className={isLoggedIn ? 'flex-1' : 'w-full'}>
        {selectedConversationId ? (
          <MainContent2 conversationId={selectedConversationId} />
        ) : (
          <MainContent
            onStartNewChat={() => setSelectedConversationId('new')}
          />
        )}
      </div>
    </div>
  )
}
