import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import ConversationItem from '@/components/modules/chat/molecules/ConversationItem'
import { Conversation } from '@/contents/interfaces'
import {
  deleteConversation,
  deleteAllConversations,
  updateConversationTitle,
} from '@/services/chatService'
import { ConfirmDialog } from '@/components/base/dialog/ConfirmDialog'

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
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    conversationId: string | null
  }>({ isOpen: false, conversationId: null })

  const [clearAllDialog, setClearAllDialog] = useState(false)

  const handleEdit = async (conversationId: string, newName: string) => {
    try {
      await updateConversationTitle(conversationId, newName)
      onEdit(conversationId, newName)
      onRefresh()
    } catch (error) {
      console.error('Error updating conversation title:', error)
    }
  }

  const handleDelete = async (conversationId: string) => {
    setDeleteDialog({ isOpen: true, conversationId })
  }

  const confirmDelete = async () => {
    if (!deleteDialog.conversationId) return

    try {
      await deleteConversation(deleteDialog.conversationId)
      onDelete(deleteDialog.conversationId)
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  const handleClearAll = () => {
    setClearAllDialog(true)
  }

  const confirmClearAll = async () => {
    try {
      await deleteAllConversations()
      onClearAll()
    } catch (error) {
      console.error('Error clearing all conversations:', error)
    }
  }

  if (conversations.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        No conversations yet
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {/* Header with Clear All button */}
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-gray-700 uppercase dark:text-zinc-400">
            RECENT CONVERSATIONS
          </h3>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 text-xs text-red-500 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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

      {/* Delete Single Conversation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, conversationId: null })}
        onConfirm={confirmDelete}
        title="Delete Conversation"
        description="Are you sure you want to delete this conversation? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Clear All Conversations Dialog */}
      <ConfirmDialog
        isOpen={clearAllDialog}
        onClose={() => setClearAllDialog(false)}
        onConfirm={confirmClearAll}
        title="Clear All Conversations"
        description="Are you sure you want to delete all conversations? This action cannot be undone and will permanently remove all your chat history."
        confirmText="Clear All"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  )
}
