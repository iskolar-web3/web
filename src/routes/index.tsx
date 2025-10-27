import { createFileRoute, Link  } from "@tanstack/react-router";
import logo from "../logo.svg";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "../hooks/use-page-title";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	usePageTitle("");

	return (
		<div className="text-center">
			<header className="min-h-screen flex flex-col items-center justify-center bg-[#F0F7FF]">
				<p className="text-2xl text-[#3A52A6]">Welcome to iSkolar</p>

				<Link to="/login">
					<Button className="mt-4 bg-[#EFA508] hover:bg-[#FACC15]">Get Started</Button>
				</Link>
			</header>
		</div>
	);
}
