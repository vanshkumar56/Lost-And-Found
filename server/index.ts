import express from "express";
import cors from "cors";
import "dotenv/config";
import { itemsRouter } from "./routes/items";
import { chatsRouter } from "./routes/chats";
import { profileRouter } from "./routes/profile";

const app = express();
const port = Number(process.env.PORT) || 4000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/items", itemsRouter);
app.use("/api/chats", chatsRouter);
app.use("/api/profile", profileRouter);

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});