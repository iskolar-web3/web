import { BACKEND_URL, type ApiResponse } from "../api";
import type { Student } from "./model";

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
    console.log(result)
	return result.data;
}
