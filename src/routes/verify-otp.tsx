import { createFileRoute } from "@tanstack/react-router";
import { VerifyOtpPage } from "@/pages/VerifyOtpPage";

export const Route = createFileRoute("/verify-otp")({
  head: () => ({
    meta: [
      { title: "Verify OTP — Lost & Found" },
      { name: "description", content: "Enter the OTP to verify your account." },
      { property: "og:title", content: "Verify OTP — Lost & Found" },
      { property: "og:description", content: "Enter the OTP to verify your account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VerifyOtpPage,
});
