import { useQuery } from "@tanstack/react-query";
import { getMyScholarshipsQuery } from "@/lib/scholarship/api";
import { getCookie } from "@/lib/cookie";
import { ACCESS_TOKEN_KEY } from "@/lib/user/auth";

/**
 * Custom React Query hook for fetching all available scholarships
 * Supports mock data mode for development/testing
 * Implements 10-minute stale time for optimal caching
 *
 * @returns React Query result containing array of all scholarships
 */
export const useScholarships = () => {
	const token = getCookie(ACCESS_TOKEN_KEY);
	if (!token) {
		throw new Error("Access token not found");
	}
	return useQuery(getMyScholarshipsQuery(token));
};
