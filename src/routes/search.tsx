import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "@/pages/SearchPage";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — Lost & Found" },
      { name: "description", content: "Search lost and found items." },
      { property: "og:title", content: "Search — Lost & Found" },
      { property: "og:description", content: "Search lost and found items." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SearchPage,
});
