import {
  ApiMessage,
  Conversation,
  SendMessageResponse,
  ApiError,
  MessageResponse,
  ApiResponse,
} from '@/contents/interfaces'
import { apiClient } from './apiClient'

export async function fetchConversations(): Promise<Conversation[]> {
  try {
    const data = await apiClient.get<
      Conversation[] | ApiResponse<Conversation[]>
    >('/chat/conversations')

    if (Array.isArray(data)) {
      return data
    } else if (
      data &&
      Array.isArray((data as ApiResponse<Conversation[]>).data)
    ) {
      return (data as ApiResponse<Conversation[]>).data
    }

    return []
  } catch (error) {
    const apiError = error as ApiError
    // Nếu 404, trả về array rỗng
    if (apiError.status === 404) {
      return []
    }
    console.error('Error fetching conversations:', error)
    throw error
  }
}

export async function sendAnonymousMessage(
  content: string
): Promise<SendMessageResponse> {
  return apiClient.post<SendMessageResponse>('/chat/anonymous', {
    content,
  })
}

export async function sendMessage(
  content: string,
  conversationId: string | null = null
): Promise<SendMessageResponse> {
  return apiClient.post<SendMessageResponse>('/chat/message', {
    content,
    conversationId,
  })
}

export async function fetchMessages(
  conversationId: string
): Promise<ApiMessage[]> {
  try {
    const data = await apiClient.get<ApiMessage[] | ApiResponse<ApiMessage[]>>(
      `/chat/conversations/${conversationId}`
    )

    if (Array.isArray(data)) {
      return data
    } else if (
      data &&
      Array.isArray((data as ApiResponse<ApiMessage[]>).data)
    ) {
      return (data as ApiResponse<ApiMessage[]>).data
    }

    return []
  } catch (error) {
    const apiError = error as ApiError
    // Nếu 404, trả về array rỗng
    if (apiError.status === 404) {
      return []
    }
    console.error('Error fetching messages:', error)
    throw error
  }
}

export async function deleteConversation(
  conversationId: string
): Promise<MessageResponse> {
  return apiClient.delete<MessageResponse>(
    `/chat/conversations/${conversationId}`
  )
}

export async function deleteAllConversations(): Promise<MessageResponse> {
  return apiClient.delete<MessageResponse>('/chat/conversations')
}

export async function updateConversationTitle(
  conversationId: string,
  title: string
): Promise<Conversation> {
  return apiClient.put<Conversation>(`/chat/conversations/${conversationId}`, {
    title,
  })
}
