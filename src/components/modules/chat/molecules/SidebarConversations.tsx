import ConversationItem from './ConversationItem'

export default function SidebarConversations({
  conversations,
  onEdit,
  onDelete,
  onClearAll,
}: {
  conversations: string[]
  onEdit: (index: number, newName: string) => void
  onDelete: (index: number) => void
  onClearAll: () => void
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase">
          Your conversations
        </h2>
        <button
          className="text-xs font-medium text-[#636EF7] hover:text-zinc-800"
          onClick={onClearAll}
        >
          Clear All
        </button>
      </div>
      <nav className="mt-2 grid gap-1">
        <ul>
          {conversations.map((item, index) => (
            <ConversationItem
              key={index}
              text={item}
              onEdit={(newName) => onEdit(index, newName)}
              onDelete={() => onDelete(index)}
            />
          ))}
        </ul>
      </nav>
    </>
  )
}
