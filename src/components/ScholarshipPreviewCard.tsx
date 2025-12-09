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
      className="bg-card rounded-xl overflow-hidden border border-[#D3DCF6] cursor-pointer transition-transform duration-200 hover:scale-98"
    >
      <div className="bg-[#3A52A6]">
        <div className="flex">
          {/* Image Section */}
          <div className="relative w-32 h-32 flex-shrink-0">
            {scholarship.image_url ? (
              <img
                src={scholarship.image_url}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-white/20 flex items-center justify-center">
                <Images className="text-tertiary/60" size={32} />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-tertiary px-4 py-2">
            <h3 className="text-xl mb-1 line-clamp-1">
              {scholarship.title || 'Scholarship Title'}
            </h3>

            {(scholarship.type || scholarship.purpose) && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {scholarship.type && (
                  <span className="px-2 py-0.5 bg-white/90 text-secondary text-[11px] rounded">
                    {scholarship.type === 'merit_based' ? 'Merit-Based' : 'Skill-Based'}
                  </span>
                )}
                {scholarship.purpose && (
                  <span className="px-2 py-0.5 bg-white/90 text-secondary text-[11px] rounded">
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
                  : 'Application deadline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 pt-2">
        {/* Amount & Slots */}
        <div className="grid grid-cols-2 gap-2 mt-2 mb-4">
          <div className="bg-[#F9FAFB] border border-border rounded-lg p-3">
            <div className="flex items-center gap-1 text-[#6B7280] text-sm mb-1">
              <Coins size={16} />
              <span>Amount</span>
            </div>
            <p className="text-base text-primary">
              {amountPerScholar !== null
                ? `₱ ${amountPerScholar.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : scholarship.total_amount
                ? `₱${scholarship.total_amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : '₱0.00'}
            </p>
            <p className="text-xs text-[#6B7280]">per scholar</p>
          </div>

          <div className="bg-[#F9FAFB] border border-border rounded-lg p-3">
            <div className="flex items-center gap-1 text-[#6B7280] text-sm mb-1">
              <Users size={16} />
              <span>Slots</span>
            </div>
            <p className="text-base text-primary">{scholarship.total_slot || '0'}</p>
            <p className="text-xs text-[#6B7280]">scholars</p>
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
                    className="px-2.5 py-1 bg-[#F9FAFB] text-[#374151] text-[11px] rounded border border-border"
                  >
                    {c}
                  </span>
                ))}
                {scholarship.criteria.length > 2 && (
                  <span className="px-2.5 py-1 bg-[#F9FAFB] text-[#374151] text-[11px] rounded border border-border">
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
                    className="px-2.5 py-1 bg-[#F9FAFB] text-[#374151] text-[11px] rounded border border-border"
                  >
                    {d}
                  </span>
                ))}
                {scholarship.required_documents.length > 2 && (
                  <span className="px-2.5 py-1 bg-[#F9FAFB] text-[#374151] text-[11px] rounded border border-border">
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