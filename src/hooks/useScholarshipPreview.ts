import { useMemo } from 'react';
import type { ScholarshipFormData } from './useScholarshipForm';
import type { Scholarship } from '@/types/scholarship.types';

export function useScholarshipPreview(formData: {
  type?: ScholarshipFormData['type'];
  purpose?: ScholarshipFormData['purpose'];
  title: string;
  description?: string;
  imageUrl: string;
  totalAmount: string;
  totalSlot: string;
  applicationDeadline?: Date;
  criteria: string[];
  requiredDocuments: string[];
}) {
  const previewScholarship = useMemo<Partial<Scholarship>>(() => ({
    type: formData.type,
    purpose: formData.purpose,
    title: formData.title,
    description: formData.description,
    image_url: formData.imageUrl,
    total_amount: formData.totalAmount ? parseFloat(formData.totalAmount) : 0,
    total_slot: formData.totalSlot ? parseInt(formData.totalSlot) : 0,
    application_deadline: formData.applicationDeadline ? formData.applicationDeadline.toISOString() : '',
    criteria: formData.criteria,
    required_documents: formData.requiredDocuments,
    sponsor: {
      name: 'iSkolar',
      profile_url: 'src/logo.svg',
    },
  }), [formData]);

  return { previewScholarship };
}


