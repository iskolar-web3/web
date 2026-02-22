import { Link } from "@tanstack/react-router";
import { ArrowRight, Files } from "lucide-react";
import type { JSX } from "react";

export function HomeEmpty(): JSX.Element {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<Files className="w-24 md:w-30 h-24 md:h-30 text-[#D1D5DB]" />
			<h2 className="text-lg md:text-xl text-[#9CA3AF] mt-8 mb-2">
				No applications yet
			</h2>

			<p className="max-w-md text-sm md:text-base text-[#9CA3AF] mb-4 md:mb-8">
				You have to apply for scholarships to see them listed here.
			</p>

			<Link
				to="/discover"
				className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#9CA3AF] text-tertiary text-sm md:text-base rounded-md hover:bg-muted-foreground hover:text-tertiary transition-colors"
			>
				Explore Scholarships
				<ArrowRight size={18} />
			</Link>
		</div>
	);
}
