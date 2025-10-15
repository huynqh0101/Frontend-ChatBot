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

  if (res.status === 404) {
    return []
  }

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(
      `Failed to fetch conversations: ${res.status} - ${errorText}`
    )
  }

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
    const errorText = await response.text()
    throw new Error(`Failed to send message: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data
}

export const fetchMessages = async (
  token: string,
  conversationId: string
): Promise<ApiMessage[]> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/chat/conversations/${conversationId}`,
      {
        headers,
      }
    )

    if (response.status === 404) {
      return []
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.status}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : data.data || []
  } catch (error) {
    return []
  }
}

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
