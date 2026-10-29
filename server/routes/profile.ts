import { Router } from "express";
import { supabaseAdmin } from "../supabaseAdmin";
import { requireAuth, type AuthedRequest } from "../auth";

export const profileRouter = Router();

profileRouter.use(requireAuth);

// Login ke baad profile row banane/update karne ke liye
profileRouter.post("/sync", async (req, res) => {
  const userId = (req as AuthedRequest).userId;
  const fullName = typeof req.body?.fullName === "string" ? req.body.fullName.trim() : null;

  const { error } = await supabaseAdmin
    .from("profiles")
    .upsert({ id: userId, full_name: fullName }, { onConflict: "id", ignoreDuplicates: false });

  if (error) {
    res.status(500).json({ error: "Could not sync profile." });
    return;
  }

  res.json({ ok: true });
});

// Mere profile stats
profileRouter.get("/stats", async (req, res) => {
  const userId = (req as AuthedRequest).userId;

  const { data, error } = await supabaseAdmin.rpc("get_my_profile_stats", {
    p_user_id: userId,
  });

  if (error) {
    res.status(500).json({ error: "Could not load stats." });
    return;
  }

  res.json({ stats: data });
});