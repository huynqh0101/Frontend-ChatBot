'use client'
import { useState } from 'react'
import SidebarHeader from '../molecules/SidebarHeader'
import SidebarConversations from '../molecules/SidebarConversations'
import SidebarFooter from '../molecules/SidebarFooter'
import SidebarLast7Days from '../molecules/SidebarLast7Days'

export function Sidebar() {
  const [conversations, setConversations] = useState([
    'Create Html Game Environment...',
    'Apply To Leave For Emergency',
    'What Is UI UX Design?',
    'Create POS System',
    'What Is UX Audit?',
    'Create Chatbot GPT...',
    'How Chat GPT Work?',
  ])

  const last7Days = [
    'Crypto Lending App Name',
    'Operator Grammer Types',
    'Min States For Binary DFA',
  ]

  const handleNewChat = () => {
    setConversations((prev) => [`New chat ${prev.length + 1}`, ...prev])
  }

  const handleEditConversation = (index: number, newName: string) => {
    setConversations((prev) =>
      prev.map((item, i) => (i === index ? newName : item))
    )
  }

  const handleDeleteConversation = (index: number) => {
    setConversations((prev) => prev.filter((_, i) => i !== index))
  }

  const handleClearAll = () => {
    setConversations([])
  }

  return (
    <aside className="my-3 ml-3 hidden h-[calc(100vh-24px)] w-72 flex-col rounded-2xl border bg-white p-4 shadow-lg lg:flex">
      <SidebarHeader onNewChat={handleNewChat} />
      <div className="scrollbar-hide mt-6 flex-1 overflow-y-auto pr-2">
        <SidebarConversations
          conversations={conversations}
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
