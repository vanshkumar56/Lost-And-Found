import { Router } from "express";
import { supabaseAdmin } from "../supabaseAdmin";
import { requireAuth, type AuthedRequest } from "../auth";
import { randomUUID } from "node:crypto";

export const itemsRouter = Router();

// Public: sabhi items list karein (browse ke liye, login zaroori nahi)
itemsRouter.get("/", async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from("items")
    .select("id, title, type, description, category, location, image_urls, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: "Could not load items." });
    return;
  }

  res.json({ items: data ?? [] });
});

// Protected: naya lost item report karein
itemsRouter.post("/", requireAuth, async (req, res) => {
  const userId = (req as AuthedRequest).userId;
  const { item, verificationQuestions } = req.body ?? {};

  if (!item || !Array.isArray(verificationQuestions)) {
    res.status(400).json({ error: "Item details and verification questions are required." });
    return;
  }

  if (verificationQuestions.length < 5 || verificationQuestions.length > 15) {
    res.status(400).json({ error: "Add between 5 and 15 ownership verification questions." });
    return;
  }

  const { data, error } = await supabaseAdmin.rpc("create_lost_found_report", {
    p_user_id: userId,
    p_item: item,
    p_verification_questions: verificationQuestions,
  });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json({ id: data });
});

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function parseDataUrl(dataUrl: string): { mimeType: string; buffer: Buffer } {
  const match = /^data:(image\/(?:jpeg|png|webp|gif));base64,(.+)$/.exec(dataUrl);
  if (!match) {
    throw new Error("Please select a valid image (JPG, PNG, WEBP or GIF).");
  }

  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new Error("Each image must be 5 MB or smaller.");
  }

  return { mimeType: match[1], buffer };
}

// Protected: image upload karke public URL return karein
itemsRouter.post("/image", requireAuth, async (req, res) => {
  const userId = (req as AuthedRequest).userId;
  const dataUrl = typeof req.body?.dataUrl === "string" ? req.body.dataUrl : "";

  let parsed: { mimeType: string; buffer: Buffer };
  try {
    parsed = parseDataUrl(dataUrl);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
    return;
  }

  const extension = parsed.mimeType.split("/")[1].replace("jpeg", "jpg");
  const path = `${userId}/${randomUUID()}.${extension}`;

  const { error } = await supabaseAdmin.storage
    .from("item-images")
    .upload(path, parsed.buffer, {
      contentType: parsed.mimeType,
      upsert: false,
    });

  if (error) {
    res.status(500).json({ error: "Could not upload image." });
    return;
  }

  const { data } = supabaseAdmin.storage.from("item-images").getPublicUrl(path);

  res.status(201).json({ path, publicUrl: data.publicUrl });
});