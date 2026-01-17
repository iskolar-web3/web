import { useMemo } from 'react';
import type { ScholarshipOld } from '@/types/scholarship.types';
import type { ScholarshipFormData } from '@/lib/scholarship/model';

/**
 * Custom hook for generating a preview of scholarship data from form values
 * Transforms form data into a Scholarship object format for preview purposes
 * 
 * @param formData - Current form data from useScholarshipForm
 * @returns Object containing:
 *   - previewScholarship: Partial scholarship object for preview display
 */
export function useScholarshipPreview(formData: ScholarshipFormData) {
  const previewScholarship = useMemo<Partial<ScholarshipOld>>(() => ({
    type: formData.scholarshipType,
    purpose: formData.purpose,
    title: formData.name,
    description: formData.description,
    image_url: formData.imageUrl,
    total_amount: formData.totalAmount ,
    total_slot: formData.totalSlots ,
    application_deadline: formData.applicationDeadline ? formData.applicationDeadline.toISOString() : '',
    criteria: formData.criterias,
    required_documents: formData.requirements,
    // sponsor: {
    //   name: 'iSkolar',
    //   profile_url: '/logo.jpg',
    // },
  }), [formData]);

  return { previewScholarship };
}


