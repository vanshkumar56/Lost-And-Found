import { createFileRoute } from "@tanstack/react-router";
import { SignupPage } from "@/pages/SignupPage";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — Lost & Found" },
      { name: "description", content: "Create a Lost & Found account." },
      { property: "og:title", content: "Create Account — Lost & Found" },
      { property: "og:description", content: "Create a Lost & Found account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SignupPage,
});
