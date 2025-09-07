import React from 'react'
import { ThumbsUp, ThumbsDown, Clipboard, Info, RefreshCw } from 'lucide-react'

const ChatBubble = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg bg-white/10 p-4">{children}</div>
)

export function InfoPanel() {
  return (
    <div className="hidden w-1/2 flex-col justify-between rounded-l-2xl bg-gradient-to-br from-[#F9A8D4] via-[#7E5BEF] to-[#2C5282] p-10 text-white lg:flex">
      <div>
        <h1 className="text-2xl font-bold">CHAT A.I+</h1>
        <h2 className="mt-8 text-5xl leading-tight font-bold">
          Learn, Discover & <br />
          Automate in One Place.
        </h2>
      </div>

      <div className="space-y-4">
        <ChatBubble>
          <p className="font-semibold">
            Create a chatbot gpt using python language what will be step for
            that
          </p>
        </ChatBubble>
        <div className="rounded-lg bg-white/20 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <p className="font-semibold">CHAT A.I+ @</p>
            <div className="flex items-center space-x-2 text-gray-300">
              <ThumbsUp size={16} />
              <ThumbsDown size={16} />
              <Clipboard size={16} />
              <Info size={16} />
            </div>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <p>
              Sure, I can help you get started with creating a chatbot using GPT
              in Python. Here are the basic steps you&apos;ll need to follow:
            </p>
            <p>
              1. Install the required libraries: You&apos;ll need to install the
              transformers library from Hugging Face to use GPT. You can install
              it using pip.
            </p>
            <p>
              2. Load the pre-trained model: GPT comes in several sizes and
              versions, so you&apos;ll need to choose the one that fits your
              needs. You can load a pre-trained GPT model.
            </p>
            <p>
              These are just the basic steps to get started with a GPT chatbot
              in Python. Depending on your requirements, you may need to add
              more features or complexity to the chatbot. Good luck!
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          value="Reply..."
          readOnly
          className="w-full rounded-lg border border-white/30 bg-white/10 py-3 pr-12 pl-4 text-white placeholder:text-gray-300"
        />
        <button className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md bg-white/20 p-2">
          <RefreshCw size={16} className="text-white" />
        </button>
      </div>
    </div>
  )
}
