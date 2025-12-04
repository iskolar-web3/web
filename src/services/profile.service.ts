import { authService } from './auth.service';

const API_URL = import.meta.env.VITE_API_URL;

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
    const response = await authService.authenticatedRequest('/onboarding/setup-student-profile', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });

    return {
      success: response.success,
      message: response.message,
      student: response.data?.student
    };
  }

  async setupIndividualSponsorProfile(profileData: IndividualSponsorProfileData): Promise<{ success: boolean; message: string; individual_sponsor?: any }> {
    const response = await authService.authenticatedRequest('/onboarding/setup-individual-sponsor-profile', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });

    return {
      success: response.success,
      message: response.message,
      individual_sponsor: response.data?.individual_sponsor
    };
  }

  async setupOrganizationSponsorProfile(profileData: OrganizationSponsorProfileData): Promise<{ success: boolean; message: string; organization_sponsor?: any }> {
    const response = await authService.authenticatedRequest('/onboarding/setup-organization-sponsor-profile', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });

    return {
      success: response.success,
      message: response.message,
      organization_sponsor: response.data?.organization_sponsor
    };
  }

  async setupGovernmentSponsorProfile(profileData: GovernmentSponsorProfileData): Promise<{ success: boolean; message: string; government_sponsor?: any }> {
    const response = await authService.authenticatedRequest('/onboarding/setup-government-sponsor-profile', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });

    return {
      success: response.success,
      message: response.message,
      government_sponsor: response.data?.government_sponsor
    };
  }

  async setupSchoolProfile(profileData: SchoolProfileData): Promise<{ success: boolean; message: string; school?: any }> {
    const response = await authService.authenticatedRequest('/onboarding/setup-school-profile', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });

    return {
      success: response.success,
      message: response.message,
      school: response.data?.school
    };
  }
}

export const profileService = new ProfileService();