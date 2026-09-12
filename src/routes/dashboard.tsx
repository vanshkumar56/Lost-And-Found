import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/pages/DashboardPage";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Lost & Found" },
      { name: "description", content: "Your Lost & Found dashboard." },
      { property: "og:title", content: "Dashboard — Lost & Found" },
      { property: "og:description", content: "Your Lost & Found dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});
