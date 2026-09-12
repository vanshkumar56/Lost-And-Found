import { createFileRoute } from "@tanstack/react-router";
import { ReportItemDetailsPage } from "@/pages/ReportItemDetailsPage";

export const Route = createFileRoute("/report/")({
  component: ReportItemDetailsPage,
});
