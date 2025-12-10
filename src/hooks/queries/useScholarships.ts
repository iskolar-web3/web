import { useQuery } from '@tanstack/react-query';
import { scholarshipManagementService } from '@/services/scholarshipManagement.service';
import { mockScholarships, mockApiDelay } from '@/mocks/scholarships.mock';

const USE_MOCK_DATA = true;

export const useScholarships = () => {
  return useQuery({
    queryKey: ['scholarships'],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await mockApiDelay(2000);
        return mockScholarships;
      }

      const response = await scholarshipManagementService.getAllScholarships();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.scholarships || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
