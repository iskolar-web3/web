import { getDefaultPathOfRole } from "@/lib/api";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import type { JSX } from "react";

export const Route = createFileRoute("/_onboarding")({
	component: OnboardingLayout,
	beforeLoad: async ({ context }) => {
		const session = await context.auth.getSession();
		if (!session) {
			return;
		}

		if (session.user.role !== null) {
			const path = getDefaultPathOfRole(session.user);
			throw redirect({ to: path });
		}
	},
});

function OnboardingLayout(): JSX.Element {
	return (
		<div
			className="min-h-screen flex items-center justify-center px-6"
			style={{
				backgroundImage: "url('/background.jpg')",
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}}
		>
			<div className="w-full">
				<Outlet />
			</div>
		</div>
	);
}
