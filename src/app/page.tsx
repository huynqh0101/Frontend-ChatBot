import React from 'react'
import {
  Plus,
  MessageSquare,
  Search,
  Settings,
  Compass,
  Zap,
  TriangleAlert,
  ArrowRight,
  Send,
} from 'lucide-react'

//==================================================================
// COMPONENT CHO THANH BÊN TRÁI (SIDEBAR)
//==================================================================
const Sidebar = () => {
  const ConversationItem = ({ text }: { text: string }) => (
    <li>
      <a
        href="#"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 transition-all hover:bg-zinc-200"
      >
        <MessageSquare className="h-4 w-4" />
        <span className="truncate text-sm font-medium">{text}</span>
      </a>
    </li>
  )

  const conversations = [
    'Create Html Game Environment...',
    'Apply To Leave For Emergency',
    'What Is UI UX Design?',
    'Create POS System',
    'What Is UX Audit?',
    'Create Chatbot GPT...',
    'How Chat GPT Work?',
  ]

  const last7Days = [
    'Crypto Lending App Name',
    'Operator Grammer Types',
    'Min States For Binary DFA',
  ]

  return (
    <aside className="my-3 ml-3 hidden h-[calc(100vh-24px)] w-72 flex-col rounded-2xl border bg-white p-4 shadow-lg lg:flex">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-800">CHAT A.I+</h1>
        {/* Xóa icon search ở đây */}
      </div>

      {/* Nút New chat + Search như ảnh */}
      <div className="mt-6 flex w-full items-center gap-3">
        <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#5561F7] py-2.5 text-white transition-colors hover:bg-[#3b47c4]">
          <Plus className="h-5 w-5" />
          <span className="font-semibold">New chat</span>
        </button>
        <button className="flex items-center justify-center rounded-full bg-black p-2">
          <Search className="h-5 w-5 text-white" />
        </button>
      </div>

      <div className="mt-6 flex-1 overflow-y-auto pr-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase">
            Your conversations
          </h2>
          <button className="text-xs font-medium text-zinc-500 hover:text-zinc-800">
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
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

//==================================================================
// COMPONENT CHO NỘI DUNG CHÍNH (MAIN CONTENT)
//==================================================================
const MainContent = () => {
  const InfoCard = ({
    icon,
    title,
    description,
  }: {
    icon: React.ReactNode
    title: string
    description: string
  }) => (
    <div className="flex cursor-pointer items-center gap-4 rounded-xl bg-zinc-800 p-4 transition-transform hover:scale-105">
      <div className="rounded-full bg-zinc-700 p-2">{icon}</div>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-zinc-400">{description}</p>
      </div>
    </div>
  )

  const PromptCard = ({
    image,
    title,
    description,
  }: {
    image: string
    title: string
    description: string
  }) => (
    <div className="relative cursor-pointer rounded-xl border bg-white p-4 transition-shadow hover:shadow-lg">
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={title} className="h-8 w-8 rounded-full" />
        <div>
          <h3 className="font-semibold text-zinc-800">&quot;{title}&quot;</h3>
          <p className="text-sm text-zinc-500">{description}</p>
        </div>
      </div>

      <ArrowRight className="absolute right-4 bottom-4 h-5 w-5 text-zinc-400" />
    </div>
  )

  return (
    <main className="relative flex-1 bg-gray-100 p-6 md:p-10">
      <div className="flex h-full flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-800">CHAT A.I+</h1>
          <p className="mt-2 text-4xl font-semibold text-zinc-700">
            Good day! How may I assist you today?
          </p>
        </div>

        <div className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
          {/* Info Cards */}
          <InfoCard
            icon={<Compass className="h-6 w-6 text-white" />}
            title="Explore"
            description="Learn how to use chat functions for your needs"
          />
          <InfoCard
            icon={<Zap className="h-6 w-6 text-white" />}
            title="Capabilities"
            description="How much capable chat is to full-fill your needs"
          />
          <InfoCard
            icon={<TriangleAlert className="h-6 w-6 text-white" />}
            title="Limitation"
            description="How much capable chat is to full-fill your needs"
          />

          {/* Prompt Cards */}
          <PromptCard
            image="https://placehold.co/32x32/F9D4D4/424242?text=Q"
            title="Explain"
            description="quantum computing in simple terms"
          />
          <PromptCard
            image="https://placehold.co/32x32/D4F0F9/424242?text=S"
            title="How to"
            description="Make a search engine platform like google"
          />
          <PromptCard
            image="https://placehold.co/32x32/D4E4F9/424242?text=U"
            title="Allows"
            description="User to provide follow-up corrections"
          />
          <PromptCard
            image="https://placehold.co/32x32/F9E6D4/424242?text=R"
            title="Remember"
            description="quantum computing in simple terms"
          />
          <PromptCard
            image="https://placehold.co/32x32/D4F9D8/424242?text=K"
            title="Limited"
            description="Knowledge of world and events after 2021"
          />
          <PromptCard
            image="https://placehold.co/32x32/F9D4F5/424242?text=O"
            title="May"
            description="Occasionally generate incorrect information"
          />
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="absolute bottom-10 left-1/2 w-full max-w-3xl -translate-x-1/2 px-4">
        <div className="relative">
          <input
            type="text"
            placeholder="What's in your mind?..."
            className="w-full rounded-full border bg-white py-4 pr-16 pl-6 text-zinc-800 shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-blue-600 p-3 text-white transition-colors hover:bg-blue-700">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Upgrade to Pro Banner */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 -rotate-90 transform">
        <button className="rounded-t-lg bg-blue-600 px-6 py-2 font-semibold text-white">
          Upgrade to Pro
        </button>
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <div className="flex h-screen bg-[#F3F6FB] font-sans">
      <Sidebar />
      <MainContent />
    </div>
  )
}
