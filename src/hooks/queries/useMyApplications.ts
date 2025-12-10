import { useQuery } from '@tanstack/react-query';
import { scholarshipApplicationService } from '@/services/scholarshipApplication.service';
import { mockApplications, mockApiDelay } from '@/mocks/applications.mock';
import type { Application } from '@/types/application.types';

const USE_MOCK_DATA = true;

export const useMyApplications = () => {
  return useQuery({
    queryKey: ['my-applications'],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await mockApiDelay(2000);
        return mockApplications.sort(
          (a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime(),
        );
      }

      const response = await scholarshipApplicationService.getMyApplications();
      if (!response.success) {
        throw new Error(response.message);
      }

      if (!response.applications) return [];

      const appsWithScholarship = response.applications.filter(
        (application) => application.scholarship,
      );
      
      return appsWithScholarship.sort(
        (a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime(),
      ) as Application[];
    },
    staleTime: 1000 * 60 * 5, 
  });
};
