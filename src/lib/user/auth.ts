import { BACKEND_URL, type ApiResponse } from "../api";
import type { AuthSession } from "./model";

export const ACCESS_TOKEN_KEY = "auth_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

export async function validateSession(token: string): Promise<AuthSession | null> {
	const response = await fetch(`${BACKEND_URL}/sessions`, {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
		credentials: "include",
	});
	if (!response.ok) {
		return null;
	}

	const result: ApiResponse<AuthSession> = await response.json();
	return result.data;
}
