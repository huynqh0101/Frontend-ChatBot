import { ApiMessage } from '@/contents/interfaces'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface Conversation {
  id: string
  title: string
}

export async function fetchConversations(
  token: string
): Promise<Conversation[]> {
  const res = await fetch(`${API_BASE_URL}/chat/conversations`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await res.json()
  if (Array.isArray(data)) {
    return data
  } else if (Array.isArray(data.data)) {
    return data.data
  } else {
    return []
  }
}

export const sendMessage = async (
  token: string,
  content: string,
  conversationId: string | null = null
) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}/chat/message`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      content,
      conversationId,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to send message')
  }

  return response.json()
}

// Lấy tin nhắn của một conversation
export const fetchMessages = async (
  token: string,
  conversationId: string
): Promise<ApiMessage[]> => {
  const response = await fetch(
    `${API_BASE_URL}/chat/conversations/${conversationId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch messages')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : data.data || []
}

// Xóa một conversation
export const deleteConversation = async (
  token: string,
  conversationId: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/chat/conversations/${conversationId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to delete conversation')
  }

  return response.json()
}

// Xóa tất cả conversations
export const deleteAllConversations = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete all conversations')
  }

  return response.json()
}
