import { Settings } from 'lucide-react'

export default function SidebarFooter() {
  return (
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
  )
}