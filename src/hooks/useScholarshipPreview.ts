import { useMemo } from 'react';
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
  const previewScholarship = useMemo<Partial<ScholarshipFormData>>(() => (formData), [formData]);

  return { previewScholarship };
}


