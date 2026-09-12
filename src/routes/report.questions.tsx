import { createFileRoute } from "@tanstack/react-router";
import { ReportQuestionsPage } from "@/pages/ReportQuestionsPage";

export const Route = createFileRoute("/report/questions")({
  component: ReportQuestionsPage,
});
