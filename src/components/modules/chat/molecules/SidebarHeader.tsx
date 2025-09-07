import { Plus, Search } from 'lucide-react'

export default function SidebarHeader({
  onNewChat,
}: {
  onNewChat: () => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-800">CHAT A.I+</h1>
      </div>
      <div className="mt-6 flex w-full items-center gap-3">
        <button
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#5561F7] py-2.5 text-white transition-colors hover:bg-[#3b47c4]"
          onClick={onNewChat}
        >
          <Plus className="h-5 w-5" />
          <span className="font-semibold">New chat</span>
        </button>
        <button className="flex items-center justify-center rounded-full bg-black p-3">
          <Search className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  )
}
