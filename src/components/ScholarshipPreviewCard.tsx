import { Calendar, Users, Coins, Images } from 'lucide-react';
import type { Scholarship } from '@/types/scholarship.types';

interface ScholarshipPreviewCardProps {
  scholarship: Partial<Scholarship>;
  onClick?: () => void;
}

export default function ScholarshipPreviewCard({ scholarship, onClick }: ScholarshipPreviewCardProps) {
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

  return (
    <div
      onClick={onClick}
      className="bg-[#FEFEFD] rounded-xl overflow-hidden border border-[#D3DCF6] cursor-pointer transition-transform duration-200 hover:scale-98"
    >
      <div className="bg-gradient-to-r from-[#3646A8] via-[#465BC8] to-[#5A80E6]">
        <div className="flex">
          {/* Image Section */}
          <div className="relative w-32 h-32 flex-shrink-0">
            {scholarship.image_url ? (
              <img
                src={scholarship.image_url}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg rounded-bl-none"
              />
            ) : (
              <div className="w-full h-full bg-white/20 rounded-lg rounded-bl-none flex items-center justify-center">
                <Images className="text-white/60" size={32} />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-white py-2 px-4">
            <h3 className="text-xl mb-1 truncate">
              {scholarship.title || 'Scholarship Title'}
            </h3>

            {(scholarship.type || scholarship.purpose) && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {scholarship.type && (
                  <span className="px-1.5 py-0.5 bg-white/95 text-[#3A52A6] text-[10px] rounded">
                    {scholarship.type === 'merit_based' ? 'Merit-Based' : 'Skill-Based'}
                  </span>
                )}
                {scholarship.purpose && (
                  <span className="px-1.5 py-0.5 bg-white/95 text-[#3A52A6] text-[10px] rounded">
                    {scholarship.purpose === 'allowance' ? 'Allowance' : 'Tuition'}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-xs mb-1.5">
              <img
                src={scholarship.sponsor?.profile_url || "src/logo.svg"}
                alt="Sponsor Profile"
                className="w-4 h-4 bg-white/20 rounded-full flex-shrink-0 object-cover overflow-hidden block"
              />
              <span>{scholarship.sponsor?.name || 'iSkolar'}</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Calendar size={16} />
              <span>
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
        </div>
      </div>

      <div className="px-4 pb-4 pt-2">
        {/* Amount & Slots */}
        <div className="grid grid-cols-2 gap-2 mt-2 mb-4">
          <div className="bg-[#E2FBF4] border border-[#31D0AA] rounded-lg p-3">
            <div className="flex items-center gap-1 text-[#31D0AA] text-sm mb-1">
              <Coins size={16} />
              <span>Amount</span>
            </div>
            <p className="text-[#31D0AA] text-lg">
              {amountPerScholar !== null
                ? `₱ ${amountPerScholar.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : scholarship.total_amount
                ? `₱ ${scholarship.total_amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : '₱ 0.00'}
            </p>
            <p className="text-xs text-[#31D0AA]">per scholar</p>
          </div>

          <div className="bg-[#EEF1FF] border border-[#607EF2] rounded-lg p-3">
            <div className="flex items-center gap-1 text-[#607EF2] text-sm mb-1">
              <Users size={16} />
              <span>Slots</span>
            </div>
            <p className="text-[#607EF2] text-lg">{scholarship.total_slot || '0'}</p>
            <p className="text-xs text-[#607EF2]">scholars</p>
          </div>
        </div>

        {/* Criteria and Required Documents */}
        <div className="mt-2 grid grid-cols-2 gap-8 text-sm">
          <div>
            <h4 className="text-[#4B5563] text-xs tracking-wider mb-2">Criteria</h4>
            {scholarship.criteria && scholarship.criteria.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {scholarship.criteria.slice(0, 2).map((c, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#F3F4F6] text-[#374151] text-[11px] rounded border border-[#E5E7EB]"
                  >
                    {c}
                  </span>
                ))}
                {scholarship.criteria.length > 2 && (
                  <span className="px-3 py-1 bg-[#F3F4F6] text-[#374151] text-[11px] rounded border border-[#E5E7EB]">
                    +{scholarship.criteria.length - 2} more
                  </span>
                )}
              </div>
            ) : (
              <p className="text-[#9CA3AF] text-xs">No criteria added</p>
            )}
          </div>

          <div>
            <h4 className="text-[#4B5563] text-xs tracking-wider mb-2">Required Documents</h4>
            {scholarship.required_documents && scholarship.required_documents.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {scholarship.required_documents.slice(0, 2).map((d, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#F3F4F6] text-[#374151] text-[11px] rounded border border-[#E5E7EB]"
                  >
                    {d}
                  </span>
                ))}
                {scholarship.required_documents.length > 2 && (
                  <span className="px-3 py-1 bg-[#F3F4F6] text-[#374151] text-[11px] rounded border border-[#E5E7EB]">
                    +{scholarship.required_documents.length - 2} more
                  </span>
                )}
              </div>
            ) : (
              <p className="text-[#9CA3AF] text-xs">No documents added</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}