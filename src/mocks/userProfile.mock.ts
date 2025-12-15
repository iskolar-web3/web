import type { 
  UserProfile,
  StudentProfile,
  IndividualSponsorProfile,
  OrganizationSponsorProfile,
  GovernmentSponsorProfile
} from '@/types/profile.types';

/**
 * Mock student user profile
 */
export const mockStudentUser: StudentProfile = {
  user_id: '1',
  email: 'louigie.caminoy@example.com',
  role: 'student',
  full_name: 'Louie Justin Adam',
  gender: 'Male',
  date_of_birth: '2000-05-15',
  contact_number: '09123456789',
  profile_completed: true,
};

/**
 * Mock individual sponsor user profile
 */
export const mockIndividualSponsorUser: IndividualSponsorProfile = {
  user_id: '2',
  email: 'sponsor@example.com',
  role: 'individual_sponsor',
  full_name: 'Louie Justin Adam',
  employment_type: 'Employed',
  date_of_birth: '1985-03-20',
  contact_number: '09987654321',
  profile_completed: true,
};

/**
 * Mock organization sponsor user profile
 */
export const mockOrganizationSponsorUser: OrganizationSponsorProfile = {
  user_id: '3',
  email: 'orgsponso@example.com',
  role: 'organization_sponsor',
  name: 'Tech Foundation Philippines',
  organization_type: 'Non-profit Organization',
  contact_number: '02-1234-5678',
  profile_completed: true,
};

/**
 * Mock government sponsor user profile
 */
export const mockGovernmentSponsorUser: GovernmentSponsorProfile = {
  user_id: '4',
  email: 'govsponso@example.com',
  role: 'government_sponsor',
  name: 'Department of Education',
  agency_type: 'National Government Agency',
  contact_number: '02-8631-0000',
  profile_completed: true,
};

/**
 * Helper to get mock user by role (for testing)
 */
export function getMockUserByRole(role: UserProfile['role']): UserProfile {
  switch (role) {
    case 'student':
      return mockStudentUser;
    case 'individual_sponsor':
      return mockIndividualSponsorUser;
    case 'organization_sponsor':
      return mockOrganizationSponsorUser;
    case 'government_sponsor':
      return mockGovernmentSponsorUser;
    default:
      throw new Error(`No mock data for role: ${role}`);
  }
}