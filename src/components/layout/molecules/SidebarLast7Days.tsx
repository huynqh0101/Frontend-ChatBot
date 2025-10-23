import ConversationItem from '@/components/modules/chat/molecules/ConversationItem'

export default function SidebarLast7Days({ items }: { items: string[] }) {
  return (
    <>
      <h2 className="mt-8 text-xs font-semibold text-zinc-500 uppercase dark:text-zinc-400">
        Last 7 Days
      </h2>
      <nav className="mt-2 grid gap-1">
        <ul>
          {items.map((item, index) => (
            <ConversationItem key={index} text={item} conversationId={item} />
          ))}
        </ul>
      </nav>
    </>
  )
}
