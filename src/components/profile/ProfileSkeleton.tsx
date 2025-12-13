import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import type { JSX } from 'react';

/**
 * ProfileSkeleton component
 * Displays loading skeleton UI for the profile page
 * Shows animated placeholder elements while profile data is loading
 * @returns Loading skeleton component with animated placeholders
 */
export function ProfileSkeleton(): JSX.Element {
  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6 p-4 md:p-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-[#E0ECFF] overflow-hidden"
        >
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-6">
              <Skeleton className="w-24 h-24 md:w-28 md:h-28 rounded-full flex-shrink-0 bg-muted-foreground" />
              <div className="flex-1 text-center md:text-left w-full">
                <Skeleton className="h-8 w-full mb-3 bg-muted-foreground mx-auto md:mx-0" />
                <Skeleton className="h-5 w-24 mb-4 bg-muted-foreground mx-auto md:mx-0" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48 bg-muted-foreground mx-auto md:mx-0" />
                  <Skeleton className="h-4 w-40 bg-muted-foreground mx-auto md:mx-0" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-[#E0ECFF] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-40 bg-muted-foreground" />
            <Skeleton className="h-9 w-9 rounded-lg bg-muted-foreground" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`field-${index}`}>
                <Skeleton className="h-4 w-24 mb-2 bg-muted-foreground" />
                <Skeleton className="h-11 w-full bg-muted-foreground rounded-lg" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}