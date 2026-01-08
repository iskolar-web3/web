import { queryOptions } from "@tanstack/react-query";
import { BACKEND_URL, type ApiResponse } from "../api";
import { anySponsorSchema } from "../sponsor/model";
import { scholarshipSchema, type Scholarship } from "./model";

async function getMyScholarships(
	token: string,
	sponsorId: string,
): Promise<Scholarship[]> {
	const url = new URL(`${BACKEND_URL}/scholarships`);
	url.searchParams.append("sponsorId", sponsorId);

	const response = await fetch(url.toString(), {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
		credentials: "include",
	});
	const result: ApiResponse<Scholarship[]> = await response.json();

	return scholarshipSchema(anySponsorSchema).array().parse(result.data);
}

export const getMyScholarshipsQuery = (token: string, sponsorId: string) =>
	queryOptions({
		queryKey: ["scholarships", sponsorId],
		queryFn: () => getMyScholarships(token, sponsorId),
	});
