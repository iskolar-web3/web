import type { ApiResponse } from "../api";
import { getCookie } from "../cookie";
import type { AuthSession } from "./model";

export const AUTH_TOKEN_KEY = "auth_token";

export async function validateSession(): Promise<AuthSession | null> {
	const token = getCookie(AUTH_TOKEN_KEY);
	if (!token) return null;

	const response = await fetch("/sessions", {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!response.ok) {
		return null;
	}

	const result: ApiResponse<AuthSession> = await response.json();
	return result.data;
}
