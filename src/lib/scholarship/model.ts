import z from "zod";
import { enumDetailSchema } from "../api";
import type { AnySponsor } from "../sponsor/model";
import { validateFormField } from "./helper";

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

export const createFormFieldOptionRequestSchema = z.object({
	value: z.string().nonempty(),
});
export type CreateFormFieldOptionRequest = z.infer<
	typeof createFormFieldOptionRequestSchema
>;

export const baseFormFieldSchema = z.object({
	label: z.string().nonempty(),
	isRequired: z.boolean(),
	fieldType: z.enum(FormFieldType),
	options: createFormFieldOptionRequestSchema.array().default([]),
});

export const createFormFieldRequestSchema = baseFormFieldSchema.refine((data) =>
	validateFormField(data.fieldType, data.options.length),
);
export type CreateFormFieldRequest = z.infer<
	typeof createFormFieldRequestSchema
>;

// Validation
export const createScholarshipRequestSchema = z.object({
	name: z
		.string()
		.nonempty("Scholarship title is required")
		.max(150, "Title must be less than 150 characters"),
	description: z.string().optional(),
	scholarshipType: z.enum(ScholarshipType, {
		error: "Please select a scholarship type",
	}),
	status: z.enum(ScholarshipStatus).default(ScholarshipStatus.Draft),
	totalAmount: z.coerce.number().positive(),
	totalSlots: z.coerce.number().positive(),
	applicationDeadline: z.date(),
	imageUrl: z.string().nonempty("Please upload a scholarship image"),
	purpose: z.enum(ScholarshipPurpose, { message: "Please select a purpose" }),
	criterias: z.string().array(),
	requirements: z.string().array(),
	sponsorId: z.uuidv4(),
	formFields: createFormFieldRequestSchema.array(),
});
/**
 * Scholarship form data type inferred from Zod schema
 */
export type ScholarshipFormData = z.infer<
	typeof createScholarshipRequestSchema
>;

const updateFormFieldOptionRequestSchema = createFormFieldOptionRequestSchema
	.extend({
		id: z.uuidv4(),
	})
	.partial();
export const updateFormFieldRequestSchema = baseFormFieldSchema
	.extend({
		options: updateFormFieldOptionRequestSchema.array(),
		id: z.uuidv4(),
	})
	.refine((data) => validateFormField(data.fieldType, data.options.length), {
		error:
			"Options are required for choice-based fields and must be empty for others",
		path: ["options"],
	})
	.partial();

export const updateScholarshipRequestSchema = createScholarshipRequestSchema
	.omit({
		sponsorId: true,
	})
	.extend({
		formFields: updateFormFieldRequestSchema.array(),
	})
	.partial()
	.extend({
		id: z.uuidv4(),
	});

export type EditScholarshipFormData = z.infer<
	typeof updateScholarshipRequestSchema
>;

export const getScholarshipQueryParamSchema = z
	.object({
		sponsorId: z.uuidv4(),
		search: z.string(),
	})
	.partial();

export type GetScholarshipQueryParam = z.infer<
	typeof getScholarshipQueryParamSchema
>;
