import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import type { QueryClient } from "@tanstack/react-query";
import type { JSX } from "react";

type RouterContext = {
	queryClient: QueryClient;
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
