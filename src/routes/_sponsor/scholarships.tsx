import { useState, useMemo, useEffect, useCallback  } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Filter, AlertCircle, Loader2, X, GraduationCap, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SponsorFilterSelect from '@/components/SponsorFilters';
import SponsorScholarshipCard from '@/components/SponsorScholarshipCard';
import ScholarshipCardSkeleton from '@/components/ScholarshipCardSkeleton';
import SponsorScholarshipDetailsModal from '@/components/SponsorScholarshipDetailsModal';
import type { Scholarship } from '@/types/scholarship.types';
import { usePageTitle } from "@/hooks/use-page-title"
// import { scholarshipManagementService } from '@/services/scholarship-management.service';

export const Route = createFileRoute('/_sponsor/scholarships')({
  component: Scholarships,
});

function Scholarships() {
  usePageTitle("Scholarships")

  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState('Newest');
  const [scholarshipType, setScholarshipType] = useState('All');
  const [purpose, setPurpose] = useState('All');
  const [applicationsRange, setApplicationsRange] = useState({ min: '', max: '' });
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [slotRange, setSlotRange] = useState({ min: '', max: '' });
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [scholarshipToDelete, setScholarshipToDelete] = useState<Scholarship | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    type: 'success' as 'success' | 'error',
    title: '',
    message: '',
  });

  const handleViewApplicants = (scholarship: Scholarship) => {
    // navigate({ 
    //   to: "/scholarship/$id/applicants",
    //   params: { id: scholarship.scholarship_id }
    // });
  };

  const handleEdit = (scholarship: Scholarship) => {
    // navigate({ 
    //   to: "/scholarship/$id/edit",
    //   params: { id: scholarship.scholarship_id }
    // });
  };

  const handleDelete = (scholarship: Scholarship) => {
    setScholarshipToDelete(scholarship);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!scholarshipToDelete) return;

    try {
      setIsDeleting(true);
      // const response = await scholarshipManagementService.deleteScholarship(scholarshipToDelete.scholarship_id);
      
      // if(response.success) {
      //   setToastConfig({
      //     type: 'success',
      //     title: 'Success',
      //     message: 'Scholarship deleted.',
      //   });
      //   setShowToast(true);
      //   setTimeout(() => setShowToast(false), 2000);
        
      //   Refresh scholarships list
      //   fetchMyScholarships(); 
      // }
    } catch (error) {
      setToastConfig({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete scholarship.',
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setScholarshipToDelete(null);
    }
  };

  const fetchMyScholarships = useCallback(async () => {
    try {
      setLoading(true);

      await new Promise(resolve => setTimeout(resolve, 2000));
      setScholarships(mockScholarship);
  //     const response = await scholarshipManagementService.getMyScholarships();
  //
  //     if (response.success) {
  //       setScholarships(response.scholarships);
  //     }
    } catch (error) {
      setToastConfig({
        type: 'error',
        title: 'Error',
        message: 'Failed to connect to server.'
      });
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false)
      }, 2000);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  
  useEffect(() => {
    fetchMyScholarships();
  }, [fetchMyScholarships]);

  // Mock data - simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const mockScholarship: Scholarship[] = Array(5)
    .fill(null)
    .map(() => ({
      scholarship_id: '1',
      sponsor_id: '1',
      status: 'active',
      title: 'CHED Merit Scholarship Program',
      type: 'Merit-Based',
      purpose: 'Tuition',
      sponsor: {
        name: 'Sponsor name',
        email: 'sponsor@example.com',
        profile_url: 'src/logo.svg',
      },
      application_deadline: 'September 21, 2025',
      total_amount: 40000000,
      total_slot: 400,
      criteria: ['1st Year', 'LGU', 'Male', 'BSCS', 'BSIT', 'BSIS'],
      required_documents: ["Voter's Certificate", 'Birth Certificate', 'COR', 'Barangay ID'],
      image_url: 'src/logo.svg',
      description:
        "The Commission on Higher Education (CHED) Merit Scholarship Program awards full or half merit scholarships to high-performing incoming college students in CHED-priority courses. It's designed to help academically excellent but financially needy students access tertiary education.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      applications_count: 800,
      custom_form_fields: [
        {
          type: 'text',
          label: 'Full Name',
          required: true,
        },
        {
          type: 'email',
          label: 'Email Address',
          required: true,
        },
        {
          type: 'phone',
          label: 'Contact Number',
          required: true,
        },
        {
          type: 'dropdown',
          label: 'Year Level',
          required: true,
          options: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
        },
        {
          type: 'textarea',
          label: 'Why do you deserve this scholarship?',
          required: true,
        },
        {
          type: 'file',
          label: 'Upload Transcript of Records',
          required: true,
        },
      ],
    }));

  const filteredScholarships = useMemo(() => {
    return mockScholarship.filter((scholarship) => {
      const matchesType =
        scholarshipType === 'All' ||
        scholarship.type.toLowerCase() === scholarshipType.toLowerCase();

      const matchesPurpose =
        purpose === 'All' || scholarship.purpose.toLowerCase() === purpose.toLowerCase();

      const amountPerScholar =
        scholarship.total_amount && scholarship.total_slot
          ? scholarship.total_amount / scholarship.total_slot
          : 0;

      const matchesApplications =
        (!applicationsRange.min || (scholarship.applications_count !== undefined && scholarship.applications_count >= Number(applicationsRange.min))) &&
        (!applicationsRange.max || (scholarship.applications_count !== undefined && scholarship.applications_count <= Number(applicationsRange.max)));

      const matchesAmount =
        (!amountRange.min || amountPerScholar >= Number(amountRange.min)) &&
        (!amountRange.max || amountPerScholar <= Number(amountRange.max));

      const matchesSlots =
        (!slotRange.min || scholarship.total_slot >= Number(slotRange.min)) &&
        (!slotRange.max || scholarship.total_slot <= Number(slotRange.max));

      return matchesType && matchesPurpose && matchesApplications && matchesAmount && matchesSlots;
    });
  }, [mockScholarship, scholarshipType, purpose, applicationsRange, amountRange, slotRange]);

  return (
    <div className="min-h-screen">
      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden space-y-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#FEFEFD] rounded-md text-center p-2 border border-[#D3DCF6] shadow-sm"
        >
          <p className="text-base text-[#111827] tracking-wide">My Scholarships</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-md p-2 shadow-sm"
        >
          <button
            onClick={() => setShowFiltersModal(true)}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-[#3A52A6] text-white rounded-md hover:bg-[#2f4389] transition-colors"
          >
            <Filter size={16} />
            <span className="text-xs md:text-md">Filters</span>
          </button>
        </motion.div>
      </div>

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
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] sticky top-0 bg-white">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-[#111827]"/>
                  <h2 className="text-base text-[#111827]">Filters</h2>
                </div>
                <button
                  onClick={() => setShowFiltersModal(false)}
                  className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
                >
                  <X size={18} className="text-[#6B7280]" />
                </button>
              </div>

              {/* Filters Content */}
              <div className="overflow-y-auto p-4 pb-6 max-h-[calc(85vh-72px)]">
                <SponsorFilterSelect
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

                <SponsorFilterSelect
                  title="Scholarship Type"
                  options={['All', 'Merit-Based', 'Skill-Based']}
                  value={scholarshipType}
                  onChange={setScholarshipType}
                />

                <SponsorFilterSelect
                  title="Scholarship Purpose"
                  options={['All', 'Allowance', 'Tuition']}
                  value={purpose}
                  onChange={setPurpose}
                />

                <div className="mb-4">
                  <label className="block text-xs text-[#111827] mb-2">Applications</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={applicationsRange.min}
                      onChange={(event) =>
                        setApplicationsRange((prev) => ({ ...prev, min: event.target.value }))
                      }
                      className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                    />
                    <span className="flex items-center text-[#6B7280]">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={applicationsRange.max}
                      onChange={(event) =>
                        setApplicationsRange((prev) => ({ ...prev, max: event.target.value }))
                      }
                      className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs text-[#111827] mb-2">Amount per Scholar</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={amountRange.min}
                      onChange={(event) =>
                        setAmountRange((prev) => ({ ...prev, min: event.target.value }))
                      }
                      className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                    />
                    <span className="flex items-center text-[#6B7280]">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={amountRange.max}
                      onChange={(event) =>
                        setAmountRange((prev) => ({ ...prev, max: event.target.value }))
                      }
                      className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label className="block text-xs text-[#111827] mb-2">Slots</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={slotRange.min}
                      onChange={(event) =>
                        setSlotRange((prev) => ({ ...prev, min: event.target.value }))
                      }
                      className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                    />
                    <span className="flex items-center text-[#6B7280]">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={slotRange.max}
                      onChange={(event) =>
                        setSlotRange((prev) => ({ ...prev, max: event.target.value }))
                      }
                      className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="space-y-4 mt-4 lg:mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="hidden lg:block"
          >
            <div className='h-fit sticky top-4'>
              <div className="bg-[#FEFEFD] rounded-lg text-center p-4 border border-[#D3DCF6] shadow-sm mb-2">
                <p className="text-xl text-[#111827] tracking-wide">My Scholarships</p>
              </div>

              <div
                className="bg-[#FEFEFD] rounded-lg border border-[#D3DCF6] shadow-[0_20px_40px_rgba(17,24,39,0.04)]"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Filter size={20} className="text-[#111827]" />
                    <h2 className="text-md text-[#111827]">Filters</h2>
                  </div>

                  <SponsorFilterSelect
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

                  <SponsorFilterSelect
                    title="Scholarship Type"
                    options={['All', 'Merit-Based', 'Skill-Based']}
                    value={scholarshipType}
                    onChange={setScholarshipType}
                  />

                  <SponsorFilterSelect
                    title="Scholarship Purpose"
                    options={['All', 'Allowance', 'Tuition']}
                    value={purpose}
                    onChange={setPurpose}
                  />

                  <div className="mb-6">
                    <label className="block text-sm text-[#111827] mb-2">Applications</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={applicationsRange.min}
                        onChange={(event) =>
                          setApplicationsRange((prev) => ({ ...prev, min: event.target.value }))
                        }
                        className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                      />
                      <span className="flex items-center text-[#6B7280]">to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={applicationsRange.max}
                        onChange={(event) =>
                          setApplicationsRange((prev) => ({ ...prev, max: event.target.value }))
                        }
                        className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm text-[#111827] mb-2">Amount per Scholar</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={amountRange.min}
                        onChange={(event) =>
                          setAmountRange((prev) => ({ ...prev, min: event.target.value }))
                        }
                        className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                      />
                      <span className="flex items-center text-[#6B7280]">to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={amountRange.max}
                        onChange={(event) =>
                          setAmountRange((prev) => ({ ...prev, max: event.target.value }))
                        }
                        className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-[#111827] mb-2">Slots</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={slotRange.min}
                        onChange={(event) =>
                          setSlotRange((prev) => ({ ...prev, min: event.target.value }))
                        }
                        className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                      />
                      <span className="flex items-center text-[#6B7280]">to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={slotRange.max}
                        onChange={(event) =>
                          setSlotRange((prev) => ({ ...prev, max: event.target.value }))
                        }
                        className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
                        
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-2.5">
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <ScholarshipCardSkeleton key={`skeleton-${index}`} index={index} />
                ))
              ) : filteredScholarships.length === 0 ? (
                <div className="xl:col-span-2 flex flex-col items-center justify-center pt-24 md:pt-32">
                  <GraduationCap className="w-24 md:w-30 h-24 md:h-30 text-[#D1D5DB]" />
                  <p className="mt-5 text-lg md:text-xl text-[#9CA3AF]">No scholarships yet</p>
                  <p className="max-w-xl text-sm md:text-base text-[#9CA3AF] mt-2 mb-4 md:mb-6">
                    Create scholarship programs to help students succeed.
                  </p>
                  <button
                    onClick={() => navigate({ to: '/create' })}
                    className="inline-flex items-center cursor-pointer gap-2 px-4 py-2.5 bg-[#9CA3AF] text-[#F0F7FF] text-sm md:text-base rounded-md hover:bg-[#D1D5DB] hover:text-white transition-colors"
                  >
                    <Plus size={18} />
                    Create Scholarship
                  </button>
                </div>
              ) : (
                filteredScholarships.map((scholarship, index) => (
                  <SponsorScholarshipCard
                    key={`${scholarship.title}-${index}`}
                    scholarship={scholarship}
                    index={index}
                    onClick={() => setSelectedScholarship(scholarship)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewApplicants={handleViewApplicants}
                  />
                ))
              )}
            </div>
          </motion.section>
        </div>
      </div>

      {selectedScholarship && (
        <SponsorScholarshipDetailsModal
          scholarship={selectedScholarship}
          onClose={() => setSelectedScholarship(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewApplicants={handleViewApplicants}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && scholarshipToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-[#F0F7FF] rounded-xl shadow-2xl max-w-sm w-full p-5"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full text-[#EF4444] mb-1">
                <AlertCircle size={36}/>
              </div>
              <h3 className="text-lg text-[#111827] mb-2">Delete Scholarship</h3>
              <p className="text-sm text-[#6B7280] mb-6">
                Are you sure you want to delete "<strong>{scholarshipToDelete.title}</strong>"? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setScholarshipToDelete(null);
                }}
                disabled={isDeleting}
                className={`flex-1 px-4 py-2 cursor-pointer text-sm bg-[#F0F7FF] border border-[#D1D5DB] text-[#374151] rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 ${
                  isDeleting && "opacity-60 cursor-not-allowed"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className={`flex-1 px-4 py-2 cursor-pointer bg-[#EF4444] text-sm text-[#F0F7FF] rounded-md hover:bg-[#DC2626] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                  isDeleting && "opacity-60 cursor-not-allowed"
                }`}
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </span>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}