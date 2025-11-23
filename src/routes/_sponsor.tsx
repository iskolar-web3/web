import { createFileRoute, Outlet } from "@tanstack/react-router";
import type { JSX } from "react";

export const Route = createFileRoute("/_sponsor")({
  component: SponsorLayout,
});

function SponsorLayout(): JSX.Element {
  return (
    <div className="w-full bg-[#F0F7FF]">
      <Outlet />
    </div>
  );
}