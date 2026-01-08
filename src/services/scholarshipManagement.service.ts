import { authService } from './auth.service';
import type { Scholarship, CustomFormField } from '@/types/scholarship.types';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';

/**
 * Data structure for creating or updating a scholarship
 */
interface ScholarshipData {
  /** Type of scholarship */
  type?: string;
  /** Purpose of the scholarship */
  purpose?: string;
  /** Scholarship title */
  title: string;
  /** Detailed description */
  description?: string;
  /** Total scholarship amount */
  total_amount: number;
  /** Total available slots */
  total_slot: number;
  /** Application deadline in ISO format */
  application_deadline: string;
  /** List of eligibility criteria */
  criteria: string[];
  /** List of required documents */
  required_documents: string[];
  /** Custom form fields for application */
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

/**
 * Service for managing scholarship operations
 * Handles CRUD operations for scholarships and sponsor-specific queries
 */
class ScholarshipManagementService {
  /**
   * Creates a new scholarship
   * @param scholarshipData - Scholarship information
   * @returns Promise resolving to success status, message, and optional scholarship data
   */
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

  /**
   * Updates an existing scholarship
   * @param scholarshipId - ID of the scholarship to update
   * @param data - Partial scholarship data to update, including optional status and custom form fields
   * @returns Promise resolving to success status, message, and updated scholarship data
   */
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

  /**
   * Permanently deletes a scholarship
   * @param scholarshipId - ID of the scholarship to delete
   * @returns Promise resolving to success status and message
   */
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

  /**
   * Archives a scholarship (soft delete)
   * @param scholarshipId - ID of the scholarship to archive
   * @returns Promise resolving to success status, message, and archived scholarship data
   */
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

  /**
   * Retrieves all scholarships in the system
   * @returns Promise resolving to success status, message, and array of scholarships
   */
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

  /**
   * Retrieves a specific scholarship by ID
   * @param scholarshipId - ID of the scholarship to retrieve
   * @returns Promise resolving to success status, message, and scholarship data
   */
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

  /**
   * Retrieves all scholarships created by the current sponsor
   * @returns Promise resolving to success status, message, and array of scholarships
   */
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
