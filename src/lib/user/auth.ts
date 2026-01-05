import type { ApiResponse } from "../api";
import { getCookie } from "../cookie";
import type { AuthSession } from "./model";

export const ACCESS_TOKEN_KEY = "auth_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

export async function validateSession(): Promise<AuthSession | null> {
	const token = getCookie(ACCESS_TOKEN_KEY);
	if (!token) return null;

	const response = await fetch("/sessions", {
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
