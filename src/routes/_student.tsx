import { createFileRoute, Outlet } from "@tanstack/react-router";
import type { JSX } from "react";

export const Route = createFileRoute("/_student")({
  component: StudentLayout,
});

function StudentLayout(): JSX.Element {
  return (
    <div className="w-full bg-[#F0F7FF] px-4 md:px-12 py-4">
      <Outlet />
    </div>
  );
}