import type { ScholarshipOld } from '@/types/scholarship.types';
import type { FormFieldResponse } from '@/types/form.types';

export type ApplicationStatusOld = 'pending' | 'shortlisted' | 'approved' | 'denied' | 'granted';

export interface ApplicationOld {
  scholarship_application_id: string;
  status: ApplicationStatusOld;
  remarks?: string;
  applied_at: string;
  updated_at: string;
  custom_form_response?: FormFieldResponse[];
  scholarship: ScholarshipOld;
}
