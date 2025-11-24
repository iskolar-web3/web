export interface Scholarship {
  status: string;
  type: string;
  purpose: string;
  title: string;
  description?: string;
  total_amount: number;
  total_slot: number;
  application_deadline: string;
  criteria: string[];
  required_documents: string[];
  custom_form_fields?: CustomFormField[];
  image_url?: string;
  applications_count?: number;
  sponsor: Sponsor;
  created_at: string;
  updated_at: string;
}

export interface Sponsor {
  email?: string;
  name?: string;
  profile_url?: string;
}

export interface CustomFormField {
  type: 'text' | 'textarea' | 'multiple_choice' | 'dropdown' | 'checkbox' | 'number' | 'date' | 'email' | 'phone' | 'file';
  label: string;
  required: boolean;
  options?: string[];
}