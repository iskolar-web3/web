import type {
  UserProfile,
  StudentProfile,
  IndividualSponsorProfile,
  OrganizationSponsorProfile,
  GovernmentSponsorProfile,
  SchoolProfile
} from '@/types/profile.types';

/**
 * Gets the display name based on user profile type
 * Uses type narrowing for type-safe property access
 */
export function getDisplayName(profile: UserProfile): string {
  switch (profile.role) {
    case 'student':
    case 'individual_sponsor':
      return profile.full_name;
    case 'organization_sponsor':
    case 'government_sponsor':
    case 'school':
      return profile.name;
    default:
      // Exhaustiveness check ensures all cases are handled
      const _: never = profile;
      return _;
  }
}

/**
 * Gets the role label for display
 */
export function getRoleLabel(role: UserProfile['role']): string {
  const roleMap: Record<UserProfile['role'], string> = {
    student: 'Student',
    individual_sponsor: 'Individual',
    organization_sponsor: 'Organization',
    government_sponsor: 'Government',
    school: 'School',
  };
  return roleMap[role];
}

/**
 * Parses a date string in YYYY-MM-DD format and returns a Date object
 * Handles timezone offset by treating the date as local time
 */
export function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Formats a date string to a readable format
 */
export function formatDate(dateString: string): string {
  const date = parseDateString(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

/**
 * Type guard to check if profile is a student
 */
export function isStudentProfile(profile: UserProfile): profile is StudentProfile {
  return profile.role === 'student';
}

/**
 * Type guard to check if profile is an individual sponsor
 */
export function isIndividualSponsor(profile: UserProfile): profile is IndividualSponsorProfile {
  return profile.role === 'individual_sponsor';
}

/**
 * Type guard to check if profile is an organization sponsor
 */
export function isOrganizationSponsor(profile: UserProfile): profile is OrganizationSponsorProfile {
  return profile.role === 'organization_sponsor';
}

/**
 * Type guard to check if profile is a government sponsor
 */
export function isGovernmentSponsor(profile: UserProfile): profile is GovernmentSponsorProfile {
  return profile.role === 'government_sponsor';
}

/**
 * Type guard to check if profile is a school
 */
export function isSchoolProfile(profile: UserProfile): profile is SchoolProfile {
  return profile.role === 'school';
}

/**
 * Gets the contact number from any profile type
 */
export function getContactNumber(profile: UserProfile): string {
  return profile.contact_number;
}

/**
 * Gets the email from any profile type
 */
export function getEmail(profile: UserProfile): string {
  return profile.email;
}