import { createFileRoute } from "@tanstack/react-router";
import { ReportLayout } from "@/pages/ReportLayout";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report Item — Lost & Found" },
      { name: "description", content: "Report a lost item." },
      { property: "og:title", content: "Report Item — Lost & Found" },
      { property: "og:description", content: "Report a lost item." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReportLayout,
});
