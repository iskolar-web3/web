import { authService } from './auth.service';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';
import type {
  UserProfile,
  StudentProfileData,
  IndividualSponsorProfileData,
  OrganizationSponsorProfileData,
  GovernmentSponsorProfileData,
  SchoolProfileData,
  ProfileUpdateData
} from '@/types/profile.types';

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

interface ProfileUpdateResponseData {
  profile?: UserProfile;
  student?: any;
  individual_sponsor?: any;
  organization_sponsor?: any;
  government_sponsor?: any;
  school?: any;
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

  /**
   * Retrieves the current user's complete profile
   * Includes authentication data and onboarding profile data
   * @returns Promise resolving to success status, message, and optional user profile
   */
  async getUserProfile(id: string): Promise<{ 
    success: boolean; 
    message: string; 
    profile?: UserProfile 
  }> {
    try {
      const response = await authService.authenticatedRequest<{ profile?: UserProfile }>(`/profile/${id}`, {
        method: 'GET'
      });

      return {
        success: response.success,
        message: response.message,
        profile: response.data?.profile
      };
    } catch (error) {
      const handled = handleError(error);
      logger.error('Get user profile error:', handled.raw);
      return {
        success: false,
        message: handled.message
      };
    }
  }

  /**
   * Updates the current user's profile
   * Accepts partial profile data for any user type
   * @param profileData - Partial profile data to update
   * @returns Promise resolving to success status, message, and updated profile
   */
  async updateProfile(profileData: Partial<ProfileUpdateData>): Promise<{ 
    success: boolean; 
    message: string; 
    profile?: UserProfile;
  }> {
    try {
      const response = await authService.authenticatedRequest<ProfileUpdateResponseData>('/profile/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });

      // Extract the profile from various possible response structures
      let updatedProfile: UserProfile | undefined;
      
      if (response.data?.profile) {
        updatedProfile = response.data.profile;
      } else if (response.data?.student) {
        updatedProfile = response.data.student;
      } else if (response.data?.individual_sponsor) {
        updatedProfile = response.data.individual_sponsor;
      } else if (response.data?.organization_sponsor) {
        updatedProfile = response.data.organization_sponsor;
      } else if (response.data?.government_sponsor) {
        updatedProfile = response.data.government_sponsor;
      } else if (response.data?.school) {
        updatedProfile = response.data.school;
      }

      return {
        success: response.success,
        message: response.message,
        profile: updatedProfile
      };
    } catch (error) {
      const handled = handleError(error);
      logger.error('Update profile error:', handled.raw);
      return {
        success: false,
        message: handled.message
      };
    }
  }
}

export const profileService = new ProfileService();