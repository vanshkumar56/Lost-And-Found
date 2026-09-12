import { createFileRoute } from "@tanstack/react-router";
import { ChatPage } from "@/pages/ChatPage";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat — Lost & Found" },
      { name: "description", content: "Chat with other Lost & Found members." },
      { property: "og:title", content: "Chat — Lost & Found" },
      { property: "og:description", content: "Chat with other Lost & Found members." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChatPage,
});
