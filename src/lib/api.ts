import z from "zod";
import type { EnumLike } from "zod/v3";

export type ApiResponse<T = any> = T extends undefined
	? { message: string }
	: { message: string; data: T };

export const BACKEND_URL =
	import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export function enumDetailSchema<T extends EnumLike>(code: T) {
	return z.object({
		id: z.number().positive(),
		name: z.string().nonempty(),
		code: z.enum(code),
	});
}
