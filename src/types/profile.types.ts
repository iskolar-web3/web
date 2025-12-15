/**
 * Student profile data structure for onboarding
 */
export interface StudentProfileData {
  /** User role identifier */
  role: string;
  /** Student's first name */
  first_name: string;
  /** Student's middle name */
  middle_name: string;
  /** Student's last name */
  last_name: string;
  /** Student's gender */
  gender: string;
  /** Student's date of birth in ISO format */
  date_of_birth: string;
  /** Student's contact phone number */
  contact_number: string;
}

/**
 * Individual sponsor profile data structure for onboarding
 */
export interface IndividualSponsorProfileData {
  /** User role identifier */
  role: string;
  /** Sponsor's first name */
  first_name: string;
  /** Sponsor's middle name */
  middle_name: string;
  /** Sponsor's last name */
  last_name: string;
  /** Employment type */
  employment_type: string;
  /** Sponsor's date of birth in ISO format */
  date_of_birth: string;
  /** Sponsor's contact phone number */
  contact_number: string;
}

/**
 * Organization sponsor profile data structure for onboarding
 */
export interface OrganizationSponsorProfileData {
  /** User role identifier */
  role: string;
  /** Organization's official name */
  organization_name: string;
  /** Type of organization */
  organization_type: string;
  /** Organization's contact phone number */
  contact_number: string;
}

/**
 * Government sponsor profile data structure for onboarding
 */
export interface GovernmentSponsorProfileData {
  /** User role identifier */
  role: string;
  /** Government agency name */
  agency_name: string;
  /** Type of government agency */
  agency_type: string;
  /** Agency's contact phone number */
  contact_number: string;
}

/**
 * School profile data structure for onboarding
 */
export interface SchoolProfileData {
  /** User role identifier */
  role: string;
  /** School's official name */
  school_name: string;
  /** Type of school */
  school_type: string;
  /** School's contact phone number */
  contact_number: string;
}

/**
 * Union type for all profile data types used in updates
 */
export type ProfileUpdateData = 
  | StudentProfileData 
  | IndividualSponsorProfileData 
  | OrganizationSponsorProfileData 
  | GovernmentSponsorProfileData 
  | SchoolProfileData;

/**
 * Complete user profile types
 * These combine authentication data with onboarding profile data
 */

/** Complete student profile with auth and onboarding data */
export interface StudentProfile {
  /** User ID from authentication */
  user_id: string;
  /** User email from authentication */
  email: string;
  /** User role */
  role: 'student';
  /** Student's full name */
  full_name: string;
  /** Student's gender */
  gender: string;
  /** Student's date of birth */
  date_of_birth: string;
  /** Student's contact phone number */
  contact_number: string;
  /** Profile completion status */
  profile_completed: boolean;
}

/** Complete individual sponsor profile with auth and onboarding data */
export interface IndividualSponsorProfile {
  /** User ID from authentication */
  user_id: string;
  /** User email from authentication */
  email: string;
  /** User role */
  role: 'individual_sponsor';
  /** Sponsor's full name */
  full_name: string;
  /** Employment type */
  employment_type: string;
  /** Sponsor's date of birth */
  date_of_birth: string;
  /** Sponsor's contact phone number */
  contact_number: string;
  /** Profile completion status */
  profile_completed: boolean;
}

/** Complete organization sponsor profile with auth and onboarding data */
export interface OrganizationSponsorProfile {
  /** User ID from authentication */
  user_id: string;
  /** User email from authentication */
  email: string;
  /** User role */
  role: 'organization_sponsor';
  /** Organization's official name */
  name: string;
  /** Type of organization */
  organization_type: string;
  /** Organization's contact phone number */
  contact_number: string;
  /** Profile completion status */
  profile_completed: boolean;
}

/** Complete government sponsor profile with auth and onboarding data */
export interface GovernmentSponsorProfile {
  /** User ID from authentication */
  user_id: string;
  /** User email from authentication */
  email: string;
  /** User role */
  role: 'government_sponsor';
  /** Government agency name */
  name: string;
  /** Type of government agency */
  agency_type: string;
  /** Agency's contact phone number */
  contact_number: string;
  /** Profile completion status */
  profile_completed: boolean;
}

/** Complete school profile with auth and onboarding data */
export interface SchoolProfile {
  /** User ID from authentication */
  user_id: string;
  /** User email from authentication */
  email: string;
  /** User role */
  role: 'school';
  /** School's official name */
  name: string;
  /** Type of school */
  school_type: string;
  /** School's contact phone number */
  contact_number: string;
  /** Profile completion status */
  profile_completed: boolean;
}

/** Union type for all user profile types */
export type UserProfile = 
  | StudentProfile 
  | IndividualSponsorProfile 
  | OrganizationSponsorProfile 
  | GovernmentSponsorProfile 
  | SchoolProfile;