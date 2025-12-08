import { createFileRoute, Outlet } from "@tanstack/react-router";
import type { JSX } from "react";
import HeaderNav from "@/components/HeaderNav";

export const Route = createFileRoute("/_sponsor")({
  component: SponsorLayout,
});

function SponsorLayout(): JSX.Element {
  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <HeaderNav role="sponsor" />
      <div className="w-full px-4 md:px-14 pt-21 md:pt-24 pb-6">
        <Outlet />
      </div>
    </div>
  );
}