import { useQuery } from '@tanstack/react-query';
import { profileService } from '@/services/profile.service';
import { mockStudentUser } from '@/mocks/userProfile.mock';
import type { UserProfile } from '@/types/profile.types';

const USE_MOCK_DATA = import.meta.env.DEV;

/**
 * Custom React Query hook for fetching user profile by ID
 * Supports mock data mode for development/testing
 * Implements 15-minute stale time for profile caching
 * 
 * @param userId - The ID of the user to fetch profile for
 * @returns React Query result containing user profile
 */
export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async (): Promise<UserProfile> => {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Return mock data based on context - default to student
        return mockStudentUser;
      }

      const response = await profileService.getUserProfile(userId);
      if (!response.success || !response.profile) {
        throw new Error(response.message || 'Failed to load profile');
      }
      return response.profile;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    retry: 1,
    enabled: !!userId, // Only fetch if userId is provided
  });
};
