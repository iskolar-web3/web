import { authService } from './auth.service';
import type { Scholarship, CustomFormField } from '@/types/scholarship.types';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';

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

interface ScholarshipResponse {
  success: boolean;
  message: string;
  data?: {
    scholarship?: Scholarship;
  };
}

interface ScholarshipsResponse {
  success: boolean;
  message: string;
  data?: {
    scholarships?: Scholarship[];
  };
}

class ScholarshipManagementService {
  async createScholarship(scholarshipData: ScholarshipData): Promise<{ 
    success: boolean; 
    message: string; 
    scholarship?: Scholarship; 
  }> {
    try {
      const response = await authService.authenticatedRequest('/scholarship/create', {
        method: 'POST',
        body: JSON.stringify(scholarshipData)
      }) as ScholarshipResponse;

      return {
        success: response.success,
        message: response.message,
        scholarship: response.data?.scholarship,
      };
    } catch (error) {
      const handled = handleError(error);
      logger.error('Create scholarship error:', handled.raw);
      return {
        success: false,
        message: handled.message
      };
    }
  }

  async updateScholarship(scholarshipId: string, data: Partial<ScholarshipData> & { status?: string; custom_form_fields?: CustomFormField[] }): Promise<{
    success: boolean;
    message: string;
    scholarship?: Scholarship;
  }> {
    try {
      const response = await authService.authenticatedRequest(`/scholarship/edit/${scholarshipId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }) as ScholarshipResponse;

      return {
        success: response.success,
        message: response.message,
        scholarship: response.data?.scholarship,
      };
    } catch (error) {
      const handled = handleError(error);
      logger.error('Update scholarship error:', handled.raw);
      return {
        success: false,
        message: handled.message
      };
    }
  }

  async deleteScholarship(scholarshipId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await authService.authenticatedRequest(`/scholarship/delete/${scholarshipId}`, {
        method: 'DELETE'
      });

      return {
        success: response.success,
        message: response.message
      };
    } catch (error) {
      const handled = handleError(error);
      logger.error('Delete scholarship error:', handled.raw);
      return {
        success: false,
        message: handled.message
      };
    }
  }

  async archiveScholarship(scholarshipId: string): Promise<{
    success: boolean;
    message: string;
    scholarship?: Scholarship;
  }> {
    try {
      const response = await authService.authenticatedRequest(`/scholarship/archive/${scholarshipId}`, {
        method: 'POST'
      }) as ScholarshipResponse;

      return {
        success: response.success,
        message: response.message,
        scholarship: response.data?.scholarship,
      };
    } catch (error) {
      const handled = handleError(error);
      logger.error('Archive scholarship error:', handled.raw);
      return {
        success: false,
        message: handled.message
      };
    }
  }

  async getAllScholarships(): Promise<{ 
    success: boolean; 
    message: string;
    scholarships?: Scholarship[]; 
  }> {
    try {
      const response = await authService.authenticatedRequest(`/scholarship/`, {
        method: 'GET'
      }) as ScholarshipsResponse;

      return {
        success: response.success,
        message: response.message,
        scholarships: response.data?.scholarships,
      };
    } catch (error) {
      const handled = handleError(error);
      logger.error('Get all scholarships error:', handled.raw);
      return {
        success: false,
        message: handled.message
      };
    }
  }

  async getScholarshipById(scholarshipId: string): Promise<{
    success: boolean;
    message: string;
    scholarship?: Scholarship;
  }> {
    try {
      const response = await authService.authenticatedRequest(`/scholarship/${scholarshipId}`, {
        method: 'GET'
      }) as ScholarshipResponse;

      return { 
        success: response.success, 
        message: response.message,
        scholarship: response.data?.scholarship, 
      };
    } catch (error) {
      const handled = handleError(error);
      logger.error('Get scholarship by id error:', handled.raw);
      return {
        success: false,
        message: handled.message
      };
    }
  }

  async getMyScholarships(): Promise<{ 
    success: boolean; 
    message: string;
    scholarships?: Scholarship[]; 
  }> {
    try {
      const response = await authService.authenticatedRequest('/scholarship/my-scholarships', {
        method: 'GET'
      }) as ScholarshipsResponse;

      return {
        success: response.success,
        message: response.message,
        scholarships: response.data?.scholarships,
      };
    } catch (error) {
      const handled = handleError(error);
      logger.error('Get my scholarships error:', handled.raw);
      return {
        success: false,
        message: handled.message
      };
    }
  }
}

export const scholarshipManagementService = new ScholarshipManagementService();