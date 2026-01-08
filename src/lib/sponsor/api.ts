import { BACKEND_URL, type ApiResponse } from "../api";
import {
	anySponsorSchema,
	SponsorType,
	type AnySponsor,
	type GovernmentSponsor,
	type IndividualSponsor,
	type OrganizationSponsor,
} from "./model";

export async function getMySponsorProfile(
	token: string,
): Promise<AnySponsor | null> {
	const response = await fetch(`${BACKEND_URL}/sponsors/me`, {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
		credentials: "include",
	});
	if (!response.ok) {
		return null;
	}

	const result: ApiResponse<AnySponsor | null> = await response.json();
	return anySponsorSchema.parse(result.data);
}

export function getSponsorName(sponsor: AnySponsor): string {
	switch (sponsor.sponsorType.code) {
		case SponsorType.Individual:
			const s = sponsor as IndividualSponsor;
			return `${s.firstName} ${s.lastName}`;

		case SponsorType.Organization:
		case SponsorType.Government:
			return (sponsor as OrganizationSponsor | GovernmentSponsor).name;

		default:
			return "iSkolar";
	}
}
