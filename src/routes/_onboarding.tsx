import { createFileRoute, Outlet } from "@tanstack/react-router";
import type { JSX } from "react";

export const Route = createFileRoute("/_onboarding")({
  component: OnboardingLayout,
});

function OnboardingLayout(): JSX.Element {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}