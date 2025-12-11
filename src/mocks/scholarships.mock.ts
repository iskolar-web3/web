import type { Scholarship } from '@/types/scholarship.types';

/**
 * Mock delay to simulate API latency
 */
export const mockApiDelay = (ms: number = 1500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Mock scholarship data for discover and scholarships page
 */
export const mockScholarships: Scholarship[] = Array(23).fill(null).map((_, i) => ({
  scholarship_id: `scholarship-${i + 1}`,
  sponsor_id: `sponsor-${i + 1}`,
  status: 'active',
  title: 'CHED Merit Scholarship Program',
  type: 'Merit-Based',
  purpose: 'Tuition',
  sponsor: { 
    name: 'Sponsor name',
    email: 'sponsor@example.com',
    profile_url: 'src/logo.svg'
  },
  application_deadline: 'September 21, 2025',
  total_amount: 10000000,
  total_slot: 400,
  criteria: ['3rd Year', 'Male', 'BSCS', 'BSIT', 'BSIS', '1st Year'],
  required_documents: [
    'Certificate of Enrollment', 
    'Latest Report of Grades', 
    'Birth Certificate', 
    'Barangay ID', 
    'School ID', 
    'Government ID'
  ],
  image_url: 'src/logo.svg',
  description: "The Commission on Higher Education (CHED) Merit Scholarship Program awards full or half merit scholarships to high-performing incoming college students in CHED-priority courses. It's designed to help academically excellent but financially needy students access tertiary education.",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}));

// Mock scholarships for sponsor page
export const mockSponsorScholarships: Scholarship[] = Array(5).fill(null).map((_, i) => ({
  scholarship_id: `sponsor-scholarship-${i + 1}`,
  sponsor_id: `sponsor-${i + 1}`,
  status: 'active',
  title: 'CHED Merit Scholarship Program',
  type: 'Merit-Based',
  purpose: 'Tuition',
  sponsor: {
    name: 'Sponsor name',
    email: 'sponsor@example.com',
    profile_url: 'src/logo.svg',
  },
  application_deadline: 'September 21, 2025',
  total_amount: 40000000,
  total_slot: 400,
  criteria: ['1st Year', 'LGU', 'Male', 'BSCS', 'BSIT', 'BSIS'],
  required_documents: ["Voter's Certificate", 'Birth Certificate', 'COR', 'Barangay ID'],
  image_url: 'src/logo.svg',
  description:
    "The Commission on Higher Education (CHED) Merit Scholarship Program awards full or half merit scholarships to high-performing incoming college students in CHED-priority courses. It's designed to help academically excellent but financially needy students access tertiary education.",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  applications_count: 800,
  custom_form_fields: [
    {
      type: 'text',
      label: 'Full Name',
      required: true,
    },
    {
      type: 'email',
      label: 'Email Address',
      required: true,
    },
    {
      type: 'phone',
      label: 'Contact Number',
      required: true,
    },
    {
      type: 'dropdown',
      label: 'Year Level',
      required: true,
      options: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    },
    {
      type: 'textarea',
      label: 'Why do you deserve this scholarship?',
      required: true,
    },
    {
      type: 'file',
      label: 'Upload Transcript of Records',
      required: true,
    },
  ],
}));