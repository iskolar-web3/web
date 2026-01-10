import z from "zod";
import {
	createApplicationSchema,
	FormFieldType,
	type FormField,
} from "./model";

export function validateFormField(
	fieldType: FormFieldType,
	numOfOptions: number,
) {
	const typesWithOptions = [
		FormFieldType.MultipleChoice,
		FormFieldType.Dropdown,
		FormFieldType.Checkbox,
	];

	if (typesWithOptions.includes(fieldType)) {
		return numOfOptions > 0;
	}

	return numOfOptions === 0;
}

export function getValidatedApplicationSchema(fields: FormField[]) {
	return createApplicationSchema.superRefine((data, ctx) => {
		fields.forEach((field, index) => {
			const answerIndex = data.formFieldAnswers.findIndex(
				(a) => a.formFieldId === field.id,
			);

			const value =
				answerIndex !== -1
					? data.formFieldAnswers[answerIndex].value
					: undefined;
			const path = [
				"formFieldAnswers",
				answerIndex === -1 ? index : answerIndex,
				"value",
			];

			if (
				field.isRequired &&
				(value === undefined || value === null || value === "")
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `${field.label} is required`,
					path,
				});
				return;
			}

			if (!value && !field.isRequired) return;

			switch (field.fieldType.code) {
				case FormFieldType.Email:
					if (!z.email().safeParse(value).success) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `${field.label} must be a valid email`,
							path,
						});
					}
					break;

				case FormFieldType.Phone:
					const phoneDigits = String(value).replace(/\D/g, "");
					if (phoneDigits.length < 10 || phoneDigits.length > 12) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `${field.label} must be a valid phone number`,
							path,
						});
					}
					break;

				case FormFieldType.Number:
					if (isNaN(Number(value))) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `${field.label} must be a valid number`,
							path,
						});
					}
					break;

				case FormFieldType.Dropdown:
				case FormFieldType.MultipleChoice:
					const validOptions = field.options.map((opt) => opt.value);
					if (!validOptions.includes(value)) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `Invalid selection for ${field.label}`,
							path,
						});
					}
					break;

				case "checkbox":
					const selectedValues = Array.isArray(value) ? value : [];
					const allowedValues = field.options.map((opt) => opt.value);
					const allValid = selectedValues.every((v: any) =>
						allowedValues.includes(v),
					);

					if (field.isRequired && selectedValues.length === 0) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `${field.label} requires at least one selection`,
							path,
						});
					} else if (!allValid) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `Invalid selection in ${field.label}`,
							path,
						});
					}
					break;
			}
		});
	});
}
