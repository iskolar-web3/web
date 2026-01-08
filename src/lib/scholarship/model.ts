import z from "zod";
import { enumDetailSchema } from "../api";
import type { AnySponsor } from "../sponsor/model";

export enum ScholarshipType {
	MeritBased = "merit-based",
	SkillBased = "skill-based",
}

export enum ScholarshipStatus {
	Draft = "draft",
	Active = "active",
	Inactive = "inactive",
	Closed = "closed",
	Suspended = "suspended",
	Archived = "archived",
}

export enum ScholarshipPurpose {
	Allowance = "allowance",
	Tuition = "tuition",
}

export enum FormFieldType {
	ShortAnswer = "short_answer",
	Paragraph = "paragraph",
	MultipleChoice = "multiple_choice",
	Dropdown = "dropdown",
	Checkbox = "checkbox",
	Number = "number",
	Date = "date",
	Email = "email",
	Phone = "phone",
	File = "file",
}

const formFieldOptionSchema = z.object({
	id: z.uuidv4(),
	value: z.string().nonempty(),
	sortOrder: z.number().positive(),
});

const formFieldSchema = z.object({
	id: z.uuidv4(),
	label: z.string().nonempty(),
	isRequired: z.boolean(),
	sortOrder: z.number().positive(),
	fieldType: enumDetailSchema(FormFieldType),
	options: formFieldOptionSchema.array().default([]),
});

export const scholarshipSchema = <T extends z.ZodType>(sponsor: T) =>
	z.object({
		id: z.uuidv4(),
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date(),
		name: z.string().nonempty(),
		description: z.string().nullable(),
		scholarshipType: enumDetailSchema(ScholarshipType),
		status: enumDetailSchema(ScholarshipStatus),
		totalAmount: z.coerce.number().positive(),
		totalSlots: z.number().positive(),
		applicationDeadline: z.coerce.date(),
		imageUrl: z.string().nullable(),
		purpose: enumDetailSchema(ScholarshipPurpose),
		criterias: z.string().array(),
		requirements: z.string().array(),
		sponsor: sponsor,
		formFields: formFieldSchema.array().default([]),
		applicationCount: z.number().nonnegative(),
	});

export type Scholarship<T extends AnySponsor = AnySponsor> = Omit<
	z.infer<ReturnType<typeof scholarshipSchema<z.ZodTypeAny>>>,
	"sponsor"
> & {
	sponsor: T;
};
