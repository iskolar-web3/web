import { useState, useEffect } from 'react';
import type { Application } from '@/types/application.types';

type FilterType = 'applied' | 'past' | 'granted';

export function useApplications(initialApplications: Application[] = []) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('applied');

  useEffect(() => {
    let filtered = [...applications];

    if (selectedFilter === 'applied') {
      filtered = filtered.filter(
        (app) => app.status === 'pending' || app.status === 'shortlisted',
      );
    } else if (selectedFilter === 'past') {
      filtered = filtered.filter((app) => app.status === 'approved' || app.status === 'denied');
    } else if (selectedFilter === 'granted') {
      filtered = filtered.filter((app) => app.status === 'granted');
    }

    setFilteredApplications(filtered);
  }, [selectedFilter, applications]);  

  return {
    applications,
    setApplications,
    filteredApplications,
    selectedFilter,
    setSelectedFilter,
  };
}