import { useState, useEffect, useCallback, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import ScholarshipCard from "@/components/ScholarshipCard"; 
import ScholarshipCardSkeleton from "@/components/ScholarshipCardSkeleton"; 
import Filters from "@/components/Filters"; 
import { Filter, X, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import type { Scholarship } from '@/types/scholarship.types';
import ScholarshipDetailsModal from '@/components/ScholarshipDetailsModal';
import { usePageTitle } from "@/hooks/usePageTitle"
import { handleError } from '@/lib/errorHandler';
import { logger } from "@/lib/logger";
import { mockScholarships, mockApiDelay } from '@/mocks/scholarships.mock';
import { scholarshipManagementService } from '@/services/scholarshipManagement.service';

const USE_MOCK_DATA = true;

export const Route = createFileRoute('/_student/discover')({
  component: DiscoverScholarship,
});

function DiscoverScholarship() {
  usePageTitle("Discover")

  const [sortBy, setSortBy] = useState('Newest');
  const [scholarshipType, setScholarshipType] = useState('All');
  const [purpose, setPurpose] = useState('All');
  const [sponsorType, setSponsorType] = useState('All');
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [slotRange, setSlotRange] = useState({ min: '', max: '' });
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);

  const [loading, setLoading] = useState(false);
  const { toast, showSuccess, showError } = useToast();

  const fetchScholarships = useCallback(async () => {
    try {
      setLoading(true);
      
      if (USE_MOCK_DATA) {
        // Mock data path
        await mockApiDelay(2000);
        setScholarships(mockScholarships);
      } else {
        const response = await scholarshipManagementService.getAllScholarships();
        
        if (response.success && response.scholarships) {
          setScholarships(response.scholarships);
        } else {
          showError('Error', response.message, 2500);
        }
      }
    } catch (error) {
      const handled = handleError(error, 'Failed to connect to server.');
      logger.error('Fetch scholarships error:', handled.raw);
      showError(`Error ${handled.code}`, handled.message, 2500);
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

  const filteredScholarships = useMemo(() => {
    return scholarships.filter((scholarship) => {
      const matchesType =
        scholarshipType === 'All' ||
        scholarship.type.toLowerCase() === scholarshipType.toLowerCase();

      const matchesPurpose =
        purpose === 'All' || scholarship.purpose.toLowerCase() === purpose.toLowerCase();

      const matchesSponsorType =
        sponsorType === 'All' || scholarship.sponsor?.name?.toLowerCase().includes(sponsorType.toLowerCase());

      const amountPerScholar =
        scholarship.total_amount && scholarship.total_slot
          ? scholarship.total_amount / scholarship.total_slot
          : 0;

      const matchesAmount =
        (!amountRange.min || amountPerScholar >= Number(amountRange.min)) &&
        (!amountRange.max || amountPerScholar <= Number(amountRange.max));

      const matchesSlots =
        (!slotRange.min || scholarship.total_slot >= Number(slotRange.min)) &&
        (!slotRange.max || scholarship.total_slot <= Number(slotRange.max));

      return matchesType && matchesPurpose && matchesSponsorType && matchesAmount && matchesSlots;
    });
  }, [scholarships, scholarshipType, purpose, sponsorType, amountRange, slotRange]);

  return (
    <div className="min-h-screen">
      {toast && <Toast {...toast} />}
      
      {/* Mobile/Tablet Layout */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="lg:hidden bg-card rounded-md mb-4 p-2 shadow-sm"
      >
        <button
          onClick={() => setShowFiltersModal(true)}
          className="flex items-center justify-center gap-1 w-full py-2 px-4 bg-[#3A52A6] text-tertiary rounded-md hover:bg-[#2f4389] transition-colors"
        >
          <Filter size={16} />
          <span className="text-xs md:text-md">Filters</span>
        </button>
      </motion.div>

      {/* Mobile Filters */}
      <AnimatePresence>
        {showFiltersModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFiltersModal(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[85vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-white">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-primary"/>
                  <h2 className="text-md text-primary">Filters</h2>
                </div>
                <button
                  onClick={() => setShowFiltersModal(false)}
                  className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
                >
                  <X size={20} className="text-[#6B7280]" />
                </button>
              </div>

              {/* Filters Content */}
              <div className="overflow-y-auto p-4 pb-6 max-h-[calc(85vh-72px)]">
                <Filters
                  title="Sort By"
                  options={[
                    'Newest',
                    'Oldest',
                    'Deadline: Nearest',
                    'Deadline: Farthest',
                    'Amount: High to Low',
                    'Amount: Low to High',
                    'Slots: Most to Least',
                    'Slots: Least to Most',
                    'A → Z',
                    'Z → A',
                  ]}
                  value={sortBy}
                  onChange={setSortBy}
                />
                <Filters
                  title="Scholarship Type"
                  options={['All', 'Merit-Based', 'Skill-Based']}
                  value={scholarshipType}
                  onChange={setScholarshipType}
                />
                <Filters
                  title="Scholarship Purpose"
                  options={['All', 'Allowance', 'Tuition']}
                  value={purpose}
                  onChange={setPurpose}
                />
                <Filters
                  title="Sponsor Type"
                  options={['All', 'Individual', 'Organization', 'Government']}
                  value={sponsorType}
                  onChange={setSponsorType}
                />

                <div className="mb-4">
                  <label className="block text-xs text-primary mb-2">Amount per Scholar</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={amountRange.min}
                      onChange={(event) =>
                        setAmountRange((prev) => ({ ...prev, min: event.target.value }))
                      }
                      className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                    />
                    <span className="flex items-center text-[#6B7280]">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={amountRange.max}
                      onChange={(event) =>
                        setAmountRange((prev) => ({ ...prev, max: event.target.value }))
                      }
                      className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label className="block text-xs text-primary mb-2">Slots</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={slotRange.min}
                      onChange={(event) =>
                        setSlotRange((prev) => ({ ...prev, min: event.target.value }))
                      }
                      className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                    />
                    <span className="flex items-center text-[#6B7280]">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={slotRange.max}
                      onChange={(event) =>
                        setSlotRange((prev) => ({ ...prev, max: event.target.value }))
                      }
                      className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Filters Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block lg:col-span-1"
        >
          <div className="bg-card rounded-lg p-6 border border-border sticky top-4 shadow-sm">
            <div className="flex items-center gap-1 mb-6">
              <Filter size={20}/>
              <h2 className="text-md text-primary">Filters</h2>
            </div>

            <Filters
              title="Sort By"
              options={['Newest', 'Oldest', 'Deadline: Nearest', 'Deadline: Farthest', 'Amount: High to Low', 'Amount: Low to High', 'Slots: Most to Least', 'Slots: Least to Most', 'A → Z', 'Z → A']}
              value={sortBy}
              onChange={setSortBy}
            />
            <Filters
              title="Scholarship Type"
              options={['All', 'Merit-Based', 'Skill-Based']}
              value={scholarshipType}
              onChange={setScholarshipType}
            />
            <Filters
              title="Scholarship Purpose"
              options={['All', 'Allowance', 'Tuition']}
              value={purpose}
              onChange={setPurpose}
            />
            <Filters
              title="Sponsor Type"
              options={['All', 'Individual', 'Organization', 'Government']}
              value={sponsorType}
              onChange={setSponsorType}
            />

            <div className="mb-4">
              <label className="block text-sm text-primary mb-2">Amount per Scholar</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={amountRange.min}
                  onChange={(event) =>
                    setAmountRange((prev) => ({ ...prev, min: event.target.value }))
                  }
                  className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                />
                <span className="flex items-center text-[#6B7280]">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={amountRange.max}
                  onChange={(event) =>
                    setAmountRange((prev) => ({ ...prev, max: event.target.value }))
                  }
                  className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="block text-sm text-primary mb-2">Slots</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={slotRange.min}
                  onChange={(event) =>
                    setSlotRange((prev) => ({ ...prev, min: event.target.value }))
                  }
                  className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                />
                <span className="flex items-center text-[#6B7280]">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={slotRange.max}
                  onChange={(event) =>
                    setSlotRange((prev) => ({ ...prev, max: event.target.value }))
                  }
                  className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scholarship Cards */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-2.5">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <ScholarshipCardSkeleton key={`skeleton-${index}`} index={index} />
              ))
            ) : filteredScholarships.length === 0 ? (
              <div className="lg:col-span-3 flex flex-col items-center justify-center pt-28 pt-36">
                <GraduationCap className="w-24 md:w-30 h-24 md:h-30 text-[#D1D5DB]" />
                <p className="mt-4 text-lg md:text-xl text-[#9CA3AF]">No scholarships found</p>
              </div>
            ) : (
              filteredScholarships.map((scholarship, index) => (
                <ScholarshipCard
                  key={`${scholarship.scholarship_id}-${index}`}
                  scholarship={scholarship}
                  index={index}
                  onClick={() => setSelectedScholarship(scholarship)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Scholarship Details Modal */}
      {selectedScholarship && (
        <ScholarshipDetailsModal
          scholarship={selectedScholarship}
          onClose={() => setSelectedScholarship(null)}
        />
      )}
    </div>
  );
}