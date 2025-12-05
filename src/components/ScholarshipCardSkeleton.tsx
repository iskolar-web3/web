import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

interface ScholarshipCardSkeletonProps {
  index?: number;
}

export default function ScholarshipCardSkeleton({ index = 0 }: ScholarshipCardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="bg-[#FEFEFD] rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-[#E5E7EB]">
        <div className="flex">
          {/* Image Skeleton */}
          <div className="w-32 h-32 bg-[#D1D5DB] flex-shrink-0 overflow-hidden">
            <Skeleton className="w-full h-full rounded-none bg-[#9CA3AF]" />
          </div>

          {/* Info Skeleton */}
          <div className="flex-1 px-4 py-2">
            {/* Title Skeleton */}
            <Skeleton className="h-6 w-full mb-1 bg-[#9CA3AF]" />
            
            {/* Badges Skeleton */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Skeleton className="h-5 w-20 bg-[#9CA3AF] rounded" />
              <Skeleton className="h-5 w-16 bg-[#9CA3AF] rounded" />
            </div>

            {/* Sponsor and Deadline Skeleton */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded-full bg-[#9CA3AF]" />
                <Skeleton className="h-3 w-24 bg-[#9CA3AF]" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded bg-[#9CA3AF]" />
                <Skeleton className="h-3 w-32 bg-[#9CA3AF]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Amount and Slots Skeleton */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {/* Amount Card Skeleton */}
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Skeleton className="w-4 h-4 rounded bg-[#D1D5DB]" />
              <Skeleton className="h-3 w-12 bg-[#D1D5DB]" />
            </div>
            <Skeleton className="h-5 w-20 mb-1 bg-[#D1D5DB]" />
            <Skeleton className="h-3 w-16 bg-[#D1D5DB]" />
          </div>

          {/* Slots Card Skeleton */}
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Skeleton className="w-4 h-4 rounded bg-[#D1D5DB]" />
              <Skeleton className="h-3 w-10 bg-[#D1D5DB]" />
            </div>
            <Skeleton className="h-5 w-12 mb-1 bg-[#D1D5DB]" />
            <Skeleton className="h-3 w-16 bg-[#D1D5DB]" />
          </div>
        </div>

        {/* Criteria and Documents Skeleton */}
        <div className="grid grid-cols-2 gap-6 text-sm">
          {/* Criteria Skeleton */}
          <div>
            <Skeleton className="h-3 w-16 mb-2 bg-[#D1D5DB]" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16 rounded bg-[#D1D5DB]" />
              <Skeleton className="h-6 w-20 rounded bg-[#D1D5DB]" />
              <Skeleton className="h-6 w-20 rounded bg-[#D1D5DB]" />
            </div>
          </div>

          {/* Required Documents Skeleton */}
          <div>
            <Skeleton className="h-3 w-28 mb-2 bg-[#D1D5DB]" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-24 rounded bg-[#D1D5DB]" />
              <Skeleton className="h-6 w-28 rounded bg-[#D1D5DB]" />
              <Skeleton className="h-6 w-20 rounded bg-[#D1D5DB]" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}