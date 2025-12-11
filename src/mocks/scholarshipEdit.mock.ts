import type { Scholarship } from '@/types/scholarship.types';

/**
 * Mock delay to simulate API latency
 */
export const mockApiDelay = (ms: number = 1500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Mock scholarship data for editing
 */
export const mockScholarshipEdit: Scholarship = {
  scholarship_id: '1',
  sponsor_id: '1',
  status: 'active',
  type: 'merit_based',
  purpose: 'tuition',
  title: 'CHED Merit Scholarship Program',
  description: 'A sample description for the scholarship program.',
  total_amount: 250000,
  total_slot: 25,
  application_deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
  criteria: ['Minimum GWA of 1.75', 'STEM Strand Graduate'],
  required_documents: ['Birth Certificate', 'Report Card'],
  custom_form_fields: [
    { type: 'text', label: 'Full Name', required: true },
    { type: 'email', label: 'Email Address', required: true },
    { type: 'file', label: 'Upload Transcript', required: true },
  ],
  image_url: '/src/logo.svg',
  sponsor: {
    name: 'Sponsor Name',
    email: 'sponsor@example.com',
    profile_url: 'src/logo.svg',
  },
  applications_count: 120,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};