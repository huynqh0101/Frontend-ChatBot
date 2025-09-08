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
