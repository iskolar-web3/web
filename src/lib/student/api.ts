import { BACKEND_URL, type ApiResponse } from "../api";
import { getCookie } from "../cookie";
import { ACCESS_TOKEN_KEY } from "../user/auth";
import type { Student, UpdateStudentRequest } from "./model";

export async function getMyStudentProfile(
	token: string,
): Promise<Student | null> {
	const response = await fetch(`${BACKEND_URL}/students/me`, {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
		credentials: "include",
	});
	if (!response.ok) {
		return null;
	}

	const result: ApiResponse<Student | null> = await response.json();
	console.log(result);
	return result.data;
}

export async function updateStudent(
	value: UpdateStudentRequest,
): Promise<ApiResponse<Student>> {
	const token = getCookie(ACCESS_TOKEN_KEY);
	const response = await fetch(`${BACKEND_URL}/students`, {
		method: "PATCH",
		body: JSON.stringify(value),
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const result: ApiResponse<Student> = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Failed to create profile.");
	}

	return result;
}
