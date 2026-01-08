import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { normalizeText } from "@/utils/normalize.utils";
import {
	FormFieldType,
	ScholarshipPurpose,
	ScholarshipStatus,
	ScholarshipType,
} from "@/lib/scholarship/model";
import { useAuth } from "@/auth";
import type { AnySponsor } from "@/lib/sponsor/model";
import { uploadFile } from "@/lib/api";
import { ACCESS_TOKEN_KEY } from "@/lib/user/auth";
import { getCookie } from "@/lib/cookie";

const createFormFieldOptionRequestSchema = z.object({
	value: z.string().nonempty(),
});
export type CreateFormFieldOptionRequest = z.infer<typeof createFormFieldOptionRequestSchema>

const baseFormFieldSchema = z.object({
	label: z.string().nonempty(),
	isRequired: z.boolean(),
	fieldType: z.enum(FormFieldType),
	options: createFormFieldOptionRequestSchema.array().default([]),
});

function validateFormField(fieldType: FormFieldType, numOfOptions: number) {
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

const createFormFieldRequestSchema = baseFormFieldSchema.refine(
	(data) => validateFormField(data.fieldType, data.options.length),
);
export type CreateFormFieldRequest = z.infer<
	typeof createFormFieldRequestSchema
>;

// Validation
const createScholarshipRequestSchema = z.object({
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

/**
 * Custom hook for managing scholarship creation/edit form
 * Provides form state management, validation, and helper functions for:
 * - Image upload and preview
 * - Dynamic criteria list management
 * - Dynamic required documents list management
 * - Custom form fields management
 *
 * @returns Object containing:
 *   - form: React Hook Form instance with Zod validation
 *   - imagePreview: Current image preview URL
 *   - criteriaInput: Input state for adding criteria
 *   - setCriteriaInput: Setter for criteria input
 *   - documentsInput: Input state for adding documents
 *   - setDocumentsInput: Setter for documents input
 *   - handleImageUpload: Function to handle image file upload
 *   - removeImage: Function to remove uploaded image
 *   - addCriterion: Function to add a new criterion
 *   - removeCriterion: Function to remove a criterion by index
 *   - addDocument: Function to add a new required document
 *   - removeDocument: Function to remove a document by index
 *   - resetForm: Function to reset entire form state
 */
export function useScholarshipForm() {
	const auth = useAuth<AnySponsor>();
	const form = useForm<ScholarshipFormData>({
        // @ts-expect-error This works fine but it has TS error for some reason
		resolver: zodResolver(createScholarshipRequestSchema),
		mode: "onBlur",
		defaultValues: {
			criterias: [],
			formFields: [],
			imageUrl: "",
			description: "",
			name: "",
			requirements: [],
			sponsorId: auth.profile.id,
            status: ScholarshipStatus.Draft,
		},
	});

	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [criteriaInput, setCriteriaInput] = useState("");
	const [documentsInput, setDocumentsInput] = useState("");

	const criteria = form.watch("criterias");
	const requirements = form.watch("requirements");

	const handleImageUpload = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onloadend = () => {
					const result = reader.result as string;
					setImagePreview(result);
				};
				reader.readAsDataURL(file);

                const token = getCookie(ACCESS_TOKEN_KEY);
                if (token) {
                    const uploadRes = await uploadFile(file, token)
					form.setValue("imageUrl", uploadRes.data.url, { shouldValidate: true });
                }
			}
		},
		[form],
	);

	const removeImage = useCallback(() => {
		setImagePreview(null);
		form.setValue("imageUrl", "", { shouldValidate: true });
	}, [form]);

	const addCriterion = useCallback(() => {
		const normalized = normalizeText(criteriaInput);
		if (normalized && !criteria.includes(normalized)) {
			form.setValue("criterias", [...criteria, normalized]);
			setCriteriaInput("");
		}
	}, [criteria, criteriaInput, form]);

	const removeCriterion = useCallback(
		(index: number) => {
			form.setValue(
				"criterias",
				criteria.filter((_, i) => i !== index),
			);
		},
		[criteria, form],
	);

	const addDocument = useCallback(() => {
		const normalized = normalizeText(documentsInput);
		if (normalized && !requirements.includes(normalized)) {
			form.setValue("requirements", [...requirements, normalized]);
			setDocumentsInput("");
		}
	}, [documentsInput, requirements, form]);

	const removeDocument = useCallback(
		(index: number) => {
			form.setValue(
				"requirements",
				requirements.filter((_, i) => i !== index),
			);
		},
		[requirements, form],
	);

	const resetForm = useCallback(() => {
		form.reset();
		setImagePreview(null);
		setCriteriaInput("");
		setDocumentsInput("");
	}, [form]);

	return {
		form,
		imagePreview,
		criteriaInput,
		setCriteriaInput,
		documentsInput,
		setDocumentsInput,
		handleImageUpload,
		removeImage,
		addCriterion,
		removeCriterion,
		addDocument,
		removeDocument,
		resetForm,
	};
}
