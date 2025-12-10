import { useQuery } from '@tanstack/react-query';
import { scholarshipApplicationService } from '@/services/scholarshipApplication.service';
import { scholarshipManagementService } from '@/services/scholarshipManagement.service';
import { 
  mockScholarshipForApplicants, 
  mockGetScholarshipApplications, 
} from '@/mocks/scholarshipApplicants.mock';

const USE_MOCK_DATA = true;

export const useScholarshipApplicants = (scholarshipId: string) => {
  const applicantsQuery = useQuery({
    queryKey: ['scholarship-applicants', scholarshipId],
    queryFn: async () => {
      if (!scholarshipId) throw new Error('Scholarship ID is required');

      if (USE_MOCK_DATA) {
        const response = await mockGetScholarshipApplications(scholarshipId);
        if (!response.success) {
           throw new Error(response.message || 'Failed to load applicants');
        }
        return response.applications || [];
      }

      const response = await scholarshipApplicationService.getScholarshipApplications(scholarshipId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to load applicants');
      }
      return response.applications || [];
    },
    enabled: !!scholarshipId,
  });

  const scholarshipQuery = useQuery({
    queryKey: ['scholarship', scholarshipId],
    queryFn: async () => {   
      if (!scholarshipId) throw new Error('Scholarship ID is required');

      if (USE_MOCK_DATA) {
        return mockScholarshipForApplicants;
      }

      const response = await scholarshipManagementService.getScholarshipById(scholarshipId);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.scholarship;
    },
    enabled: !!scholarshipId,
  });

  return { applicantsQuery, scholarshipQuery };
};
