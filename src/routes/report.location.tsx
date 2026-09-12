import { createFileRoute } from "@tanstack/react-router";
import { ReportLocationPage } from "@/pages/ReportLocationPage";

export const Route = createFileRoute("/report/location")({
  component: ReportLocationPage,
});
