import type { Scholarship } from '@/types/scholarship.types';

export type ApplicationStatus = 'pending' | 'shortlisted' | 'approved' | 'denied' | 'granted';

export interface Application {
  scholarship_application_id: string;
  status: ApplicationStatus;
  remarks?: string;
  applied_at: string;
  updated_at: string;
  custom_form_response?: Array<{ label: string; value: any }>;
  scholarship: Scholarship;
}