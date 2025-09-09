import { Trash2 } from 'lucide-react'
import ConversationItem from './ConversationItem'
import { Conversation } from '@/services/chatService'

interface SidebarConversationsProps {
  conversations: Conversation[]
  selectedConversationId: string | null
  onEdit: (index: number, newName: string) => void
  onDelete: (index: number) => void
  onClearAll: () => void
  onSelect: (index: number) => void
}

export default function SidebarConversations({
  conversations,
  selectedConversationId,
  onEdit,
  onDelete,
  onClearAll,
  onSelect,
}: SidebarConversationsProps) {
  if (conversations.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        No conversations yet
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Header with Clear All button */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          Recent Conversations
        </h3>
        <button
          onClick={onClearAll}
          className="flex items-center gap-1 text-xs text-red-500 transition-colors hover:text-red-700"
        >
          <Trash2 className="h-3 w-3" />
          Clear All
        </button>
      </div>

      {/* Conversations List */}
      <ul className="space-y-1">
        {conversations.map((conversation, index) => (
          <ConversationItem
            key={conversation.id}
            text={conversation.title}
            conversationId={conversation.id}
            isSelected={selectedConversationId === conversation.id}
            onClick={() => onSelect(index)}
            onEdit={(newName) => onEdit(index, newName)}
            onDelete={() => onDelete(index)}
          />
        ))}
      </ul>
    </div>
  )
}
