'use client'
import { useState } from 'react'
import { Plus, Search, Settings } from 'lucide-react'
import ConversationItem from '../molecules/ConversationItem'

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

  // Hàm thêm chat mới
  const handleNewChat = () => {
    setConversations((prev) => [`New chat ${prev.length + 1}`, ...prev])
  }

  return (
    <aside className="my-3 ml-3 hidden h-[calc(100vh-24px)] w-72 flex-col rounded-2xl border bg-white p-4 shadow-lg lg:flex">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-800">CHAT A.I+</h1>
      </div>
      <div className="mt-6 flex w-full items-center gap-3">
        <button
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#5561F7] py-2.5 text-white transition-colors hover:bg-[#3b47c4]"
          onClick={handleNewChat}
        >
          <Plus className="h-5 w-5" />
          <span className="font-semibold">New chat</span>
        </button>
        <button className="flex items-center justify-center rounded-full bg-black p-3">
          <Search className="h-5 w-5 text-white" />
        </button>
      </div>
      <div className="scrollbar-hide mt-6 flex-1 overflow-y-auto pr-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase">
            Your conversations
          </h2>
          <button className="text-xs font-medium text-[#636EF7] hover:text-zinc-800">
            Clear All
          </button>
        </div>
        <nav className="mt-2 grid gap-1">
          <ul>
            {conversations.map((item, index) => (
              <ConversationItem key={index} text={item} />
            ))}
          </ul>
        </nav>
        <h2 className="mt-8 text-xs font-semibold text-zinc-500 uppercase">
          Last 7 Days
        </h2>
        <nav className="mt-2 grid gap-1">
          <ul>
            {last7Days.map((item, index) => (
              <ConversationItem key={index} text={item} />
            ))}
          </ul>
        </nav>
      </div>
      <div className="mt-auto border-t pt-4">
        <a
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 transition-all hover:bg-zinc-200"
        >
          <Settings className="h-4 w-4" />
          <span className="text-sm font-medium">Settings</span>
        </a>
        <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2">
          <img
            src="https://placehold.co/32x32/E8E8E8/424242?text=AN"
            alt="Andrew Neilson"
            className="h-8 w-8 rounded-full"
          />
          <span className="text-sm font-medium text-zinc-800">
            Andrew Neilson
          </span>
        </div>
      </div>
    </aside>
  )
}
