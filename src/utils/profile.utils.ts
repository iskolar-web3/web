import { SponsorType, type AnySponsor } from "@/lib/sponsor/model";
import { UserRole, type User } from "@/lib/user/model";

/**
 * Gets the role label for display
 */
export function getRoleLabel(user: User, profile: any): string {
	if (!user.role) {
		return "No role";
	}

	if (user.role.code !== UserRole.Sponsor) {
		return user.role.name;
	}

	const sponsor = profile as AnySponsor;

	switch (sponsor.sponsorType.code) {
		case SponsorType.Individual:
			return "Individual";
		case SponsorType.Organization:
			return "Organization";
		case SponsorType.Government:
			return "Government";
	}
}

/**
 * Parses a date string in YYYY-MM-DD format and returns a Date object
 * Handles timezone offset by treating the date as local time
 */
export function parseDateString(dateString: string): Date {
	const [year, month, day] = dateString.split("-").map(Number);
	return new Date(year, month - 1, day);
}

/**
 * Formats a date string to a readable format
 */
export function formatDate(dateString: string): string {
	const date = parseDateString(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

/**
 * Formats a Date object to YYYY-MM-DD string in local timezone
 * This ensures the date stays consistent regardless of timezone
 */
export function formatDateToString(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}
