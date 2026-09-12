import { Outlet } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import "@/styles/report-layout.css";

export function ReportLayout() {
  return (
    <div className="report-layout">
      <Outlet />
      <BottomNav />
    </div>
  );
}
