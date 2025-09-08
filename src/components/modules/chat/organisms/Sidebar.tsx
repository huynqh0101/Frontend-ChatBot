'use client'
import { useEffect, useState } from 'react'
import SidebarHeader from '../molecules/SidebarHeader'
import SidebarConversations from '../molecules/SidebarConversations'
import SidebarFooter from '../molecules/SidebarFooter'
import SidebarLast7Days from '../molecules/SidebarLast7Days'
import { fetchConversations, Conversation } from '@/services/chatService'

export function Sidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    fetchConversations(token)
      .then(setConversations)
      .catch(() => setConversations([]))
  }, [])

  const handleNewChat = () => {
    setConversations((prev) => [
      { id: Date.now().toString(), title: `New chat ${prev.length + 1}` },
      ...prev,
    ])
  }

  const handleEditConversation = (index: number, newName: string) => {
    setConversations((prev) =>
      prev.map((item, i) => (i === index ? { ...item, title: newName } : item))
    )
  }

  const handleDeleteConversation = (index: number) => {
    setConversations((prev) => prev.filter((_, i) => i !== index))
  }

  const handleClearAll = () => {
    setConversations([])
  }

  const last7Days = [
    'Crypto Lending App Name',
    'Operator Grammer Types',
    'Min States For Binary DFA',
    'React State Management',
    'Next.js SSR vs SSG',
    'Deploy Node App to Vercel',
    'JWT Authentication Flow',
    'Responsive Navbar Example',
    'Redux vs Context API',
    'Best UI Libraries 2025',
    'How to use SWR',
  ]

  return (
    <aside className="my-3 ml-3 hidden h-[calc(100vh-24px)] w-72 flex-col rounded-2xl border bg-white p-4 shadow-lg lg:flex">
      <SidebarHeader onNewChat={handleNewChat} />
      <div className="scrollbar-hide mt-6 flex-1 overflow-y-auto pr-2">
        <SidebarConversations
          conversations={conversations.map((c) => c.title)}
          onEdit={handleEditConversation}
          onDelete={handleDeleteConversation}
          onClearAll={handleClearAll}
        />
        <SidebarLast7Days items={last7Days} />
      </div>
      <SidebarFooter />
    </aside>
  )
}
