import { useState, useEffect, useCallback } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import ScholarshipCard from "@/components/ScholarshipCard"; 
import Filters from "@/components/Filters"; 
import { Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import Toast from '@/components/Toast';
import type { Scholarship } from '@/types/scholarship.types';
import ScholarshipDetailsModal from '@/components/ScholarshipDetailsModal';
import { scholarshipManagementService } from '@/services/scholarship-management.service';

export const Route = createFileRoute('/_student/discover')({
  component: DiscoverScholarship,
});

function DiscoverScholarship() {
  const [sortBy, setSortBy] = useState('Newest');
  const [scholarshipType, setScholarshipType] = useState('All');
  const [purpose, setPurpose] = useState('All');
  const [sponsorType, setSponsorType] = useState('All');
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  // const [scholarships, setScholarships] = useState<Scholarship[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    type: 'success' as 'success' | 'error',
    title: '',
    message: '',
  });

  // const fetchScholarships = useCallback(async () => {
  //   try {
  //     const response = await scholarshipManagementService.getAllScholarships();
      
  //     if (response.success) {
  //       setScholarships(response.scholarships);
  //     } else {
  //       setToastConfig({
  //         type: 'error',
  //         title: 'Error',
  //         message: response.message,
  //       });
  //       setShowToast(true);
  //       setTimeout(() => {
  //         setShowToast(false)
  //       }, 2000);
  //     }
  //   } catch (error) {
  //     setToastConfig({
  //       type: 'error',
  //       title: 'Error',
  //       message: 'Failed to connect to server.'
  //     });
  //     setShowToast(true);
  //     setTimeout(() => {
  //       setShowToast(false)
  //     }, 2000);
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchScholarships();
  // }, [fetchScholarships]);

  // Mock data
  const scholarships: Scholarship[] = Array(23).fill(null).map((_, i) => ({
    status: 'active',
    title: 'CHED Merit Scholarship Program',
    type: 'Merit-Based',
    purpose: 'Tuition',
    sponsor: { 
      name: 'Sponsor name',
      email: 'sponsor@example.com',
      profile_url: 'src/logo.svg'
    },
    application_deadline: 'September 21, 2025',
    total_amount: 10000000,
    total_slot: 400,
    criteria: ['3rd Year', 'Male', 'BSCS', 'BSIT', 'BSIS', '1st Year'],
    required_documents: ['Certificate of Enrollment', 'Latest Report of Grades', 'Birth Certificate', 'Barangay ID', 'School ID', 'Government ID'],
    image_url: 'src/logo.svg',
    description: "The Commission on Higher Education (CHED) Merit Scholarship Program awards full or half merit scholarships to high-performing incoming college students in CHED-priority courses. It's designed to help academically excellent but financially needy students access tertiary education.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile/Tablet Layout */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="lg:hidden bg-white rounded-lg mb-2 px-4 py-3 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-[#111827]"/>
          <h2 className="text-sm md:text-md text-[#111827]">Filters</h2>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <div className="flex gap-4">
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
          </div>
        </div>
      </motion.div>

      {/* Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Filters Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block lg:col-span-1"
        >
          <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] sticky top-4 shadow-sm">
            <div className="flex items-center gap-1 mb-6">
              <Filter size={20}/>
              <h2 className="text-md text-[#111827]">Filters</h2>
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
              <label className="block text-sm text-[#111827] mb-2">Amount per Scholar</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                />
                <span className="flex items-center text-[#6B7280]">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="block text-sm text-[#111827] mb-2">Slots</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                />
                <span className="flex items-center text-[#6B7280]">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scholarship Cards */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-2.5">
            {scholarships.map((scholarship, index) => (
              <ScholarshipCard 
                key={index} 
                scholarship={scholarship} 
                index={index}
                onClick={() => setSelectedScholarship(scholarship)}
              />
            ))}
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