import type { Application } from '@/types/application.types';
import type { Scholarship } from '@/types/scholarship.types';

/**
 * Mock delay to simulate API latency
 */
export const mockApiDelay = (ms: number = 1500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Mock applications data for homepage
 */
const createMockScholarship = (overrides: Partial<Scholarship> = {}): Scholarship => ({
  scholarship_id: '1',
  sponsor_id: '1',
  status: 'active',
  type: 'Merit-Based',
  purpose: 'Tuition',
  title: 'CHED Merit Scholarship Program',
  description:
    'The CHED Merit Scholarship Program supports academically excellent students pursuing tertiary education in priority programs.',
  total_amount: 10000000,
  total_slot: 400,
  application_deadline: 'September 21, 2025',
  criteria: ['1st Year', 'LGU', 'Male', 'BSCS', 'BSIT', 'BSIS'],
  required_documents: ['Voters Certificate', 'Birth Certificate', 'COR', 'Report of Grades'],
  custom_form_fields: [],
  image_url: 'src/logo.svg',
  applications_count: 0,
  sponsor: {
    name: 'Sponsor name',
    email: 'sponsor@example.com',
    profile_url: 'src/logo.svg',
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const mockApplications: Application[] = [
  {
    scholarship_application_id: 'app-1',
    status: 'pending',
    applied_at: '2025-09-01T07:00:00Z',
    updated_at: '2025-09-01T07:00:00Z',
    scholarship: createMockScholarship(),
  },
  {
    scholarship_application_id: 'app-2',
    status: 'shortlisted',
    applied_at: '2025-08-15T06:00:00Z',
    updated_at: '2025-08-20T04:30:00Z',
    scholarship: createMockScholarship({
      scholarship_id: '2',
      title: 'STEM Excellence Grant',
      purpose: 'Allowance',
      total_amount: 5000000,
      total_slot: 150,
    }),
  },
  {
    scholarship_application_id: 'app-3',
    status: 'granted',
    applied_at: '2025-07-10T09:30:00Z',
    updated_at: '2025-07-25T03:15:00Z',
    scholarship: createMockScholarship({
      scholarship_id: '3',
      title: 'Local Government Scholarship',
      purpose: 'Tuition',
      total_amount: 2500000,
      total_slot: 80,
    }),
  },
];