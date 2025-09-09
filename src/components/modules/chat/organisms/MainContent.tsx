import { Compass, Zap, TriangleAlert, Send } from 'lucide-react'
import InfoCard from '../molecules/InfoCard'
import PromptCard from '../molecules/PromptCard'

interface MainContentProps {
  onStartNewChat: () => void
}

export function MainContent({ onStartNewChat }: MainContentProps) {
  const handleSendMessage = () => {
    // Khi user gửi tin nhắn đầu tiên, bắt đầu cuộc trò chuyện mới
    onStartNewChat()
  }

  return (
    <main className="relative flex h-screen flex-col bg-gray-100">
      {/* Main container chứa cả content và input */}
      <div className="flex flex-1 flex-col justify-between p-6 md:p-10">
        {/* Content area */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-zinc-800">CHAT A.I+</h1>
            <p className="mt-2 text-4xl font-semibold text-zinc-700">
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

        {/* Input bar - cùng container */}
        <div className="mx-auto mt-8 w-full max-w-3xl">
          <div className="relative">
            <input
              type="text"
              placeholder="What's in your mind?..."
              className="w-full rounded-full border bg-white py-4 pr-16 pl-6 text-zinc-800 shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-blue-600 p-3 text-white transition-colors hover:bg-blue-700"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
