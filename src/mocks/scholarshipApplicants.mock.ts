import type { Scholarship } from '@/types/scholarship.types';
import type { ScholarshipApplication } from '@/services/scholarshipApplication.service';

/**
 * Mock delay to simulate API latency
 */
export const mockApiDelay = (ms: number = 1500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Mock scholarship data for applicants list
 */
export const mockScholarshipForApplicants: Scholarship = {
  scholarship_id: '1',
  sponsor_id: '1',
  status: 'active',
  type: 'merit_based',
  purpose: 'tuition',
  title: 'CHED Merit Scholarship Program',
  description: 'A comprehensive scholarship program for outstanding students pursuing higher education in STEM fields.',
  total_amount: 250000,
  total_slot: 25,
  application_deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
  criteria: ['Minimum GWA of 1.75', 'STEM Strand Graduate', 'Filipino Citizen'],
  required_documents: ['Birth Certificate', 'Report Card', 'Certificate of Enrollment'],
  custom_form_fields: [
    { type: 'text', label: 'Full Name', required: true },
    { type: 'email', label: 'Email Address', required: true },
    { type: 'phone', label: 'Contact Number', required: true },
    { type: 'file', label: 'Upload Transcript', required: true },
    { type: 'textarea', label: 'Personal Statement', required: true },
  ],
  image_url: '/logo.jpg',
  sponsor: {
    name: 'Commission on Higher Education',
    email: 'ched@example.com',
    profile_url: '/logo.jpg',
  },
  applications_count: 120,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Generate mock applicants with various statuses
 */
export const generateMockApplicants = (count: number, _scholarshipId: string): ScholarshipApplication[] => {
  const statuses: Array<'pending' | 'shortlisted' | 'approved' | 'denied'> = [
    'pending',
    'shortlisted',
    'approved',
    'denied',
  ];
  
  const firstNames = [
    'John', 'Maria', 'Juan', 'Ana', 'Carlos', 'Sofia', 'Miguel', 'Isabella',
    'Gabriel', 'Lucia', 'Diego', 'Carmen', 'Luis', 'Rosa', 'Jose', 'Elena',
    'Pedro', 'Camila', 'Antonio', 'Valentina', 'Manuel', 'Daniela', 'Rafael', 'Paula',
  ];
  
  const lastNames = [
    'Santos', 'Reyes', 'Cruz', 'Bautista', 'Ocampo', 'Garcia', 'Mendoza', 'Torres',
    'Flores', 'Rivera', 'Gonzales', 'Ramos', 'Castillo', 'Morales', 'Herrera', 'Jimenez',
    'Alvarez', 'Romero', 'Medina', 'Aguilar', 'Gutierrez', 'Ortiz', 'Vargas', 'Castro',
  ];

  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'student.edu.ph'];
  
  return Array.from({ length: count }, (_, index) => {
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
    const fullName = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index > 23 ? index : ''}@${domains[index % domains.length]}`;
    const status = statuses[index % statuses.length];
    const phoneNumber = `+639${Math.floor(100000000 + Math.random() * 900000000)}`;
    
    // Generate random date within last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const appliedAt = new Date(Date.now() - daysAgo * 86400000).toISOString();

    return {
      scholarship_application_id: `${index + 1}`,
      student_id: `${index + 1}`,
      scholarship_id: _scholarshipId,
      status,
      custom_form_response: [
        { label: 'Full Name', value: fullName },
        { label: 'Email Address', value: email },
        { label: 'Contact Number', value: phoneNumber },
        { label: 'Upload Transcript', value: ['https://example.com/transcript.pdf'] as string[] },
        { 
          label: 'Personal Statement', 
          value: 'I am a dedicated student with a strong passion for learning and contributing to society through my chosen field of study.' 
        },
      ],
      applied_at: appliedAt,
      updated_at: appliedAt,
      ...(status === 'denied' && {
        remarks: 'Does not meet minimum GWA requirement',
      }),
      student: {
        student_id: `${index + 1}`,
        full_name: fullName,
        gender: index % 2 === 0 ? 'male' : 'female',
        date_of_birth: `${1998 + (index % 5)}-${String(1 + (index % 12)).padStart(2, '0')}-${String(1 + (index % 28)).padStart(2, '0')}`,
        contact_number: phoneNumber,
        user: {
          email,
          profile_url: index % 3 === 0 ? undefined : `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
        },
      },
      scholarship: mockScholarshipForApplicants,
    };
  });
};

/**
 * Mock applicants data
 */
export const mockApplicants = generateMockApplicants(76, '1');

/**
 * Mock API responses
 */
export const mockGetScholarshipApplications = async (_scholarshipId: string) => {
  await mockApiDelay(2000);
  
  return {
    success: true,
    applications: mockApplicants,
    message: 'Applications retrieved successfully',
  };
};

export const mockUpdateApplicationStatus = async (
  applicationId: string,
  newStatus: 'shortlisted' | 'approved' | 'denied',
  remarks?: string
) => {
  await mockApiDelay(1500);
  
  return {
    success: true,
    message: `Application ${newStatus} successfully`,
    application: {
      ...mockApplicants.find(app => app.scholarship_application_id === applicationId),
      status: newStatus,
      remarks,
      updated_at: new Date().toISOString(),
    },
  };
};

export const mockBulkUpdateApplicationStatus = async (
  applicationIds: string[],
  newStatus: 'shortlisted' | 'approved' | 'denied',
  remarks?: string
) => {
  await mockApiDelay(1500);
  
  return {
    success: true,
    message: `${applicationIds.length} application(s) ${newStatus} successfully`,
    updatedApplications: applicationIds.map(id => ({
      ...mockApplicants.find(app => app.scholarship_application_id === id),
      status: newStatus,
      remarks,
      updated_at: new Date().toISOString(),
    })),
  };
};