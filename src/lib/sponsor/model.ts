import z from "zod";
import { enumDetailSchema } from "../api";
import { contactDetailSchema } from "../user/model";

export enum SponsorType {
	Individual = "individual",
	Organization = "organization",
	Government = "government",
}

export enum EmploymentType {
	Employed = "employed",
	SelfEmployed = "self_employed",
	Freelancer = "freelancer",
	OFW = "ofw",
}

export const individualSponsorSchema = z.object({
	id: z.uuidv4(),
	userId: z.uuidv4(),
	email: z.email(),
	firstName: z.string().nonempty(),
	middleName: z.string().nullable(),
	lastName: z.string().nonempty(),
	employmentType: enumDetailSchema(EmploymentType),
	birthDate: z.coerce.date(),
	contact: contactDetailSchema,
	sponsorType: enumDetailSchema(SponsorType),
	avatarUrl: z.string().nullable(),
});
export type IndividualSponsor = z.output<typeof individualSponsorSchema>;

export enum OrganizationType {
	PrivateCompany = "private_company",
	NonGovernmentalOrganization = "non_governmental_organization",
	EducationalInstitution = "educational_institution",
}
export const organizationSponsorSchema = z.object({
	id: z.uuidv4(),
	userId: z.string(),
	email: z.email(),
	name: z.string().nonempty(),
	organizationType: enumDetailSchema(OrganizationType),
	contact: contactDetailSchema,
	sponsorType: enumDetailSchema(SponsorType),
	avatarUrl: z.string().nullable(),
});
export type OrganizationSponsor = z.output<typeof organizationSponsorSchema>;

export enum AgencyType {
	NationalGovernmentAgency = "national_government_agency",
	LocalGovernmentUnit = "local_government_unit",
	GovernmentOwnedAndControlledCorporation = "government_owned_and_controlled_corporation",
}
export const governmentSponsorSchema = z.object({
	id: z.uuidv4(),
	userId: z.uuidv4(),
	email: z.email(),
	name: z.string().nonempty(),
	agencyType: enumDetailSchema(AgencyType),
	contact: contactDetailSchema,
	sponsorType: enumDetailSchema(SponsorType),
	avatarUrl: z.string().nullable(),
});
export type GovernmentSponsor = z.output<typeof governmentSponsorSchema>;

export const anySponsorSchema = z.union([
	individualSponsorSchema,
	organizationSponsorSchema,
	governmentSponsorSchema,
]);
export type AnySponsor = z.infer<typeof anySponsorSchema>;
