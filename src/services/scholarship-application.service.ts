import { authService } from './auth.service';
import { handleError, safeParseJSON } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';
import type { Scholarship } from '@/types/scholarship.types';

const API_URL = import.meta.env.VITE_API_URL;

export interface ApplicationFormData {
  scholarship_id: string;
  custom_form_response: Array<{ label: string; value: any }>; 
}

export interface ApplicationFileUpload {
  fieldKey: string;
  files: Array<{
    uri: string;
    name: string;
    mimeType: string;
    size?: number;
  }>;
}

export interface ScholarshipApplication {
  scholarship_application_id: string;
  student_id: string;
  scholarship_id: string;
  status: 'pending' | 'shortlisted' | 'approved' | 'denied' | 'granted';
  remarks?: string;
  custom_form_response: Array<{ label: string; value: any }>; 
  applied_at: string;
  updated_at: string;
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
  scholarship: Scholarship;
}

class ScholarshipApplicationService {
  async submitApplication(
    scholarshipId: string,
    customFormResponse: Array<{ label: string; value: any }> 
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
      });

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

      const response = await fetch(
        `${API_URL}/scholarship-application/${applicationId}/upload-files`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        }
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

  async getMyApplications(): Promise<{
    success: boolean;
    message: string;
    applications?: ScholarshipApplication[];
  }> {
    try {
      const response = await authService.authenticatedRequest('/scholarship-application/my-applications', {
        method: 'GET',
      });

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
      );

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

  async checkApplicationExists(scholarshipId: string): Promise<{
    success: boolean;
    message: string;
    exists: boolean;
    application?: ScholarshipApplication;
  }> {
    try {
      const response = await authService.authenticatedRequest(
        `/scholarship-application/check/${scholarshipId}`,
        {
          method: 'GET',
        }
      );

      return {
        success: response.success,
        message: response.message,
        exists: response.data?.exists || false,
        application: response.data?.application,
      };
    } catch (error) {
      const handled = handleError(error, 'Failed to check application');
      logger.error('Check application error:', handled.raw);
      return {
        success: false,
        exists: false,
        message: handled.message,
      };
    }
  }

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
      );

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
      );

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

  async bulkUpdateApplicationStatus(
    applicationIds: string[],
    status: 'shortlisted' | 'approved' | 'denied' | 'granted',
    remarks?: string
  ): Promise<{
    success: boolean;
    message: string;
    updated_count?: number;
    applications?: any[];
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
      );

      return {
        success: response.success,
        message: response.message,
        updated_count: response.data?.updated_count,
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