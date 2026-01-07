import { BACKEND_URL, type ApiResponse } from "../api";
import { anySponsorSchema, type AnySponsor } from "./model";

export async function getMySponsorProfile(
	token: string,
): Promise<AnySponsor | null> {
	const response = await fetch(`${BACKEND_URL}/sponsors/me`, {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
		credentials: "include",
	});
	if (!response.ok) {
		return null;
	}

	const result: ApiResponse<AnySponsor | null> = await response.json();
	return anySponsorSchema.parse(result.data);
}
