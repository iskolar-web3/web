import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Coins, ChevronsRight, Images } from 'lucide-react';
import { useState } from 'react';
import type { Scholarship } from '@/types/scholarship.types';

interface ScholarshipFullPreviewModalProps {
  scholarship: Partial<Scholarship>;
  onClose: () => void;
  isPreview?: boolean;
}

export default function ScholarshipFullPreviewModal({
  scholarship,
  onClose,
  isPreview = false,
}: ScholarshipFullPreviewModalProps) {
  const [isExiting, setIsExiting] = useState(false);

  const amountPerScholar = (() => {
    if (scholarship.total_amount && scholarship.total_slot) {
      const total = scholarship.total_amount;
      const slots = scholarship.total_slot;
      if (slots > 0) {
        return total / slots;
      }
    }
    return null;
  })();

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 200);
  };

  return (
    <AnimatePresence>
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
            duration: 0.1,
          }}
          className="relative w-full max-w-[30rem] h-full bg-white shadow-2xl rounded-lg overflow-y-auto custom-scrollbar"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-5 py-3 flex items-center justify-between z-10">
            <h2 className="text-lg text-[#111827] flex items-center gap-2">
              <button
                onClick={handleClose}
                className="hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronsRight size={20} className="text-[#111827]" />
              </button>
              {isPreview ? 'Preview' : 'Scholarship Details'}
            </h2>
          </div>

          <div className="p-5">
            {/* Image Banner */}
            <div className="relative w-full aspect-square mb-5 rounded-lg overflow-hidden shadow-[0_0_20px_2px_rgba(0,0,0,0.2)]">
              {scholarship.image_url ? (
                <img
                  src={scholarship.image_url}
                  alt={scholarship.title || 'Scholarship'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Images className="text-gray-400" size={80} />
                </div>
              )}
            </div>

            {/* Title and Badges */}
            <h1 className="text-[26px] text-[#111827] mb-2">
              {scholarship.title || 'Scholarship Title'}
            </h1>
            <div className="flex gap-2 mb-4">
              {scholarship.type && (
                <span className="px-2.5 py-1 bg-[#F3F4F6] text-[#374151] text-xs rounded border border-[#E5E7EB]">
                  {scholarship.type === 'merit_based' ? 'Merit-Based' : 'Skill-Based'}
                </span>
              )}
              {scholarship.purpose && (
                <span className="px-2.5 py-1 bg-[#F3F4F6] text-[#374151] text-xs rounded border border-[#E5E7EB]">
                  {scholarship.purpose === 'allowance' ? 'Allowance' : 'Tuition'}
                </span>
              )}
            </div>

            {/* Sponsor and Deadline */}
            <div className="space-y-3 mb-4 text-[#6B7280]">
              <div className="flex items-center gap-2">
                <img
                  src={scholarship.sponsor?.profile_url || 'src/logo.svg'}
                  alt="Sponsor Profile"
                  className="w-5.5 h-5.5 bg-white/20 rounded-full flex-shrink-0 object-cover overflow-hidden block"
                />
                <span className="text-sm">{scholarship.sponsor?.name || 'iSkolar'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={22} />
                <span className="text-sm">
                  {scholarship.application_deadline
                    ? new Date(scholarship.application_deadline).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Application deadline TBD'}
                </span>
              </div>
            </div>

            {/* Amount and Slots */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#E2FBF4] border border-[#31D0AA] rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-[#31D0AA] mb-1.5">
                  <Coins size={16} />
                  <span className="text-xs">Amount</span>
                </div>
                <p className="text-sm text-[#31D0AA] mb-0.5">
                  {amountPerScholar !== null
                    ? `₱ ${amountPerScholar.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : '₱ 0.00'}
                </p>
                <p className="text-xs text-[#31D0AA]">per scholar</p>
              </div>

              <div className="bg-[#EEF1FF] border border-[#607EF2] rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-[#607EF2] mb-1.5">
                  <Users size={16} />
                  <span className="text-xs">Slots</span>
                </div>
                <p className="text-sm text-[#607EF2] mb-0.5">{scholarship.total_slot || 0}</p>
                <p className="text-xs text-[#607EF2]">scholars</p>
              </div>
            </div>

            {/* Description */}
            {scholarship.description && (
              <div className="mb-6">
                <h3 className="text-sm text-[#111827] mb-2">About Scholarship</h3>
                <p className="text-[#6B7280] text-xs leading-relaxed">
                  {scholarship.description}
                </p>
              </div>
            )}

            {/* Eligibility Criteria */}
            {scholarship.criteria && scholarship.criteria.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm text-[#111827] mb-2">Eligibility Criteria</h3>
                <div className="flex flex-wrap gap-2">
                  {scholarship.criteria.map((criterion: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-white text-[#374151] text-xs rounded border-2 border-[#E5E7EB]"
                    >
                      {criterion}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Required Documents */}
            {scholarship.required_documents && scholarship.required_documents.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm text-[#111827] mb-2">Required Documents</h3>
                <div className="grid grid-cols-2 gap-2">
                  {scholarship.required_documents.map((doc: string, i: number) => (
                    <div
                      key={i}
                      className="px-3 py-2 bg-white text-[#374151] text-xs rounded border-2 border-[#E5E7EB] text-center"
                    >
                      {doc}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Button - only show if not preview */}
            {!isPreview && (
              <button className="w-full bg-[#3646A8] cursor-pointer text-white py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-100 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] active:shadow-md">
                Apply Now →
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}