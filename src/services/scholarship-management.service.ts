import { authService } from './auth.service';

const API_URL = import.meta.env.VITE_API_URL;

interface ScholarshipData {
  type?: string;
  purpose?: string;
  title: string;
  description?: string;
  total_amount: number;
  total_slot: number;
  application_deadline: string;
  criteria: string[];
  required_documents: string[];
  custom_form_fields: CustomFormField[];
}

export interface CustomFormField {
  type: 'text' | 'textarea' | 'multiple_choice' | 'dropdown' | 'checkbox' | 'number' | 'date' | 'email' | 'phone' | 'file' ;
  label: string;
  required: boolean;
  options?: string[]; 
}

interface Scholarship {
  scholarship_id: string;
  sponsor_id: string;
  status: string;
  sponsor: Sponsor;
  image_url: string;
  type: string;
  purpose: string;
  title: string;
  description?: string;
  total_amount: number;
  total_slot: number;
  application_deadline: string;
  criteria: string[];
  required_documents: string[];
  custom_form_fields: CustomFormField[];
  applications_count?: number;
  created_at: string;
  updated_at: string;
}

interface Sponsor {
  email?: string;
  organization_name: string;           
  profile_url?: string;
}

class ScholarshipManagementService {
  async createScholarship(scholarshipData: ScholarshipData): Promise<{ 
    success: boolean; 
    message: string; 
    scholarship?: any; 
  }> {
    const response = await authService.authenticatedRequest('/scholarship/create', {
      method: 'POST',
      body: JSON.stringify(scholarshipData)
    });

    return {
      success: response.success,
      message: response.message,
      scholarship: response.data?.scholarship,
    };
  }

  async updateScholarship(scholarshipId: string, data: Partial<ScholarshipData> & { status?: string; custom_form_fields?: CustomFormField[] }): Promise<{
    success: boolean;
    message: string;
    scholarship?: any;
  }> {
    const response = await authService.authenticatedRequest(`/scholarship/edit/${scholarshipId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });

    return {
      success: response.success,
      message: response.message,
      scholarship: response.data?.scholarship,
    };
  }

  async deleteScholarship(scholarshipId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await authService.authenticatedRequest(`/scholarship/delete/${scholarshipId}`, {
      method: 'DELETE'
    });

    return {
      success: response.success,
      message: response.message
    };
  }

  async archiveScholarship(scholarshipId: string): Promise<{
    success: boolean;
    message: string;
    scholarship?: any;
  }> {
    const response = await authService.authenticatedRequest(`/scholarship/archive/${scholarshipId}`, {
      method: 'POST'
    });

    return {
      success: response.success,
      message: response.message,
      scholarship: response.data?.scholarship,
    };
  }

  async getAllScholarships(): Promise<{ 
    success: boolean; 
    message: string;
    scholarships?: Scholarship[]; 
  }> {
    const response = await authService.authenticatedRequest(`/scholarship/`, {
      method: 'GET'
    });

    return {
      success: response.success,
      message: response.message,
      scholarships: response.data?.scholarships,
    };
  }

  async getScholarshipById(scholarshipId: string): Promise<{
    success: boolean;
    message: string;
    scholarship?: Scholarship;
  }> {
    const response = await authService.authenticatedRequest(`/scholarship/${scholarshipId}`, {
      method: 'GET'
    });

    return { 
      success: response.success, 
      message: response.message,
      scholarship: response.data?.scholarship, 
    };
  }

  async getMyScholarships(): Promise<{ 
    success: boolean; 
    message: string;
    scholarships?: Scholarship[]; 
  }> {
    const response = await authService.authenticatedRequest('/scholarship/my-scholarships', {
      method: 'GET'
    });

    return {
      success: response.success,
      message: response.message,
      scholarships: response.data?.scholarships,
    };
  }
}

export const scholarshipManagementService = new ScholarshipManagementService();