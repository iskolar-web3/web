import { createFileRoute } from "@tanstack/react-router";
import { usePageTitle } from "@/hooks/usePageTitle";
import Navbar from "@/components/landing/Navbar"; 
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import { Hero } from "@/components/landing/sections/Hero";
import { Suspense, lazy, useEffect } from "react";
import Lenis from "lenis";

// Lazy load below-the-fold sections
const Problem = lazy(() => import("@/components/landing/sections/Problems").then(m => ({ default: m.Problem })));
const Solution = lazy(() => import("@/components/landing/sections/Solution").then(m => ({ default: m.Solution })));
const TargetUsers = lazy(() => import("@/components/landing/sections/TargetUsers").then(m => ({ default: m.TargetUsers })));
const Features = lazy(() => import("@/components/landing/sections/Feature").then(m => ({ default: m.Features })));
const Roadmap = lazy(() => import("@/components/landing/sections/Roadmap").then(m => ({ default: m.Roadmap })));
const FAQ = lazy(() => import("@/components/landing/sections/FAQ").then(m => ({ default: m.FAQ })));
const Footer = lazy(() => import("@/components/landing/sections/Footer").then(m => ({ default: m.Footer })));

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	usePageTitle("");

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

	return (
		<main className="relative min-h-screen bg-background">
			<Navbar/>
			<AnimatedBackground/>
			<Hero/>
      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <Problem/>
        <Solution/>
        <TargetUsers/>
        <Features/>
        <Roadmap/>
        <FAQ/>
        <Footer/>
      </Suspense>
		</main>
	);
}
