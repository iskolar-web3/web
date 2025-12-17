import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "@tanstack/react-router";
import { Calendar, Users, Coins, ChevronsRight, LockKeyhole, UserIcon } from 'lucide-react';
import type { Scholarship } from '@/types/scholarship.types';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { calculateAmountPerScholar, formatCurrency } from '@/utils/formatting.utils';
import { scholarshipApplicationService } from '@/services/scholarshipApplication.service';

/**
 * Scholarship details modal component for students
 * Displays detailed scholarship information with apply functionality
 * @param props - Component props
 * @param props.scholarship - Scholarship data to display
 * @param props.onClose - Callback function to close the modal
 * @returns Animated side panel modal with scholarship details and apply button
 */
export default function ScholarshipDetailsModal({ scholarship, onClose }: { scholarship: Scholarship; onClose: () => void }) {4
  const navigate = useNavigate();

  const [isExiting, setIsExiting] = useState(false);
  const { toast, showError } = useToast();

  const amountPerScholar = calculateAmountPerScholar(scholarship.total_amount, scholarship.total_slot);

  /**
   * Checks if the scholarship is closed
   * @returns True if scholarship status is 'closed'
   */
  const isClosed = useCallback(() => {
    return scholarship.status === 'closed';
  }, [scholarship?.status]);

  /**
   * Handles modal close with exit animation
   */
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 200); 
  };

  /**
   * Handles scholarship application
   * Checks if user has already applied and navigates to application form
   */
  const handleApply = useCallback(async () => {
    const response = await scholarshipApplicationService.checkApplicationExists(String(scholarship.scholarship_id));

    if (response.success) {
      showError('Already Applied', response.message, 2500);
      return;
    }

    if (isClosed()) {
      showError('Scholarship Closed', response.message, 2500);
      return;
    }

    navigate({ 
      to: '/scholarship/$id/apply', 
      params: { id: scholarship.scholarship_id }
    });
  }, [scholarship, isClosed, navigate]);

  return (
    <AnimatePresence>
      {toast && <Toast {...toast} />}
      
      <div className="fixed inset-0 z-50 flex items-center justify-end p-2">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isExiting ? 0 : 1 }}
          transition={{ duration: 0.1 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: isExiting ? '100%' : 0 }}
          transition={{ 
            type: 'spring', 
            damping: 35, 
            stiffness: 300,
            duration: 0.1
          }}
          className="relative w-full max-w-[30rem] h-full bg-card shadow-2xl rounded-lg overflow-y-auto custom-scrollbar"
        >
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border px-5 py-3 flex items-center justify-between z-10">
            <h2 className="text-lg text-primary flex items-center gap-2">
              <button
                onClick={handleClose}
                className="hover:bg-blue-100 rounded-lg transition-colors"
              >
                <ChevronsRight size={20} className="text-primary" />
              </button>
              Scholarship Details
            </h2>
          </div>

          <div className="p-5">
            {/* Status Badge */}
            <div className="flex items-center gap-2 mb-4">
              <div
                className={`w-2 h-2 rounded-full ${
                  scholarship.status === 'closed' ? 'bg-[#EF4444]' : 'bg-[#31D0AA]'
                }`}
              />
              <span
                className={`text-sm font-medium capitalize ${
                  scholarship.status === 'closed' ? 'text-[#EF4444]' : 'text-[#31D0AA]'
                }`}
              >
                {scholarship.status}
              </span>
            </div>

            {/* Image Banner */}
            <div className="relative w-full aspect-square mb-5 rounded-lg overflow-hidden shadow-[0_0_20px_2px_rgba(0,0,0,0.2)]">
              <img
                src={scholarship.image_url || "/logo.jpg"}
                alt={scholarship.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title and Badges */}
            <h1 className="text-[26px] text-primary mb-2">{scholarship.title}</h1>
            <div className="flex gap-2 mb-4">
              <span className="px-2.5 py-1 bg-[#F3F4F6] text-[#374151] text-xs rounded border border-border">
                {scholarship.type}
              </span>
              <span className="px-2.5 py-1 bg-[#F3F4F6] text-[#374151] text-xs rounded border border-border">
                {scholarship.purpose}
              </span>
            </div>

            {/* Sponsor and Deadline */}
            <div className="space-y-3 mb-4 text-[#6B7280]">
              <div className="flex items-center gap-2">
                <div className="w-5.5 h-5.5 rounded-full flex items-center justify-center flex-shrink-0">
                  {scholarship?.sponsor?.profile_url ? (
                    <img
                      src={scholarship?.sponsor?.profile_url}
                      alt={scholarship.sponsor.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-full h-full" />
                  )}
                </div>
                <span className="text-sm">{scholarship.sponsor?.name || 'Sponsor'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={22} />
                <span className="text-sm">{scholarship.application_deadline}</span>
              </div>
            </div>

            {/* Amount and Slots */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#F9FAFB] border border-border rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-[#6B7280] mb-1.5">
                  <Coins size={16} />
                  <span className="text-xs ">Amount</span>
                </div>
                <p className="text-base text-primary mb-0.5">
                  {amountPerScholar !== null
                    ? formatCurrency(amountPerScholar, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : '₱0.00'}
                </p>
                <p className="text-xs text-[#6B7280]">per scholar</p>
              </div>

              <div className="bg-[#F9FAFB] border border-border rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-[#6B7280] mb-1.5">
                  <Users size={16} />
                  <span className="text-xs ">Slots</span>
                </div>
                <p className="text-base text-primary mb-0.5">{scholarship.total_slot}</p>
                <p className="text-xs text-[#6B7280]">scholars</p>
              </div>
            </div>

            {/* Description */}
            {scholarship.description && (
              <div className="mb-6">
                <h3 className="text-sm text-primary mb-2">About Scholarship</h3>
                <p className="text-[#6B7280] text-xs leading-relaxed">{scholarship.description}</p>
              </div>
            )}

            {/* Eligibility Criteria */}
            <div className="mb-6">
              <h3 className="text-sm text-primary mb-2">Eligibility Criteria</h3>
              <div className="flex flex-wrap gap-2">
                {scholarship.criteria?.map((criterion: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-[#F9FAFB] text-[#374151] text-xs rounded border border-border"
                  >
                    {criterion}
                  </span>
                ))}
              </div>
            </div>

            {/* Required Documents */}
            <div className="mb-6">
              <h3 className="text-sm text-primary mb-2">Required Documents</h3>
              <div className="grid grid-cols-2 gap-2">
                {scholarship.required_documents?.map((doc: string, i: number) => (
                  <div
                    key={i}
                    className="px-3 py-1.5 bg-[#F9FAFB] text-[#374151] text-xs rounded border border-border text-center"
                  >
                    {doc}
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            {isClosed() ? (
              <div className="flex items-center gap-2.5 bg-[#FEE2E2] border border-[#FECACA] rounded-md p-3 mt-1.5 mb-2">
                <LockKeyhole size={16} className="text-[#DC2626] flex-shrink-0" />
                <p className="text-[11px] md:text-xs text-[#DC2626] leading-relaxed flex-1">
                  This scholarship program is no longer accepting applications.
                </p>
              </div>
            ) : (
              <button
                onClick={handleApply} 
                className="w-full bg-[#3A52A6] cursor-pointer text-tertiary py-3.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-100 hover:bg-[#2F4189] hover:shadow-lg hover:shadow-[#3A52A6]/30 active:scale-[0.98] shadow-md mt-1.5 mb-2"
              >
                Apply Now
                <span>→</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}