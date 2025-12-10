import { useState, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Calendar, Users, Coins, Files, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useApplications } from '@/hooks/useApplications';
import { ApplicationDetailsModal, statusStyles } from '@/components/ApplicationDetailsModal';
import ScholarshipCardSkeleton from "@/components/ScholarshipCardSkeleton";
import { Skeleton } from '@/components/ui/skeleton';
import { handleError } from '@/lib/errorHandler';
import { logger } from "@/lib/logger";
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/Toast';
import type { Application } from '@/types/application.types';
import { formatDate, formatTime, formatAmountPerScholar } from '@/utils/formatting';
import { mockApplications, mockApiDelay } from '@/mocks/applications.mock';
import { scholarshipApplicationService } from '@/services/scholarshipApplication.service';

const USE_MOCK_DATA = true;

export const Route = createFileRoute('/_student/home')({
  component: Home,
});

type FilterType = 'applied' | 'past' | 'granted';

function Home() {
  usePageTitle('Home');

  const navigate = useNavigate();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast, showError } = useToast();

  const {
    applications,
    setApplications,
    filteredApplications,
    selectedFilter,
    setSelectedFilter,
  } = useApplications();

  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      try {
        if (USE_MOCK_DATA) {
          // Mock data path
          await mockApiDelay(2000);
          setApplications(
            mockApplications.sort(
              (a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime(),
            ),
          );
        } else {
          const response = await scholarshipApplicationService.getMyApplications();
          if (response.success && response.applications) {
            const appsWithScholarship = response.applications.filter(
              (application) => application.scholarship,
            );
            setApplications(
              appsWithScholarship.sort(
                (a, b) =>
                  new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime(),
              ) as Application[],
            );
          }
        }
      } catch (error) {
        const handled = handleError(error, 'Failed to connect to server.');
        logger.error('Fetch applications error:', handled.raw);
        showError(`Error ${handled.code}`, handled.message, 2500);
      } finally {
        setLoading(false);
      }
    };
    loadApplications();
  }, [setApplications]);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'applied', label: 'Applied' },
    { key: 'past', label: 'Past' },
    { key: 'granted', label: 'Granted' },
  ];

  return (
    <div className="min-h-screen">
      {toast && <Toast {...toast} />}
      
      <div className="max-w-[44rem] mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl text-primary">Applications</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative rounded-md bg-[#3A52A6] p-0.75 shadow-sm border border-[#4F63C4]">
              <div className="flex text-xs md:text-sm">
                {filters.map((filter) => {
                  const isActive = selectedFilter === filter.key;
                  return (
                    <button
                      key={filter.key}
                      type="button"
                      onClick={() => setSelectedFilter(filter.key)}
                      className={`relative px-4 py-1.5 rounded-sm transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#607EF2] text-tertiary shadow-md'
                          : 'text-[#E5E7EB]/80 hover:text-tertiary'
                      }`}
                    >
                      <span>{filter.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* List / States */}
        <div>
          {loading ? (
            // Show skeleton loaders when loading
            Array.from({ length: 4 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="flex gap-4 md:gap-6">
                {/* Desktop: Date/Time */}
                <div className="hidden md:flex gap-4">
                  <div className="flex flex-col items-start w-30 flex-shrink-0 pt-1">
                    <div className="text-left space-y-1">
                      <Skeleton className="h-4 w-30 bg-muted-foreground" />
                      <Skeleton className="h-3 w-20 bg-muted-foreground" />
                    </div>
                  </div>

                  {/* Timeline dot and line */}
                  <div className="relative flex flex-col items-center pt-1">
                    <div className="w-3 h-3 rounded-full mr-[1px] bg-[#3A52A6] shadow-[0_0_0_4px_rgba(63,81,181,0.22)] z-10" />
                    <div
                      className={`w-px flex-1 border-l border-dashed border-[#3A52A6]/60 ${
                        index === 3 ? 'opacity-70' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Mobile/Tablet */}
                <div className="md:hidden relative flex flex-col items-center pt-1">
                  <div className="w-3 h-3 rounded-full bg-[#3A52A6] shadow-[0_0_0_4px_rgba(63,81,181,0.22)] z-10" />
                  <div
                    className={`mt-1 w-px flex-1 border-l border-dashed border-[#3A52A6]/60 ${
                      index === 3 ? 'opacity-70' : ''
                    }`}
                  />
                </div>

                {/* Card column */}
                <div className="flex-1 mb-3">
                  {/* Mobile/Tablet: Date/Time */}
                  <div className="md:hidden mb-2 text-left space-y-1">
                    <Skeleton className="h-3 w-28 bg-muted-foreground" />
                    <Skeleton className="h-[11px] w-16 bg-muted-foreground" />
                  </div>

                  <ScholarshipCardSkeleton index={index} />
                </div>
              </div>
            ))
          ) : filteredApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Files className="w-24 md:w-30 h-24 md:h-30 text-[#D1D5DB]" />
              <h2 className="text-lg md:text-xl text-[#9CA3AF] mt-8 mb-2">No applications yet</h2>
              <p className="max-w-md text-sm md:text-base text-[#9CA3AF] mb-4 md:mb-8">
                You have to apply for scholarships to see them listed here.
              </p>
              <button
                onClick={() => navigate({ to: '/discover' })}
                className="inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 bg-[#9CA3AF] text-tertiary text-sm md:text-base rounded-md hover:bg-muted-foreground hover:text-tertiary text-tertiary transition-colors"
              >
                Explore Scholarships
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div>
              {filteredApplications.map((application, index) => (
                <div key={application.scholarship_application_id} className="flex gap-4 md:gap-6">
                  {/* Desktop: Date/Time */}
                  <div className="hidden md:flex gap-4">
                    <div className="flex flex-col items-start w-30 flex-shrink-0 pt-1">
                      <div className="text-left">
                        <div className="text-sm text-primary">
                          {formatDate(application.applied_at)}
                        </div>
                        <div className="text-xs text-[#6B7280]">
                          {formatTime(application.applied_at)}
                        </div>
                      </div>
                    </div>

                    {/* Timeline dot and line */}
                    <div className="relative flex flex-col items-center pt-1">
                      <div className="w-3 h-3 rounded-full mr-[1px] bg-[#3A52A6] shadow-[0_0_0_4px_rgba(63,81,181,0.22)] z-10" />
                      <div
                        className={`w-px flex-1 border-l border-dashed border-[#3A52A6]/60 ${
                          index === filteredApplications.length - 1 ? 'opacity-70' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Mobile/Tablet */}
                  <div className="md:hidden relative flex flex-col items-center pt-1">
                    <div className="w-3 h-3 rounded-full bg-[#3A52A6] shadow-[0_0_0_4px_rgba(63,81,181,0.22)] z-10" />
                    <div
                      className={`mt-1 w-px flex-1 border-l border-dashed border-[#3A52A6]/60 ${
                        index === filteredApplications.length - 1 ? 'opacity-70' : ''
                      }`}
                    />
                  </div>

                  {/* Card column */}
                  <div className="flex-1 mb-3">
                    {/* Mobile/Tablet: Date/Time */}
                    <div className="md:hidden mb-2 text-left">
                      <div className="text-xs text-primary">
                        {formatDate(application.applied_at)}
                      </div>
                      <div className="text-[11px] text-[#6B7280]">
                        {formatTime(application.applied_at)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedApplication(application)}
                      className="w-full text-left"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ 
                          scale: 0.99,
                          transition: { duration: 0.2 }
                        }}
                        className="overflow-hidden rounded-lg bg-white hover:border-[#3A52A6] shadow-sm border border-[#E0ECFF] hover:shadow-md transition-shadow cursor-pointer transition-colors"
                      >
                        {/* Header */}
                        <div className="flex bg-[#3A52A6]">
                          <div className="relative w-32 h-32 flex-shrink-0 bg-[#1D2A5B]">
                            <img
                              src={application.scholarship.image_url}
                              alt={application.scholarship.title}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="flex-1 px-3 py-2 text-[#F9FAFB]">
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1">
                                <h3 className="text-lg md:text-xl line-clamp-1">
                                  {application.scholarship.title}
                                </h3>

                                <div className="flex flex-wrap gap-2 mb-3">
                                  <span className="px-2 py-0.5 bg-white/90 text-secondary text-[10px] md:text-[11px] rounded">
                                    {application.scholarship.type}
                                  </span>
                                  <span className="px-2 py-0.5 bg-white/90 text-secondary text-[10px] md:text-[11px] rounded">
                                    {application.scholarship.purpose}
                                  </span>
                                </div>

                                <div className="space-y-1.5 text-xs">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={application.scholarship.sponsor.profile_url}
                                      alt="Sponsor Profile"
                                      className="w-4 h-4 bg-white/20 rounded-full flex-shrink-0 object-cover"
                                    />
                                    <span>{application.scholarship.sponsor.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>{application.scholarship.application_deadline}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-1 mt-1">
                                <div
                                  className={`inline-flex items-center gap-1 rounded-sm border px-3 py-0.5 text-[11px] ${
                                    statusStyles[application.status].bg
                                  } ${statusStyles[application.status].text} ${
                                    statusStyles[application.status].border
                                  }`}
                                >
                                  <span>{statusStyles[application.status].label}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="space-y-4 bg-white px-4 py-3 md:px-5 md:py-4">
                          <div className="grid grid-cols-2 gap-2 md:gap-3">
                            <div className="rounded-xl border border-border bg-[#F9FAFB] p-3">
                              <div className="mb-1 flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                                <Coins className="h-3.5 w-3.5" />
                                <span>Amount</span>
                              </div>
                              <p className="text-sm text-primary">
                                {formatAmountPerScholar(
                                  application.scholarship.total_amount,
                                  application.scholarship.total_slot,
                                  { locale: 'en-PH' }
                                )}
                              </p>
                              <p className="text-[11px] text-[#6B7280]">per scholar</p>
                            </div>

                            <div className="rounded-xl border border-border bg-[#F9FAFB] p-3">
                              <div className="mb-1 flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                                <Users className="h-3.5 w-3.5" />
                                <span>Slots</span>
                              </div>
                              <p className="text-sm text-primary">
                                {application.scholarship.total_slot}
                              </p>
                              <p className="text-[11px] text-[#6B7280]">scholars</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 md:gap-6">
                            <div>
                              <h4 className="mb-1.5 text-xs tracking-wide text-[#6B7280]">
                                Criteria
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {application.scholarship.criteria.slice(0, 2).map((item, i) => (
                                  <span
                                    key={i}
                                    className="px-2.5 py-1 bg-[#F9FAFB] text-[#374151] text-[10px] md:text-[11px] rounded border border-border"
                                  >
                                    {item}
                                  </span>
                                ))}
                                {application.scholarship.criteria.length > 2 && (
                                  <span className="px-2.5 py-1 bg-[#F9FAFB] text-[#374151] text-[10px] md:text-[11px] rounded border border-border">
                                    + {application.scholarship.criteria.length - 2} more
                                  </span>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="mb-1.5 text-xs tracking-wide text-[#6B7280]">
                                Required Documents
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {application.scholarship.required_documents
                                  .slice(0, 2)
                                  .map((item, i) => (
                                    <span
                                      key={i}
                                      className="px-2.5 py-1 bg-[#F9FAFB] text-[#374151] text-[10px] md:text-[11px] rounded border border-border"
                                    >
                                      {item}
                                    </span>
                                  ))}
                                {application.scholarship.required_documents.length > 2 && (
                                  <span className="px-2.5 py-1 bg-[#F9FAFB] text-[#374151] text-[10px] md:text-[11px] rounded border border-border">
                                    + {application.scholarship.required_documents.length - 2} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedApplication && (
          <ApplicationDetailsModal
            application={selectedApplication}
            onClose={() => setSelectedApplication(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}