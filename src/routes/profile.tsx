import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/pages/ProfilePage";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Lost & Found" },
      { name: "description", content: "Your Lost & Found profile and settings." },
      { property: "og:title", content: "Profile — Lost & Found" },
      { property: "og:description", content: "Your Lost & Found profile and settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});
