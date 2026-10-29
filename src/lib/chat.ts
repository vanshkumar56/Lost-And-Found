import { apiFetch } from "./api";

export const OPEN_CONVERSATION_KEY = "findback-open-conversation";

export type ChatMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export type ChatConversation = {
  conversation_id: string;
  item_id: string;
  item_title: string;
  item_image_url: string | null;
  item_location: string;
  other_user_id: string;
  other_user_name: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
};

// Token ko har function mein pass karna hota hai (Clerk getToken() se)

export async function getChatConversations(token: string): Promise<ChatConversation[]> {
  const { conversations } = await apiFetch<{ conversations: ChatConversation[] }>(
    "/api/chats",
    token,
  );
  return conversations;
}

export async function getChatMessages(conversationId: string, token: string): Promise<ChatMessage[]> {
  const { messages } = await apiFetch<{ messages: ChatMessage[] }>(
    `/api/chats/${encodeURIComponent(conversationId)}/messages`,
    token,
  );
  return messages;
}

export async function startItemConversation(itemId: string | number, token: string) {
  const { conversationId } = await apiFetch<{ conversationId: string }>(
    "/api/chats",
    token,
    { method: "POST", body: JSON.stringify({ itemId: String(itemId) }) },
  );

  if (!conversationId) {
    throw new Error("Could not start a conversation for this item.");
  }

  return conversationId;
}

export async function sendChatMessage(conversationId: string, body: string, token: string) {
  const text = body.trim();
  if (!text) throw new Error("Enter a message before sending.");
  if (text.length > 4000) {
    throw new Error("Messages must be 4,000 characters or fewer.");
  }

  await apiFetch(
    `/api/chats/${encodeURIComponent(conversationId)}/messages`,
    token,
    { method: "POST", body: JSON.stringify({ body: text }) },
  );
}

export async function markChatRead(conversationId: string, token: string) {
  await apiFetch(
    `/api/chats/${encodeURIComponent(conversationId)}/read`,
    token,
    { method: "POST" },
  );
}