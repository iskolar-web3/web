import { Calendar, Users, Coins, Edit2, Trash2 } from 'lucide-react';
import type { Scholarship } from '@/types/scholarship.types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export default function SponsorScholarshipCard({ 
  scholarship, 
  index, 
  onClick,
  onEdit,
  onDelete 
}: { 
  scholarship: Scholarship; 
  index: number; 
  onClick?: () => void;
  onEdit?: (scholarship: Scholarship) => void;
  onDelete?: (scholarship: Scholarship) => void;
}) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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

  // Handle right-click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setContextMenuPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setShowContextMenu(true);
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContextMenu]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowContextMenu(false);
    onEdit?.(scholarship);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowContextMenu(false);
    onDelete?.(scholarship);
  };
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{ 
        scale: 0.98,
        transition: { duration: 0.2 }
      }}
      onClick={onClick}
      onContextMenu={handleContextMenu}
      className="bg-white cursor-pointer rounded-lg overflow-hidden border border-[#E5E7EB] hover:border-[#3A52A6] transition-colors relative shadow-sm"
    >
      {/* Context Menu */}
      <AnimatePresence>
        {showContextMenu && (
          <motion.div
            ref={contextMenuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'absolute',
              left: `${contextMenuPosition.x}px`,
              top: `${contextMenuPosition.y}px`,
              zIndex: 50,
            }}
            className="bg-white rounded-lg shadow-xl border border-[#E5E7EB] py-1 min-w-[120px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleEdit}
              className="w-full px-4 py-2 cursor-pointer text-left text-[13px] text-[#111827] hover:bg-[#F0F7FF] flex items-center gap-1.5 transition-colors"
            >
              <Edit2 size={15} />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 cursor-pointer text-left text-[13px] text-[#EF4444] hover:bg-[#FEE2E2] flex items-center gap-1.5 transition-colors"
            >
              <Trash2 size={15} />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-[#3A52A6]">
        <div className="flex">
          {/* Image */}
          <motion.div 
            transition={{ duration: 0.3 }}
            className="w-32 h-32 bg-white/10 flex-shrink-0 overflow-hidden"
          >
            <img
              src={scholarship.image_url || "src/logo.svg"}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Info */}
          <div className="flex-1 text-white px-4 py-2">
            <h3 className="text-lg mb-1 truncate">{scholarship.title}</h3>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 + 0.1 }}
                className="px-2 py-0.5 bg-white/90 text-[#3A52A6] text-[11px] rounded"
              >
                {scholarship.type}
              </motion.span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 + 0.15 }}
                className="px-2 py-0.5 bg-white/90 text-[#3A52A6] text-[11px] rounded"
              >
                {scholarship.purpose}
              </motion.span>
            </div>

            {/* Sponsor and Deadline */}
            <div className="space-y-1.5 text-xs opacity-90">
              <div className="flex items-center gap-2">
               <img
                  src={scholarship.sponsor.profile_url || "src/logo.svg"}
                  alt="Sponsor Profile"
                  className="w-4 h-4 bg-white/20 rounded-full flex-shrink-0 object-cover overflow-hidden block"
                />
                <span>{scholarship.sponsor.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{scholarship.application_deadline}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Amount and Slots */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <motion.div
            transition={{ duration: 0.2 }}
            className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3"
          >
            <div className="flex items-center gap-1.5 text-[#6B7280] text-xs mb-1">
              <Users size={14} />
              <span>Applications</span>
            </div>
            <p className="text-base text-[#111827]">{scholarship.applications_count || 0}</p>
            <p className="text-xs text-[#6B7280]">applicants</p>
          </motion.div>

          <motion.div
            transition={{ duration: 0.2 }}
            className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3"
          >
            <div className="flex items-center gap-1.5 text-[#6B7280] text-xs mb-1">
              <Coins size={14} />
              <span>Amount</span>
            </div>
            <p className="text-[#111827] text-base">
              {amountPerScholar !== null
                ? `₱${amountPerScholar.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                : '₱0.00'}
            </p>
            <p className="text-xs text-[#6B7280]">per scholar</p>
          </motion.div>

          <motion.div
            transition={{ duration: 0.2 }}
            className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3"
          >
            <div className="flex items-center gap-1.5 text-[#6B7280] text-xs mb-1">
              <Users size={14} />
              <span>Slots</span>
            </div>
            <p className="text-[#111827] text-base">{scholarship.total_slot}</p>
            <p className="text-xs text-[#6B7280]">scholars</p>
          </motion.div>
        </div>

        {/* Criteria and Documents */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="text-[#6B7280] text-xs tracking-wide mb-2">
              Criteria
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {scholarship.criteria.slice(0, 2).map((item, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-[#F9FAFB] text-[#374151] text-[11px] rounded border border-[#E5E7EB]"
                >
                  {item}
                </span>
              ))}
              {scholarship.criteria.length > 2 && (
                <span className="px-2.5 py-1 bg-[#F9FAFB] text-[#374151] text-[11px] rounded border border-[#E5E7EB]">
                  +{scholarship.criteria.length - 2}
                </span>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-[#6B7280] text-[11px] tracking-wide mb-2">
              Required Documents
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {scholarship.required_documents.slice(0, 2).map((item, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-[#F9FAFB] text-[#374151] text-[11px] rounded border border-[#E5E7EB]"
                >
                  {item}
                </span>
              ))}
              {scholarship.required_documents.length > 2 && (
                <span className="px-2.5 py-1 bg-[#F9FAFB] text-[#374151] text-xs rounded border border-[#E5E7EB]">
                  +{scholarship.required_documents.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}