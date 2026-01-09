import { useQuery } from "@tanstack/react-query";
import {
	getApplicantsQuery,
	getScholarshipByIdQuery,
} from "@/lib/scholarship/api";
import { getCookie } from "@/lib/cookie";
import { ACCESS_TOKEN_KEY } from "@/lib/user/auth";

// const USE_MOCK_DATA = true;

/**
 * Custom React Query hook for fetching scholarship applicants and scholarship details
 * Supports mock data mode for development/testing
 *
 * @param scholarshipId - ID of the scholarship to fetch applicants for
 * @returns Object containing:
 *   - applicantsQuery: React Query result for scholarship applications
 *   - scholarshipQuery: React Query result for scholarship details
 */
export const useScholarshipApplicants = (scholarshipId: string) => {
	const token = getCookie(ACCESS_TOKEN_KEY);
	if (!token) {
		throw new Error("Access token not found.");
	}

	const applicantsQuery = useQuery(getApplicantsQuery(scholarshipId));
	const scholarshipQuery = useQuery(
		getScholarshipByIdQuery(token, scholarshipId),
	);

	return { applicantsQuery, scholarshipQuery };
};
