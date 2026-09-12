import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/pages/LoginPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Login — Lost & Found" },
      { name: "description", content: "Log in to the Lost & Found app." },
      { property: "og:title", content: "Login — Lost & Found" },
      { property: "og:description", content: "Log in to the Lost & Found app." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});
