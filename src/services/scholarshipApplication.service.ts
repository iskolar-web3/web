import { authService } from './auth.service';
import { handleError, safeParseJSON } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';
import type { Scholarship } from '@/types/scholarship.types';
import type { FormFieldResponse } from '@/types/form.types';
import { fetchWithTimeout } from '@/utils/fetchWithTimeout';

const API_URL = import.meta.env.VITE_API_URL;
const DEFAULT_TIMEOUT = 10000;

/**
 * Application form data structure for submitting a scholarship application
 */
export interface ApplicationFormData {
  /** ID of the scholarship being applied to */
  scholarship_id: string;
  /** Custom form field responses */
  custom_form_response: FormFieldResponse[]; 
}

/**
 * File upload data structure for application documents
 */
export interface ApplicationFileUpload {
  /** Form field key for the file upload */
  fieldKey: string;
  /** Array of files to upload */
  files: Array<{
    /** Base64 encoded file data */
    uri: string;
    /** File name */
    name: string;
    /** MIME type of the file */
    mimeType: string;
    /** File size in bytes (optional) */
    size?: number;
  }>;
}

/**
 * Scholarship application data structure
 */
export interface ScholarshipApplication {
  /** Unique application ID */
  scholarship_application_id: string;
  /** ID of the student who applied */
  student_id: string;
  /** ID of the scholarship */
  scholarship_id: string;
  /** Application status */
  status: 'pending' | 'shortlisted' | 'approved' | 'denied' | 'granted';
  /** Optional remarks from the sponsor */
  remarks?: string;
  /** Custom form field responses */
  custom_form_response: FormFieldResponse[]; 
  /** Timestamp when application was submitted */
  applied_at: string;
  /** Timestamp when application was last updated */
  updated_at: string;
  /** Student information */
  student: {
    student_id: string;
    full_name: string;
    gender?: string;
    date_of_birth: string;
    contact_number: string;
    user: {
      email: string;
      profile_url?: string;
    };
  };
  /** Scholarship information */
  scholarship: Scholarship;
}

interface ApplicationResponse {
  success: boolean;
  message: string;
  data?: {
    application?: ScholarshipApplication;
  };
}

interface ApplicationsResponse {
  success: boolean;
  message: string;
  data?: {
    applications?: ScholarshipApplication[];
  };
}

/**
 * Service for managing scholarship applications
 * Handles application submission, file uploads, and status management
 */
class ScholarshipApplicationService {
  /**
   * Submits a new scholarship application
   * @param scholarshipId - ID of the scholarship to apply for
   * @param customFormResponse - Array of custom form field responses
   * @returns Promise resolving to success status, message, and optional application data
   */
  async submitApplication(
    scholarshipId: string,
    customFormResponse: FormFieldResponse[] 
  ): Promise<{
    success: boolean;
    message: string;
    application?: ScholarshipApplication;
  }> {
    try {
      const response = await authService.authenticatedRequest('/scholarship-application/submit', {
        method: 'POST',
        body: JSON.stringify({
          scholarship_id: scholarshipId,
          custom_form_response: customFormResponse,
        }),
      }) as ApplicationResponse;

      return {
        success: response.success,
        message: response.message,
        application: response.data?.application,
      };
    } catch (error) {
      const handled = handleError(error, 'Failed to submit application');
      logger.error('Submit application error:', handled.raw);
      return {
        success: false,
        message: handled.message,
      };
    }
  }

