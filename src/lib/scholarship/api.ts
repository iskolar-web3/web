import { queryOptions } from "@tanstack/react-query";
import { BACKEND_URL, type ApiResponse } from "../api";
import { anySponsorSchema } from "../sponsor/model";
import {
	applicantSchema,
	applicationSchema,
	scholarshipSchema,
	type Applicant,
	type Application,
	type CreateApplicationRequest,
	type EditScholarshipFormData,
	type GetApplicationsQueryParam,
	type GetScholarshipQueryParam,
	type Scholarship,
} from "./model";
import { getCookie } from "../cookie";
import { ACCESS_TOKEN_KEY } from "../user/auth";

async function getMyScholarships(
	token: string,
	params?: GetScholarshipQueryParam,
): Promise<Scholarship[]> {
	const url = new URL(`${BACKEND_URL}/scholarships`);
	if (params?.sponsorId) {
		url.searchParams.append("sponsorId", params.sponsorId);
	}
	if (params?.search) {
		url.searchParams.append("search", params.search);
	}

	const response = await fetch(url.toString(), {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
		credentials: "include",
	});
	const result: ApiResponse<Scholarship[]> = await response.json();

	return scholarshipSchema(anySponsorSchema).array().parse(result.data);
}

export const getMyScholarshipsQuery = (
	token: string,
	params?: GetScholarshipQueryParam,
) =>
	queryOptions({
		queryKey: ["scholarships", params],
		queryFn: () => getMyScholarships(token, params),
	});

async function getScholarshipById(
	token: string,
	id: string,
): Promise<Scholarship> {
	const url = new URL(`${BACKEND_URL}/scholarships/${id}`);

	const response = await fetch(url.toString(), {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
		credentials: "include",
	});
	const result: ApiResponse<Scholarship> = await response.json();

	console.log(result.data);

	return scholarshipSchema(anySponsorSchema).parse(result.data);
}

export const getScholarshipByIdQuery = (token: string, id: string) =>
	queryOptions({
		queryKey: ["scholarships", id],
		queryFn: () => getScholarshipById(token, id),
	});

export async function updateScholarship(
	data: EditScholarshipFormData,
): Promise<ApiResponse<Scholarship>> {
	const token = getCookie(ACCESS_TOKEN_KEY);
	if (!token) {
		throw new Error("Access token not found.");
	}

	const url = new URL(`${BACKEND_URL}/scholarships/${data.id}`);
	const response = await fetch(url.toString(), {
		method: "PATCH",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		credentials: "include",
	});
	const result: ApiResponse<Scholarship> = await response.json();

	scholarshipSchema(anySponsorSchema).parse(result.data);

	return result;
}

async function getApplicants(id: string): Promise<Applicant[]> {
	const token = getCookie(ACCESS_TOKEN_KEY);
	if (!token) {
		throw new Error("Access token not found.");
	}
	const url = new URL(`${BACKEND_URL}/scholarships/${id}/applications`);

	const response = await fetch(url.toString(), {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
		credentials: "include",
	});
	const result: ApiResponse<Applicant[]> = await response.json();

	return applicantSchema.array().parse(result.data);
}

export const getApplicantsQuery = (id: string) =>
	queryOptions({
		queryKey: ["scholarships", "applicants", id],
		queryFn: () => getApplicants(id),
	});

async function getMyApplications(
	param: GetApplicationsQueryParam,
): Promise<Application[]> {
	const token = getCookie(ACCESS_TOKEN_KEY);
	if (!token) {
		throw new Error("Access token not found.");
	}
	const url = new URL(`${BACKEND_URL}/scholarships/applications`);
	if (param.studentId) {
		url.searchParams.append("studentId", param.studentId);
	}

	if (param.status) {
		url.searchParams.append("status", param.status);
	}

	const response = await fetch(url.toString(), {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
		credentials: "include",
	});
	const result: ApiResponse<Application[]> = await response.json();

	return applicationSchema.array().parse(result.data);
}

export const getMyApplicationsQuery = (param: GetApplicationsQueryParam) =>
	queryOptions({
		queryKey: ["scholarships", "applications", param],
		queryFn: () => getMyApplications(param),
	});

export async function createApplication(
	data: CreateApplicationRequest,
): Promise<ApiResponse> {
	const token = getCookie(ACCESS_TOKEN_KEY);
	if (!token) {
		throw new Error("Access token not found.");
	}
	const url = new URL(
		`${BACKEND_URL}/scholarships/${data.scholarshipId}/applications`,
	);

	const response = await fetch(url.toString(), {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		credentials: "include",
	});
	const result: ApiResponse = await response.json();

	return result;
}
