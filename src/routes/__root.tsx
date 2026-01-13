import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import type { QueryClient } from "@tanstack/react-query";
import type { JSX } from "react";
import type { AuthContextValue } from "@/auth";

type RouterContext = {
	queryClient: QueryClient;
	auth: AuthContextValue;
};

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RouteComponent,
});

function RouteComponent(): JSX.Element {
	return (
		<>
			<Outlet />
		</>
	);
}
