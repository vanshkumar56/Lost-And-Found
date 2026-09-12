import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — Lost & Found" },
      { name: "description", content: "Reset your Lost & Found account password." },
      { property: "og:title", content: "Forgot Password — Lost & Found" },
      { property: "og:description", content: "Reset your Lost & Found account password." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ForgotPasswordPage,
});
