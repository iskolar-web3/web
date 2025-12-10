import type { Scholarship } from '@/types/scholarship.types';

/**
 * Mock delay to simulate API latency
 */
export const mockApiDelay = (ms: number = 2000) => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock scholarship data for editing
 */
export const mockScholarshipDetails: Partial<Scholarship> = {
  scholarship_id: '1',
  title: 'CHED Merit Scholarship Program 2024',
  description: 'This scholarship program aims to support outstanding students who demonstrate academic excellence and financial need.',
  total_amount: 50000,
  total_slot: 100,
  application_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  criteria: ['Minimum GWA of 1.75', 'STEM Strand Graduate', 'Filipino Citizen'],
  required_documents: ['Birth Certificate', 'Report Card', 'Certificate of Enrollment'],
  custom_form_fields: [
    { type: 'text', label: 'Full Name', required: true },
    { type: 'email', label: 'Email Address', required: true },
    { type: 'phone', label: 'Contact Number', required: true },
    { type: 'textarea', label: 'Why do you deserve this scholarship?', required: false },
    { type: 'number', label: 'Current GWA', required: true },
    { type: 'date', label: 'Date of Birth', required: true },
    { 
      type: 'dropdown', 
      label: 'Year Level', 
      required: true, 
      options: ['1st Year', '2nd Year', '3rd Year', '4th Year'] 
    },
    { 
      type: 'multiple_choice', 
      label: 'Preferred Contact Method', 
      required: true, 
      options: ['Email', 'Phone', 'SMS'] 
    },
    { 
      type: 'checkbox', 
      label: 'Extracurricular Activities', 
      required: false, 
      options: ['Sports', 'Arts', 'Leadership', 'Community Service'] 
    },
    { type: 'file', label: 'Transcript of Records', required: true },
    { type: 'file', label: 'Certificate of Registration', required: true },
  ],
  sponsor: {
    name: 'Commission on Higher Education',
    profile_url: '/src/logo.svg',
  },
};