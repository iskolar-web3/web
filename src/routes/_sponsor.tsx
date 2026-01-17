import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import type { JSX } from "react";
import HeaderNav from "@/components/HeaderNav";
import { UserRole } from "@/lib/user/model";
import { getDefaultPathOfRole } from "@/lib/api";

export const Route = createFileRoute("/_sponsor")({
  component: SponsorLayout,
  beforeLoad: async ({context}) => {
      const ses = await context.auth.getSession()
      if(!ses) {
          throw redirect({to: "/login"})
      }

      if(ses.user.role?.code !== UserRole.Sponsor) {
			const path = getDefaultPathOfRole(ses.user);
			throw redirect({ to: path });
      }
  }
});

function SponsorLayout(): JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNav role="sponsor" />
      <div className="w-full px-4 md:px-14 pt-21 md:pt-24 pb-6">
        <Outlet />
      </div>
    </div>
  );
}
