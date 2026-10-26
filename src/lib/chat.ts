import { supabase } from "./supabase";

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

export async function getChatConversations(): Promise<ChatConversation[]> {
  const { data, error } = await supabase.rpc("get_chat_conversations");
  if (error) throw error;
  return (data ?? []) as ChatConversation[];
}

export async function getChatMessages(conversationId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, conversation_id, sender_id, body, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as ChatMessage[];
}

export async function startItemConversation(itemId: string | number) {
  const { data, error } = await supabase.rpc("create_item_conversation", {
    p_item_id: String(itemId),
  });

  if (error) throw error;
  if (typeof data !== "string") {
    throw new Error("Could not start a conversation for this item.");
  }

  return data;
}

export async function sendChatMessage(conversationId: string, body: string) {
  const text = body.trim();
  if (!text) throw new Error("Enter a message before sending.");
  if (text.length > 4000) {
    throw new Error("Messages must be 4,000 characters or fewer.");
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error("Please log in to send messages.");

  const { error } = await supabase.from("chat_messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    body: text,
  });

  if (error) throw error;
}

export async function markChatRead(conversationId: string) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error("Please log in to read messages.");

  const { error } = await supabase
    .from("chat_participants")
    .update({ last_read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id);

  if (error) throw error;
}
