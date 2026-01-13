import { useQuery } from '@tanstack/react-query';
import { scholarshipApplicationService } from '@/services/scholarshipApplication.service';
import { mockApplications, mockApiDelay } from '@/mocks/applications.mock';
import type { ApplicationOld } from '@/types/application.types';
import { getMyApplicationsQuery } from '@/lib/scholarship/api';
import type { GetApplicationsQueryParam } from '@/lib/scholarship/model';

const USE_MOCK_DATA = true;

/**
 * Custom React Query hook for fetching current student's scholarship applications
 * Supports mock data mode for development/testing
 * Automatically filters out applications without scholarship data and sorts by date (newest first)
 * Implements 5-minute stale time for application data
 * 
 * @returns React Query result containing array of student's applications, sorted by applied_at date
 */
export const useMyApplications = (param: GetApplicationsQueryParam) => {
  return useQuery(getMyApplicationsQuery(param));
};
