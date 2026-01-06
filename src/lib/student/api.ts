import type { Student } from "@/types/student";
import { BACKEND_URL, type ApiResponse } from "../api";
import { scholarshipSchema, type Scholarship } from "../scholarship/model";
import { anySponsorSchema } from "../sponsor/model";
import { queryOptions } from "@tanstack/react-query";

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
	return result.data;
}

async function getMyApplications(
	token: string,
	studentId: string,
): Promise<Scholarship[]> {
	const url = new URL(`${BACKEND_URL}/scholarships/applications`);
	url.searchParams.append("studentId", studentId);

	const response = await fetch(url.toString(), {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
		credentials: "include",
	});
	const result: ApiResponse<Scholarship[]> = await response.json();

	return scholarshipSchema(anySponsorSchema).array().parse(result.data);
}

export const getMyApplicationsQuery = (token: string, studentId: string) =>
	queryOptions({
		queryKey: ["scholarships", studentId],
		queryFn: () => getMyApplications(token, studentId),
	});
