import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { normalizeText } from '@/utils/normalize.utils';

/**
 * Available custom form field types for scholarship applications
 */
export const customFieldTypes = [
  'text',
  'textarea',
  'multiple_choice',
  'dropdown',
  'checkbox',
  'number',
  'date',
  'email',
  'phone',
  'file',
] as const;
export type CustomFieldType = (typeof customFieldTypes)[number];

// Validation 
const scholarshipSchema = z.object({
  type: z.enum(['merit_based', 'skill_based'], { message: 'Please select a scholarship type' }),
  purpose: z.enum(['allowance', 'tuition'], { message: 'Please select a purpose' }),
  title: z.string().min(1, 'Scholarship title is required').max(150, 'Title must be less than 150 characters'),
  description: z.string().optional(),
  imageUrl: z.string().min(1, 'Please upload a scholarship image'),
  totalAmount: z.string()
    .min(1, 'Total amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Please enter a valid amount greater than 0'
    }),
  totalSlot: z.string()
    .min(1, 'Total slot is required')
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
      message: 'Please enter a valid slot number greater than 0'
    }),
  applicationDeadline: z.date('Please select an application deadline'),
  criteria: z.array(z.string()).min(1, 'At least one eligibility criterion is required'),
  requiredDocuments: z.array(z.string()).min(1, 'At least one required document is required'),
  customFormFields: z.array(z.object({
    type: z.enum(customFieldTypes),
    label: z.string().min(1, 'Field label is required'),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
  })).min(1, 'At least one form field is required'),
});

/**
 * Scholarship form data type inferred from Zod schema
 */
export type ScholarshipFormData = z.infer<typeof scholarshipSchema>;

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
  const form = useForm<ScholarshipFormData>({
    resolver: zodResolver(scholarshipSchema),
    mode: "onBlur",
    defaultValues: {
      type: undefined,
      purpose: undefined,
      title: '',
      description: '',
      imageUrl: '',
      totalAmount: '',
      totalSlot: '',
      applicationDeadline: undefined,
      criteria: [],
      requiredDocuments: [],
      customFormFields: [],
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [criteriaInput, setCriteriaInput] = useState('');
  const [documentsInput, setDocumentsInput] = useState('');

  const criteria = form.watch('criteria');
  const requiredDocuments = form.watch('requiredDocuments');

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue('imageUrl', result, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  }, [form]);

  const removeImage = useCallback(() => {
    setImagePreview(null);
    form.setValue('imageUrl', '', { shouldValidate: true });
  }, [form]);

  const addCriterion = useCallback(() => {
    const normalized = normalizeText(criteriaInput);
    if (normalized && !criteria.includes(normalized)) {
      form.setValue('criteria', [...criteria, normalized]);
      setCriteriaInput('');
    }
  }, [criteria, criteriaInput, form]);

  const removeCriterion = useCallback((index: number) => {
    form.setValue('criteria', criteria.filter((_, i) => i !== index));
  }, [criteria, form]);

  const addDocument = useCallback(() => {
    const normalized = normalizeText(documentsInput);
    if (normalized && !requiredDocuments.includes(normalized)) {
      form.setValue('requiredDocuments', [...requiredDocuments, normalized]);
      setDocumentsInput('');
    }
  }, [documentsInput, requiredDocuments, form]);

  const removeDocument = useCallback((index: number) => {
    form.setValue('requiredDocuments', requiredDocuments.filter((_, i) => i !== index));
  }, [requiredDocuments, form]);

  const resetForm = useCallback(() => {
    form.reset();
    setImagePreview(null);
    setCriteriaInput('');
    setDocumentsInput('');
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

