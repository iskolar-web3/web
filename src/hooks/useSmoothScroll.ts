import { useEffect } from "react";
import Lenis from "lenis";

type LenisOptions = ConstructorParameters<typeof Lenis>[0];

const defaultOptions: LenisOptions = {
	duration: 1.2,
	easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
	orientation: "vertical",
	gestureOrientation: "vertical",
	smoothWheel: true,
};

export function useSmoothScroll(options?: LenisOptions) {
	useEffect(() => {
		const lenis = new Lenis({ ...defaultOptions, ...options });

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		return () => {
			lenis.destroy();
		};
	}, [options]);
}
