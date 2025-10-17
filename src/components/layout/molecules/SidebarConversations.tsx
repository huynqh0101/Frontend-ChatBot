import { Trash2 } from 'lucide-react'
import ConversationItem from '@/components/modules/chat/molecules/ConversationItem'
import { Conversation } from '@/contents/interfaces'
import {
  deleteConversation,
  deleteAllConversations,
  updateConversationTitle,
} from '@/services/chatService'

interface SidebarConversationsProps {
  conversations: Conversation[]
  selectedConversationId: string | null
  onEdit: (conversationId: string, newName: string) => void
  onDelete: (conversationId: string) => void
  onClearAll: () => void
  onSelect: (conversationId: string) => void
  onRefresh: () => void
}

export default function SidebarConversations({
  conversations,
  selectedConversationId,
  onEdit,
  onDelete,
  onClearAll,
  onSelect,
  onRefresh,
}: SidebarConversationsProps) {
  const handleEdit = async (conversationId: string, newName: string) => {
    try {
      // Gọi API để update title (apiClient sẽ tự động handle auth)
      await updateConversationTitle(conversationId, newName)

      // Gọi callback để update UI
      onEdit(conversationId, newName)

      // Refresh danh sách conversations
      onRefresh()
    } catch (error) {
      console.error('Error updating conversation title:', error)
      // Có thể thêm toast notification ở đây
    }
  }

  const handleDelete = async (conversationId: string) => {
    try {
      // Gọi API để delete conversation (apiClient sẽ tự động handle auth)
      await deleteConversation(conversationId)

      // Gọi callback để update UI
      onDelete(conversationId)

      // Refresh danh sách conversations
      onRefresh()
    } catch (error) {
      console.error('Error deleting conversation:', error)
      // Có thể thêm toast notification ở đây
    }
  }

  const handleClearAll = async () => {
    try {
      // Confirm trước khi xóa tất cả
      const confirmed = window.confirm(
        'Are you sure you want to delete all conversations? This action cannot be undone.'
      )
      if (!confirmed) return

      // Gọi API để delete tất cả conversations (apiClient sẽ tự động handle auth)
      await deleteAllConversations()

      // Gọi callback để update UI
      onClearAll()

      // Refresh danh sách conversations
      onRefresh()
    } catch (error) {
      console.error('Error clearing all conversations:', error)
      // Có thể thêm toast notification ở đây
    }
  }

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
          Recent Conversations ({conversations.length})
        </h3>
        <button
          onClick={handleClearAll}
          className="flex items-center gap-1 text-xs text-red-500 transition-colors hover:text-red-700"
        >
          <Trash2 className="h-3 w-3" />
          Clear All
        </button>
      </div>

      {/* Conversations List */}
      <ul className="space-y-1">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            text={conversation.title}
            conversationId={conversation.id}
            isSelected={selectedConversationId === conversation.id}
            onClick={() => onSelect(conversation.id)}
            onEdit={(newName) => handleEdit(conversation.id, newName)}
            onDelete={() => handleDelete(conversation.id)}
          />
        ))}
      </ul>
    </div>
  )
}
