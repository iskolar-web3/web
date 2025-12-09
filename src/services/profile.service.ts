import { authService } from './auth.service';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';



export interface StudentProfileData {
  role: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender?: string;
  date_of_birth: string;
  contact_number: string;
}

export interface IndividualSponsorProfileData {
  role: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  employment_type?: string;
  date_of_birth: string;
  contact_number: string;
}

export interface OrganizationSponsorProfileData {
  role: string;
  organization_name: string;
  organization_type?: string;
  contact_number: string;
}

export interface GovernmentSponsorProfileData {
  role: string;
  agency_name: string;
  agency_type?: string;
  contact_number: string;
}

export interface SchoolProfileData {
  role: string;
  school_name: string;
  school_type?: string;
  contact_number: string;
}

class ProfileService {
  async setupStudentProfile(profileData: StudentProfileData): Promise<{ success: boolean; message: string; student?: any }> {
    try {
      const response = await authService.authenticatedRequest('/onboarding/setup-student-profile', {
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

  async setupIndividualSponsorProfile(profileData: IndividualSponsorProfileData): Promise<{ success: boolean; message: string; individual_sponsor?: any }> {
    try {
      const response = await authService.authenticatedRequest('/onboarding/setup-individual-sponsor-profile', {
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

  async setupOrganizationSponsorProfile(profileData: OrganizationSponsorProfileData): Promise<{ success: boolean; message: string; organization_sponsor?: any }> {
    try {
      const response = await authService.authenticatedRequest('/onboarding/setup-organization-sponsor-profile', {
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

  async setupGovernmentSponsorProfile(profileData: GovernmentSponsorProfileData): Promise<{ success: boolean; message: string; government_sponsor?: any }> {
    try {
      const response = await authService.authenticatedRequest('/onboarding/setup-government-sponsor-profile', {
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

  async setupSchoolProfile(profileData: SchoolProfileData): Promise<{ success: boolean; message: string; school?: any }> {
    try {
      const response = await authService.authenticatedRequest('/onboarding/setup-school-profile', {
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

  async getProfileStatus(): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      const response = await authService.authenticatedRequest('/onboarding/profile-status', {
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