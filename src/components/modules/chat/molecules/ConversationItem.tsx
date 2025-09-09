import { Trash2, Pencil, Check } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface ConversationItemProps {
  text: string
  conversationId: string
  isSelected?: boolean
  onClick?: (id: string) => void
  onEdit?: (newName: string) => void
  onDelete?: () => void
}

export default function ConversationItem({
  text,
  conversationId,
  isSelected,
  onClick,
  onEdit,
  onDelete,
}: ConversationItemProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
    }
  }, [editing])

  const handleEdit = () => {
    setEditing(true)
  }

  const handleSave = () => {
    setEditing(false)
    if (value !== text && onEdit) {
      onEdit(value)
    }
  }

  return (
    <li className="group relative">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          onClick?.(conversationId)
        }}
        className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 transition-colors duration-200 ${
          isSelected
            ? 'bg-indigo-100 text-indigo-800'
            : 'text-zinc-600 hover:bg-indigo-50 hover:text-indigo-700'
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src="/asset/icon/message.svg"
            alt="Message"
            width={16}
            height={16}
            className="flex-shrink-0"
          />
          {editing ? (
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
                if (e.key === 'Escape') {
                  setEditing(false)
                  setValue(text)
                }
              }}
              className="truncate px-1 py-0.5 text-sm font-medium outline-none focus:outline-none"
              style={{ maxWidth: 160 }}
            />
          ) : (
            <span className="truncate text-sm font-medium">{text}</span>
          )}
        </div>
        <div className="relative z-10 flex flex-shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {editing ? (
            <button
              className="rounded p-1 text-zinc-500 hover:text-green-600"
              onMouseDown={(e) => {
                e.preventDefault()
                handleSave()
              }}
            >
              <Check className="h-4 w-4" />
            </button>
          ) : (
            <button
              className="rounded p-1 text-zinc-500 hover:text-zinc-900"
              onClick={(e) => {
                e.preventDefault()
                handleEdit()
              }}
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          <button
            className="rounded p-1 text-zinc-500 hover:text-red-600"
            onClick={(e) => {
              e.preventDefault()
              onDelete?.()
            }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </a>
    </li>
  )
}
