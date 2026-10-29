import { Router } from "express";
import { supabaseAdmin } from "../supabaseAdmin";
import { requireAuth, type AuthedRequest } from "../auth";

export const chatsRouter = Router();

chatsRouter.use(requireAuth);

// Meri conversations list
chatsRouter.get("/", async (req, res) => {
  const userId = (req as AuthedRequest).userId;

  const { data, error } = await supabaseAdmin.rpc("get_chat_conversations", {
    p_user_id: userId,
  });

  if (error) {
    res.status(500).json({ error: "Could not load conversations." });
    return;
  }

  res.json({ conversations: data ?? [] });
});

// Item par chat shuru karein (ya existing conversation id lein)
chatsRouter.post("/", async (req, res) => {
  const userId = (req as AuthedRequest).userId;
  const { itemId } = req.body ?? {};

  if (!itemId) {
    res.status(400).json({ error: "itemId is required." });
    return;
  }

  const { data, error } = await supabaseAdmin.rpc("create_item_conversation", {
    p_user_id: userId,
    p_item_id: itemId,
  });

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.status(201).json({ conversationId: data });
});

// Conversation ke messages
chatsRouter.get("/:id/messages", async (req, res) => {
  const userId = (req as AuthedRequest).userId;
  const conversationId = req.params.id;

  const { data: isMember, error: memberError } = await supabaseAdmin.rpc(
    "is_chat_participant",
    { p_conversation_id: conversationId, p_user_id: userId },
  );

  if (memberError || !isMember) {
    res.status(403).json({ error: "You are not part of this conversation." });
    return;
  }

  const { data, error } = await supabaseAdmin
    .from("chat_messages")
    .select("id, conversation_id, sender_id, body, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    res.status(500).json({ error: "Could not load messages." });
    return;
  }

  res.json({ messages: data ?? [] });
});

// Message bhejein
chatsRouter.post("/:id/messages", async (req, res) => {
  const userId = (req as AuthedRequest).userId;
  const conversationId = req.params.id;
  const text = typeof req.body?.body === "string" ? req.body.body.trim() : "";

  if (!text || text.length > 4000) {
    res.status(400).json({ error: "Message must be 1 to 4000 characters." });
    return;
  }

  const { data: isMember } = await supabaseAdmin.rpc("is_chat_participant", {
    p_conversation_id: conversationId,
    p_user_id: userId,
  });

  if (!isMember) {
    res.status(403).json({ error: "You are not part of this conversation." });
    return;
  }

  const { error } = await supabaseAdmin.from("chat_messages").insert({
    conversation_id: conversationId,
    sender_id: userId,
    body: text,
  });

  if (error) {
    res.status(500).json({ error: "Could not send message." });
    return;
  }

  res.status(201).json({ ok: true });
});

// Message padh liya (read status)
chatsRouter.post("/:id/read", async (req, res) => {
  const userId = (req as AuthedRequest).userId;

  const { error } = await supabaseAdmin
    .from("chat_participants")
    .update({ last_read_at: new Date().toISOString() })
    .eq("conversation_id", req.params.id)
    .eq("user_id", userId);

  if (error) {
    res.status(500).json({ error: "Could not mark as read." });
    return;
  }

  res.json({ ok: true });
});