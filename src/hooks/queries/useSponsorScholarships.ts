import { useQuery } from '@tanstack/react-query';
import { scholarshipManagementService } from '@/services/scholarshipManagement.service';
import { mockSponsorScholarships, mockApiDelay } from '@/mocks/scholarships.mock';

const USE_MOCK_DATA = true;

export const useSponsorScholarships = () => {
  return useQuery({
    queryKey: ['my-scholarships'],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await mockApiDelay(2000);
        return mockSponsorScholarships;
      }

      const response = await scholarshipManagementService.getMyScholarships();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.scholarships || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
