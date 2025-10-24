import { Compass, Zap, TriangleAlert, Send } from 'lucide-react'
import { useState } from 'react'
import InfoCard from '../molecules/InfoCard'
import PromptCard from '../molecules/PromptCard'

import { MainHeader } from '../molecules/MainHeader'

interface MainContentProps {
  onStartNewChat: (firstMessage: string) => void
  isLoggedIn?: boolean
}

export function MainContent({
  onStartNewChat,
  isLoggedIn = false,
}: MainContentProps) {
  const [inputValue, setInputValue] = useState('')

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onStartNewChat(inputValue.trim())
      setInputValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <main className="relative flex h-screen flex-col bg-gray-100 dark:bg-gray-900">
      {!isLoggedIn && <MainHeader />}

      {/* Main container chứa cả content và input */}
      <div className="flex flex-1 flex-col justify-between p-6 md:p-10">
        {/* Content area */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
              CHAT A.I+
            </h1>
            <p className="mt-2 text-4xl font-semibold text-zinc-700 dark:text-zinc-300">
              Good day! How may I assist you today?
            </p>
          </div>
          <div className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
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
            <PromptCard
              image="https://placehold.co/32x32/F9D4D4/424242?text=Q"
              title="Explain"
              description="quantum computing in simple terms"
              onClick={() =>
                onStartNewChat('Explain quantum computing in simple terms')
              }
            />
            <PromptCard
              image="https://placehold.co/32x32/D4F0F9/424242?text=S"
              title="How to"
              description="Make a search engine platform like google"
              onClick={() =>
                onStartNewChat(
                  'How to make a search engine platform like google'
                )
              }
            />
            <PromptCard
              image="https://placehold.co/32x32/D4E4F9/424242?text=U"
              title="Allows"
              description="User to provide follow-up corrections"
              onClick={() =>
                onStartNewChat(
                  'How to allow user to provide follow-up corrections'
                )
              }
            />
            <PromptCard
              image="https://placehold.co/32x32/F9E6D4/424242?text=R"
              title="Remember"
              description="quantum computing in simple terms"
              onClick={() =>
                onStartNewChat('Remember quantum computing in simple terms')
              }
            />
            <PromptCard
              image="https://placehold.co/32x32/D4F9D8/424242?text=K"
              title="Limited"
              description="Knowledge of world and events after 2021"
              onClick={() =>
                onStartNewChat(
                  'Tell me about limited knowledge of world and events after 2021'
                )
              }
            />
            <PromptCard
              image="https://placehold.co/32x32/F9D4F5/424242?text=O"
              title="May"
              description="Occasionally generate incorrect information"
              onClick={() =>
                onStartNewChat(
                  'Why may AI occasionally generate incorrect information'
                )
              }
            />
          </div>
        </div>

        {/* Input bar - cùng container */}
        <div className="mx-auto mt-8 w-full max-w-3xl bg-gray-100 dark:bg-gray-900">
          <div className="relative">
            <input
              type="text"
              placeholder="What's in your mind?..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded-full border border-gray-300 bg-white py-4 pr-16 pl-6 text-zinc-800 shadow-lg focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-zinc-100 dark:placeholder:text-gray-400"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-blue-600 p-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-gray-600"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
