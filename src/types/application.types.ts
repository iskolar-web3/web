import type { Scholarship } from '@/types/scholarship.types';
import type { FormFieldResponse } from '@/types/form.types';

export type ApplicationStatus = 'pending' | 'shortlisted' | 'approved' | 'denied' | 'granted';

export interface Application {
  scholarship_application_id: string;
  status: ApplicationStatus;
  remarks?: string;
  applied_at: string;
  updated_at: string;
  custom_form_response?: FormFieldResponse[];
  scholarship: Scholarship;
}