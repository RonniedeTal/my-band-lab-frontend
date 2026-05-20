export interface MessageResponse {
  id: number;
  senderId: number;
  senderName: string;
  senderEmail: string;
  senderImageUrl?: string;
  receiverId: number;
  receiverName: string;
  receiverEmail: string;
  receiverImageUrl?: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface MessageRequest {
  receiverId: number;
  content: string;
}

export interface ConversationResponse {
  partnerId: number;
  partnerName: string;
  partnerEmail: string;
  partnerImageUrl?: string;
  lastMessageId?: number;
  lastMessageContent?: string;
  lastMessageTime?: string;
  unreadCount: number;
  totalMessages: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SendMessageResult {
  success: boolean;
  message?: string;
  data?: MessageResponse;
  error?: string;
}

export interface WebSocketMessage {
  type: 'MESSAGE' | 'READ' | 'CONVERSATION' | 'UNREAD_COUNT';
  payload: MessageResponse | ConversationResponse | Record<string, unknown>;
}