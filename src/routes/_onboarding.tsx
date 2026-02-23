import { getDefaultPathOfRole } from "@/lib/api";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import type { JSX } from "react";

export const Route = createFileRoute("/_onboarding")({
	component: OnboardingLayout,
	beforeLoad: async ({ context }) => {
		let currentUser = context.auth.user;

		if (!currentUser) {
			const ses = await context.auth.getSession();
			if (!ses) {
				throw redirect({ to: "/login" });
			}

			currentUser = ses.user;
		}

		if (currentUser.role !== null) {
			const path = getDefaultPathOfRole(currentUser);
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
