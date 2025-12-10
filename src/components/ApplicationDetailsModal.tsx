import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronsRight, Calendar, Coins, Users, Info, Check, Clock } from 'lucide-react';
import type { Application, ApplicationStatus } from '@/types/application.types';
import { calculateAmountPerScholar, formatCurrency, formatDate, formatDateTime } from '@/utils/formatting';

interface ApplicationDetailsModalProps {
  application: Application;
  onClose: () => void;
}

export const statusStyles: Record<
  ApplicationStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  pending: {
    label: 'Pending',
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#92400E]',
    border: 'border-[#FBBF24]',
  },
  shortlisted: {
    label: 'Shortlisted',
    bg: 'bg-[#FFF4E5]',
    text: 'text-[#9A3412]',
    border: 'border-[#FDBA74]',
  },
  approved: {
    label: 'Approved',
    bg: 'bg-[#ECFDF5]',
    text: 'text-[#047857]',
    border: 'border-[#34D399]',
  },
  denied: {
    label: 'Denied',
    bg: 'bg-[#FEF2F2]',
    text: 'text-[#B91C1C]',
    border: 'border-[#FCA5A5]',
  },
  granted: {
    label: 'Granted',
    bg: 'bg-[#EEF2FF]',
    text: 'text-[#3730A3]',
    border: 'border-[#818CF8]',
  },
};

export function ApplicationDetailsModal({ application, onClose }: ApplicationDetailsModalProps) {
  const [isExiting, setIsExiting] = useState(false);

  const statusStyle = statusStyles[application.status];

  const amountPerScholar = calculateAmountPerScholar(
    application.scholarship.total_amount,
    application.scholarship.total_slot
  ) ?? 0;

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-2">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.1 }}
        onClick={handleClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isExiting ? '100%' : 0 }}
        transition={{
          type: 'spring',
          damping: 35,
          stiffness: 300,
          duration: 0.1,
        }}
        className="relative h-full w-full max-w-[30rem] overflow-y-auto rounded-lg bg-[#FEFEFD] shadow-2xl"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E1 #F1F5F9',
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-5 py-3">
          <h2 className="text-lg text-[#111827] flex items-center gap-2">
            <button
              onClick={handleClose}
              className="hover:bg-blue-100 rounded-lg transition-colors"
            >
              <ChevronsRight size={20} className="text-[#111827]" />
            </button>
            Application Details
          </h2>
        </div>

        <div className="p-5 space-y-3 md:space-y-4">
          {/* Status */}
          <div
            className={`rounded-xl border-l-4 px-4 py-3 ${statusStyle.bg} ${statusStyle.border}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#6B7280]">Application Status</p>
                <p className={`text-sm md:text-base capitalize ${statusStyle.text}`}>
                  {statusStyle.label}
                </p>
              </div>
            </div>
            {application.remarks && (
              <p className="mt-2 text-xs italic text-[#4B5563]">{application.remarks}</p>
            )}
          </div>

          {/* Scholarship Image */}
          <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-[0_0_20px_2px_rgba(0,0,0,0.2)]">
            <img
              src={application.scholarship.image_url}
              alt={application.scholarship.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title and Badges */}
          <div>
            <h1 className="text-[26px] text-[#111827] mb-2">{application.scholarship.title}</h1>
            <div className="flex gap-2 mb-4">
              <span className="px-2.5 py-1 bg-[#F3F4F6] text-[#374151] text-xs rounded border border-border">
                {application.scholarship.type}
              </span>
              <span className="px-2.5 py-1 bg-[#F3F4F6] text-[#374151] text-xs rounded border border-border">
                {application.scholarship.purpose}
              </span>
            </div>

            {/* Sponsor and Deadline */}
            <div className="space-y-3 text-[#6B7280]">
              <div className="flex items-center gap-2">
                <img
                  src={application.scholarship.sponsor.profile_url}
                  alt="Sponsor Profile"
                  className="w-5.5 h-5.5 bg-white/20 rounded-full flex-shrink-0 object-cover"
                />
                <span className="text-sm">{application.scholarship.sponsor.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={22} />
                <span className="text-sm">
                  Deadline: {formatDate(application.scholarship.application_deadline)}
                </span>
              </div>
            </div>
          </div>

          {/* Amount and Slots */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F9FAFB] border border-border rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-[#6B7280] mb-1.5">
                <Coins size={16} />
                <span className="text-xs">Amount</span>
              </div>
              <p className="text-base text-[#111827] mb-0.5">
                {formatCurrency(amountPerScholar, {
                  locale: 'en-PH',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-[#6B7280]">per scholar</p>
            </div>

            <div className="bg-[#F9FAFB] border border-border rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-[#6B7280] mb-1.5">
                <Users size={16} />
                <span className="text-xs">Slots</span>
              </div>
              <p className="text-base text-[#111827] mb-0.5">
                {application.scholarship.total_slot}
              </p>
              <p className="text-xs text-[#6B7280]">scholars</p>
            </div>
          </div>

          {/* Description */}
          {application.scholarship.description && (
            <div>
              <h3 className="text-sm text-[#111827] mb-2">About Scholarship</h3>
              <p className="text-[#6B7280] text-xs leading-relaxed">
                {application.scholarship.description}
              </p>
            </div>
          )}

          {/* Eligibility Criteria */}
          <div>
            <h3 className="text-sm text-[#111827] mb-2">Eligibility Criteria</h3>
            <div className="flex flex-wrap gap-2">
              {application.scholarship.criteria?.map((criterion: string, i: number) => (
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
          <div>
            <h3 className="text-sm text-[#111827] mb-2">Required Documents</h3>
            <div className="grid grid-cols-2 gap-2">
              {application.scholarship.required_documents?.map((doc: string, i: number) => (
                <div
                  key={i}
                  className="px-3 py-1.5 bg-[#F9FAFB] text-[#374151] text-xs rounded border border-border text-center"
                >
                  {doc}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-border rounded-md p-4">
            <h3 className="text-sm text-[#111827] mb-4">Timeline</h3>
            <div>
              <div className="flex gap-3">
                <div className="relative flex flex-col items-center">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ECFDF5]">
                    <Check size={16} />
                  </div>
                  <div className="h-6 w-px bg-[#E5E7EB]" />
                </div>
                <div>
                  <p className="text-xs text-[#4B5563]">Applied</p>
                  <p className="text-[11px] text-[#9CA3AF]">
                    {formatDateTime(application.applied_at)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EFF6FF]">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-xs text-[#4B5563]">Last Updated</p>
                  <p className="text-[11px] text-[#9CA3AF]">
                    {formatDateTime(application.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Footer */}
          <div className="flex items-start gap-2 rounded-md bg-[#FEF3C7] p-3 text-xs text-[#78350F]">
            <Info size={17} className="flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              You cannot edit or delete this application.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}