  /**
   * Uploads files for a specific application field
   * Converts base64 encoded files to Blob and uploads via multipart/form-data
   * @param applicationId - ID of the application
   * @param fieldKey - Form field key for the file upload
   * @param files - Array of files with base64 encoded data
   * @returns Promise resolving to success status, message, and optional file URLs
   */
  async uploadApplicationFiles(
    applicationId: string,
    fieldKey: string,
    files: Array<{
      uri: string;
      name: string;
      mimeType: string;
      size?: number;
    }>
  ): Promise<{
    success: boolean;
    message: string;
    file_urls?: string[];
  }> {
    try {
      const token = await authService.getToken();

      if (!token) {
        return {
          success: false,
          message: 'No authentication token found',
        };
      }

      const formData = new FormData();
      formData.append('field_key', fieldKey);

      // Convert base64 to Blob and append to FormData
      files.forEach((file, index) => {
        const filename = file.name || `file_${index}.${file.mimeType?.split('/')[1] || 'bin'}`;
        
        // Convert base64 to Blob
        const byteString = atob(file.uri); // Decode base64
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        
        const blob = new Blob([ab], { type: file.mimeType || 'application/octet-stream' });
        
        // Append as File to FormData
        formData.append('files', blob, filename);
      });

      console.log(`Uploading ${files.length} file(s) for field: ${fieldKey}`);

      const response = await fetchWithTimeout(
        `${API_URL}/scholarship-application/${applicationId}/upload-files`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        },
        DEFAULT_TIMEOUT
      );

      const result = await safeParseJSON<{ message?: string; file_urls?: string[] }>(response);

      return {
        success: response.ok,
        message: result?.message || (response.ok ? 'Files uploaded successfully' : 'Failed to upload files'),
        file_urls: result?.file_urls,
      };
    } catch (error) {
      const handled = handleError(error, 'Failed to upload files');
      logger.error('File upload error:', handled.raw);
      return {
        success: false,
        message: handled.message,
      };
    }
  }

  /**
   * Retrieves all applications submitted by the current student
   * @returns Promise resolving to success status, message, and array of applications
   */
  async getMyApplications(): Promise<{
    success: boolean;
    message: string;
    applications?: ScholarshipApplication[];
  }> {
    try {
      const response = await authService.authenticatedRequest('/scholarship-application/my-applications', {
        method: 'GET',
      }) as ApplicationsResponse;

      return {
        success: response.success,
        message: response.message,
        applications: response.data?.applications,
      };
    } catch (error) {
      const handled = handleError(error, 'Failed to fetch applications');
      logger.error('Fetch applications error:', handled.raw);
      return {
        success: false,
        message: handled.message,
      };
    }
  }

  /**
   * Retrieves a specific application by ID
   * @param applicationId - ID of the application to retrieve
   * @returns Promise resolving to success status, message, and application data
   */
  async getApplicationById(applicationId: string): Promise<{
    success: boolean;
    message: string;
    application?: ScholarshipApplication;
  }> {
    try {
      const response = await authService.authenticatedRequest(
        `/scholarship-application/${applicationId}`,
        {
          method: 'GET',
        }
      ) as ApplicationResponse;

      return {
        success: response.success,
        message: response.message,
        application: response.data?.application,
      };
    } catch (error) {
      const handled = handleError(error, 'Failed to fetch application');
      logger.error('Fetch application error:', handled.raw);
      return {
        success: false,
        message: handled.message,
      };
    }
  }

  /**
   * Checks if an application exists for a specific scholarship
   * @param scholarshipId - ID of the scholarship to check
   * @returns Promise resolving to success status, message, and optional existing application
   */
  async checkApplicationExists(scholarshipId: string): Promise<{
    success: boolean;
    message: string;
    application?: ScholarshipApplication;
  }> {
    try {
      const response = await authService.authenticatedRequest(
        `/scholarship-application/check/${scholarshipId}`,
        {
          method: 'GET',
        }
      ) as ApplicationResponse;

      return {
        success: response.success,
        message: response.message,
        application: response.data?.application,
      };
    } catch (error) {
      const handled = handleError(error, 'Failed to check application');
      logger.error('Check application error:', handled.raw);
      return {
        success: false,
        message: handled.message,
      };
    }
  }

  /**
   * Retrieves all applications for a specific scholarship (sponsor view)
   * @param scholarshipId - ID of the scholarship
   * @returns Promise resolving to success status, message, and array of applications
   */
  async getScholarshipApplications(scholarshipId: string): Promise<{
    success: boolean;
    message: string;
    applications?: ScholarshipApplication[];
  }> {
    try {
      const response = await authService.authenticatedRequest(
        `/scholarship-application/scholarship/${scholarshipId}`,
        {
          method: 'GET',
        }
      ) as ApplicationsResponse;

      return {
        success: response.success,
        message: response.message,
        applications: response.data?.applications,
      };
    } catch (error) {
      const handled = handleError(error, 'Failed to fetch applications');
      logger.error('Fetch scholarship applications error:', handled.raw);
      return {
        success: false,
        message: handled.message,
      };
    }
  }

  /**
   * Updates the status of a single application
   * @param applicationId - ID of the application to update
   * @param status - New status for the application
   * @param remarks - Optional remarks from the sponsor
   * @returns Promise resolving to success status, message, and updated application data
   */
  async updateApplicationStatus(
    applicationId: string,
    status: 'shortlisted' |'approved' | 'denied',
    remarks?: string
  ): Promise<{
    success: boolean;
    message: string;
    application?: ScholarshipApplication;
  }> {
    try {
      const response = await authService.authenticatedRequest(
        `/scholarship-application/${applicationId}/status`,
        {
          method: 'PUT',
          body: JSON.stringify({
            status,
            remarks,
          }),
        }
      ) as ApplicationResponse;

      return {
        success: response.success,
        message: response.message,
        application: response.data?.application,
      };
    } catch (error) {
      const handled = handleError(error, 'Failed to update application status');
      logger.error('Update application status error:', handled.raw);
      return {
        success: false,
        message: handled.message,
      };
    }
  }

  /**
   * Updates the status of multiple applications at once
   * @param applicationIds - Array of application IDs to update
   * @param status - New status for all applications
   * @param remarks - Optional remarks to apply to all applications
   * @returns Promise resolving to success status, message, and array of updated applications
   */
  async bulkUpdateApplicationStatus(
    applicationIds: string[],
    status: 'shortlisted' | 'approved' | 'denied' | 'granted',
    remarks?: string
  ): Promise<{
    success: boolean;
    message: string;
    applications?: ScholarshipApplication[];
  }> {
    try {
      const response = await authService.authenticatedRequest(
        '/scholarship-application/bulk/status',
        {
          method: 'PUT',
          body: JSON.stringify({
            application_ids: applicationIds,
            status,
            remarks,
          }),
        }
      ) as ApplicationsResponse;

      return {
        success: response.success,
        message: response.message,
        applications: response.data?.applications,
      };
    } catch (error) {
      const handled = handleError(error, 'Failed to update application statuses');
      logger.error('Bulk update application status error:', handled.raw);
      return {
        success: false,
        message: handled.message,
      };
    }
  }

  /* 
    Soon to be implemented feature 
  */
  // async rankScholarshipApplications(scholarshipId: string): Promise<{
  //   success: boolean;
  //   message: string;
  //   ranked_applicants?: Array<{
  //     scholarship_application_id: string;
  //     rank: number;
  //     score: number;
  //     evaluationDetails: {
  //       criteriaMatches: number;
  //       criteriaTotal: number;
  //       formCompleteness: number;
  //       bonusPoints: number;
  //       explanation: string[];
  //     };
  //     custom_form_response: Array<{ label: string; value: any }>;
  //     student?: {
  //       student_id: string;
  //       full_name: string;
  //       gender?: string;
  //       date_of_birth: string;
  //       contact_number: string;
  //       user: {
  //         email: string;
  //         profile_url?: string;
  //       };
  //     };
  //   }>;
  // }> {
  //   try {
  //     const response = await authService.authenticatedRequest(
  //       `/scholarship-application/scholarship/${scholarshipId}/rank`,
  //       {
  //         method: 'GET',
  //       }
  //     );

  //     return {
  //       success: response.success,
  //       message: response.message,
  //       ranked_applicants: response.data?.ranked_applicants,
  //     };
  //   } catch (error) {
  //     console.error('Rank applicants error:', error);
  //     return {
  //       success: false,
  //       message: error instanceof Error ? error.message : 'Failed to rank applicants',
  //     };
  //   }
  // }
}

export const scholarshipApplicationService = new ScholarshipApplicationService();