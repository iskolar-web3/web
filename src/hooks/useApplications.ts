import {
	ScholarshipApplicationStatus,
	type Application,
} from "@/lib/scholarship/model";
import { useState, useEffect } from "react";

/**
 * Filter type for application status categories
 */
type FilterType = "applied" | "past" | "granted";

/**
 * Custom hook for managing and filtering scholarship applications
 * Provides filtering logic for different application statuses:
 * - 'applied': pending and shortlisted applications
 * - 'past': approved and denied applications
 * - 'granted': granted applications
 *
 * @param initialApplications - Initial array of applications
 * @returns Object containing:
 *   - applications: Full array of applications
 *   - setApplications: Setter for applications array
 *   - filteredApplications: Filtered applications based on selected filter
 *   - selectedFilter: Currently selected filter type
 *   - setSelectedFilter: Setter for filter type
 */
export function useApplications(initialApplications: Application[] = []) {
	const [applications, setApplications] =
		useState<Application[]>(initialApplications);
	const [filteredApplications, setFilteredApplications] = useState<
		Application[]
	>([]);
	const [selectedFilter, setSelectedFilter] = useState<FilterType>("applied");

	useEffect(() => {
		let filtered = [...applications];

		if (selectedFilter === "applied") {
			filtered = filtered.filter(
				(app) =>
					app.application.status.code ===
						ScholarshipApplicationStatus.Pending ||
					app.application.status.code ===
						ScholarshipApplicationStatus.Shortlisted,
			);
		} else if (selectedFilter === "past") {
			filtered = filtered.filter(
				(app) =>
					app.application.status.code ===
						ScholarshipApplicationStatus.Approved ||
					app.application.status.code === ScholarshipApplicationStatus.Denied,
			);
		} else if (selectedFilter === "granted") {
			filtered = filtered.filter(
				(app) =>
					app.application.status.code === ScholarshipApplicationStatus.Granted,
			);
		}

		setFilteredApplications(filtered);
	}, [selectedFilter, applications]);

	return {
		applications,
		setApplications,
		filteredApplications,
		selectedFilter,
		setSelectedFilter,
	};
}

