import { createFileRoute, Link  } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";
import Navbar from "@/components/landing/Navbar"; 
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import { Hero } from "@/components/landing/sections/Hero";
import { Problem } from "@/components/landing/sections/Problems";
import { Solution } from "@/components/landing/sections/Solution";
import { TargetUsers } from "@/components/landing/sections/TargetUsers";
import { Features } from "@/components/landing/sections/Feature";
import { Roadmap } from "@/components/landing/sections/Roadmap";
import { FAQ } from "@/components/landing/sections/FAQ";
import { Footer } from "@/components/landing/sections/Footer";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	usePageTitle("");

	return (
		<main className="relative min-h-screen bg-background">
			<Navbar/>
			<AnimatedBackground/>
			<Hero/>
			<Problem/>
			<Solution/>
			<TargetUsers/>
			<Features/>
			<Roadmap/>
			<FAQ/>
			<Footer/>
		</main>
	);
}
