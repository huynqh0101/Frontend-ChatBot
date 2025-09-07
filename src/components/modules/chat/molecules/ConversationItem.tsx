import { MessageSquare, Trash2, Pencil } from 'lucide-react'

export default function ConversationItem({ text }: { text: string }) {
  return (
    // Thêm `relative` vào đây để làm mốc cho các icon
    <li className="group relative">
      <a
        href="#"
        style={{ maxWidth: 260 }}
        className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-zinc-600 transition-colors duration-200 group-hover:bg-indigo-50 group-hover:text-indigo-700"
      >
        {/* Khối chứa icon và text */}
        <div className="flex min-w-0 items-center gap-3">
          <MessageSquare className="h-4 w-4 flex-shrink-0" />
          <span className="truncate text-sm font-medium">{text}</span>
        </div>

        <div className="relative z-10 flex flex-shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            className="rounded p-1 text-zinc-500 hover:text-zinc-900"
            onClick={(e) => {
              e.preventDefault()
              console.log('Edit clicked')
            }}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            className="rounded p-1 text-zinc-500 hover:text-red-600"
            onClick={(e) => {
              e.preventDefault()
              console.log('Delete clicked')
            }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </a>
    </li>
  )
}
