import { UserRole } from "@/lib/user/model";
import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
	useRouterState,
} from "@tanstack/react-router";
import type { JSX } from "react";

export const Route = createFileRoute("/_auth")({
	component: AuthLayout,
	beforeLoad: async ({ context }) => {
		let currentUser = context.auth.user;

		if (!currentUser) {
			const ses = await context.auth.getSession();
			if (!ses) {
				return
			}

			currentUser = ses.user;
		}

		switch (currentUser.role?.code) {
			case UserRole.Student:
				throw redirect({ to: "/home" });
			case UserRole.Sponsor:
				throw redirect({ to: "/scholarships" });
			default:
				throw redirect({ to: "/role-selection" });
		}
	},
});

function AuthLayout(): JSX.Element {
	const router = useRouterState();
	const currentPath = router.location.pathname;

	const isLoginPage = currentPath === "/login";
	const isRegisterPage = currentPath === "/register";

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
			<div className="w-full max-w-sm">
				<div className="relative z-10">
					{/* Top navigation tabs */}
					<div className="flex justify-end mb-6">
						<div className="inline-flex rounded-full p-1 bg-[#3A52A6]">
							<Link
								to="/login"
								className={`px-4 py-1.5 rounded-full text-xs text-[#F0F7FF] transition-all ${
									isLoginPage ? "bg-[#607EF2]" : "opacity-50"
								}`}
							>
								Log In
							</Link>
							<Link
								to="/register"
								className={`px-4 py-1.5 rounded-full text-xs text-[#F0F7FF] transition-all ${
									isRegisterPage ? "bg-[#607EF2]" : "opacity-50"
								}`}
							>
								Sign Up
							</Link>
						</div>
					</div>

					<Outlet />
				</div>
			</div>
		</div>
	);
}

