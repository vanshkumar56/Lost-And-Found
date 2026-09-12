import { createFileRoute } from "@tanstack/react-router";
import { ReportReviewPage } from "@/pages/ReportReviewPage";

export const Route = createFileRoute("/report/review")({
  component: ReportReviewPage,
});
