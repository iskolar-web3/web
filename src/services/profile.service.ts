import { authService } from './auth.service';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';

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
 * API Response data types
 * These represent the structure of the 'data' field in API responses
 */
interface StudentProfileResponseData {
  student?: any;
}

interface IndividualSponsorProfileResponseData {
  individual_sponsor?: any;
}

interface OrganizationSponsorProfileResponseData {
  organization_sponsor?: any;
}

interface GovernmentSponsorProfileResponseData {
  government_sponsor?: any;
}

interface SchoolProfileResponseData {
  school?: any;
}

interface ProfileStatusResponseData {
  user?: any;
}

/**
 * Service for managing user profile setup and retrieval
 * Handles different profile types for students, sponsors, and schools
 */
class ProfileService {
  /**
   * Sets up a student profile during onboarding
   * @param profileData - Student profile information
   * @returns Promise resolving to success status, message, and optional student data
   */
  async setupStudentProfile(profileData: StudentProfileData): Promise<{ success: boolean; message: string; student?: any }> {
    try {
      const response = await authService.authenticatedRequest<StudentProfileResponseData>('/onboarding/setup-student-profile', {
        method: 'POST',
        body: JSON.stringify(profileData)
      });

      return {
        success: response.success,
        message: response.message,
        student: response.data?.student
      };
    } catch (error) {
      const handled = handleError(error);
      logger.error('Setup student profile error:', handled.raw);
      return {
        success: false,
        message: handled.message
      };
    }
  }

  /**
   * Sets up an individual sponsor profile during onboarding
   * @param profileData - Individual sponsor profile information
   * @returns Promise resolving to success status, message, and optional sponsor data
   */
  async setupIndividualSponsorProfile(profileData: IndividualSponsorProfileData): Promise<{ success: boolean; message: string; individual_sponsor?: any }> {
    try {
      const response = await authService.authenticatedRequest<IndividualSponsorProfileResponseData>('/onboarding/setup-individual-sponsor-profile', {
        method: 'POST',
        body: JSON.stringify(profileData)
      });

      return {
        success: response.success,
        message: response.message,
        individual_sponsor: response.data?.individual_sponsor
      };
    } catch (error) {
      const handled = handleError(error);
      logger.error('Setup individual sponsor profile error:', handled.raw);
      return {
        success: false,
        message: handled.message
      };
    }
  }

  /**
   * Sets up an organization sponsor profile during onboarding
   * @param profileData - Organization sponsor profile information
   * @returns Promise resolving to success status, message, and optional organization data
   */
  async setupOrganizationSponsorProfile(profileData: OrganizationSponsorProfileData): Promise<{ success: boolean; message: string; organization_sponsor?: any }> {
    try {
      const response = await authService.authenticatedRequest<OrganizationSponsorProfileResponseData>('/onboarding/setup-organization-sponsor-profile', {
        method: 'POST',
        body: JSON.stringify(profileData)
      });

      return {
        success: response.success,
        message: response.message,
        organization_sponsor: response.data?.organization_sponsor
      };
    } catch (error) {
      const handled = handleError(error);
      logger.error('Setup organization sponsor profile error:', handled.raw);
      return {
        success: false,
        message: handled.message
      };
    }
  }

  /**
   * Sets up a government sponsor profile during onboarding
   * @param profileData - Government sponsor profile information
   * @returns Promise resolving to success status, message, and optional government sponsor data
   */
  async setupGovernmentSponsorProfile(profileData: GovernmentSponsorProfileData): Promise<{ success: boolean; message: string; government_sponsor?: any }> {
    try {
      const response = await authService.authenticatedRequest<GovernmentSponsorProfileResponseData>('/onboarding/setup-government-sponsor-profile', {
        method: 'POST',
        body: JSON.stringify(profileData)
      });

      return {
        success: response.success,
        message: response.message,
        government_sponsor: response.data?.government_sponsor
      };
    } catch (error) {
      const handled = handleError(error);
      logger.error('Setup government sponsor profile error:', handled.raw);
      return {
        success: false,
        message: handled.message
      };
    }
  }

  /**
   * Sets up a school profile during onboarding
   * @param profileData - School profile information
   * @returns Promise resolving to success status, message, and optional school data
   */
  async setupSchoolProfile(profileData: SchoolProfileData): Promise<{ success: boolean; message: string; school?: any }> {
    try {
      const response = await authService.authenticatedRequest<SchoolProfileResponseData>('/onboarding/setup-school-profile', {
        method: 'POST',
        body: JSON.stringify(profileData)
      });

      return {
        success: response.success,
        message: response.message,
        school: response.data?.school
      };
    } catch (error) {
      const handled = handleError(error);
      logger.error('Setup school profile error:', handled.raw);
      return {
        success: false,
        message: handled.message
      };
    }
  }

  /**
   * Retrieves the current user's profile status
   * @returns Promise resolving to success status, message, and optional user data
   */
  async getProfileStatus(): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      const response = await authService.authenticatedRequest<ProfileStatusResponseData>('/onboarding/profile-status', {
        method: 'POST'
      });

      return {
        success: response.success,
        message: response.message,
        user: response.data?.user
      };
    } catch (error) {
      const handled = handleError(error);
      logger.error('Get profile status error:', handled.raw);
      return {
        success: false,
        message: handled.message
      };
    }
  }
}

export const profileService = new ProfileService();