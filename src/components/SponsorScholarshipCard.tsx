import { Calendar, Users, Coins, Edit2, Trash2, MoreVertical } from 'lucide-react';
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
      className="bg-[#F8F9FC] cursor-pointer rounded-xl overflow-hidden border border-[#D3DCF6] relative"
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
            className="bg-[#F8F9FC] rounded-md shadow-lg border border-[#CEDBFF] py-[4px] min-w-[105px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleEdit}
              className="w-full px-4 py-1.5 text-left text-xs text-[#111827] hover:bg-[#D4E0FF] flex items-center gap-1 transition-colors"
            >
              <Edit2 size={12} className="text-[#3A52A6]" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-1.5 text-left text-xs text-[#EF4444] hover:bg-[#FEE2E2] flex items-center gap-1 transition-colors"
            >
              <Trash2 size={12} />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Three-dot menu button (visible on hover) */}
      <motion.button
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md hover:bg-white transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          const rect = cardRef.current?.getBoundingClientRect();
          if (rect) {
            setContextMenuPosition({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          }
          setShowContextMenu(!showContextMenu);
        }}
      >
        <MoreVertical size={16} className="text-[#3A52A6]" />
      </motion.button>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#3646A8] via-[#465BC8] to-[#5A80E6]">
        <div className="flex">
          {/* Image */}
          <motion.div 
            transition={{ duration: 0.3 }}
            className="w-32 h-32 bg-white/20 rounded-lg rounded-bl-none flex-shrink-0 overflow-hidden"
          >
            <img
              src={scholarship.image_url || "src/logo.svg"}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Info */}
          <div className="flex-1 text-white px-4 py-2">
            <h3 className="text-xl mb-1 truncate">{scholarship.title}</h3>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 + 0.1 }}
                className="px-1.5 py-0.5 bg-[#F8F9FC] text-[#3A52A6] text-[10px] rounded"
              >
                {scholarship.type}
              </motion.span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 + 0.15 }}
                className="px-1.5 py-0.5 bg-[#F8F9FC] text-[#3A52A6] text-[10px] rounded"
              >
                {scholarship.purpose}
              </motion.span>
            </div>

            {/* Sponsor and Deadline */}
            <div className="space-y-1.5 text-xs">
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
        <div className="grid grid-cols-3 gap-2 mb-4">
          <motion.div
            transition={{ duration: 0.2 }}
            className="bg-[#FFECEC] border border-[#31D0AA] rounded-lg p-3"
          >
            <div className="flex items-center gap-1 text-[#D94545] text-sm mb-1">
              <Users size={16} />
              <span>Applications</span>
            </div>
            <p className="text-sm text-[#D94545]">{scholarship.applications_count || 0}</p>
            <p className="text-xs text-[#D94545]">applicants</p>
          </motion.div>

          <motion.div
            transition={{ duration: 0.2 }}
            className="bg-[#E2FBF4] border border-[#31D0AA] rounded-lg p-3"
          >
            <div className="flex items-center gap-1 text-[#31D0AA] text-sm mb-1">
              <Coins size={16} />
              <span>Amount</span>
            </div>
            <p className="text-[#31D0AA] text-sm">
              {amountPerScholar !== null
                ? `₱ ${amountPerScholar.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : '₱ 0.00'}
            </p>
            <p className="text-xs text-[#31D0AA]">per scholar</p>
          </motion.div>

          <motion.div
            transition={{ duration: 0.2 }}
            className="bg-[#EEF1FF] border border-[#607EF2] rounded-lg p-3"
          >
            <div className="flex items-center gap-1 text-[#607EF2] text-sm mb-1">
              <Users size={16} />
              <span>Slots</span>
            </div>
            <p className="text-[#607EF2] text-sm">{scholarship.total_slot}</p>
            <p className="text-xs text-[#607EF2]">scholars</p>
          </motion.div>
        </div>

        {/* Criteria and Documents */}
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="text-[#4B5563] text-xs tracking-wider mb-2">
              Criteria
            </h4>
            <div className="flex flex-wrap gap-2">
              {scholarship.criteria.slice(0, 2).map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[#F3F4F6] text-[#374151] text-[11px] rounded border border-[#E5E7EB]"
                >
                  {item}
                </span>
              ))}
              {scholarship.criteria.length > 2 && (
                <span className="px-3 py-1 bg-[#F3F4F6] text-[#374151] text-[11px] rounded border border-[#E5E7EB]">
                  + {scholarship.criteria.length - 2} more
                </span>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-[#4B5563] text-xs tracking-wider mb-2">
              Required Documents
            </h4>
            <div className="flex flex-wrap gap-2">
              {scholarship.required_documents.slice(0, 2).map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[#F3F4F6] text-[#374151] text-[11px] rounded border border-[#E5E7EB]"
                >
                  {item}
                </span>
              ))}
              {scholarship.required_documents.length > 2 && (
                <span className="px-3 py-1 bg-[#F3F4F6] text-[#374151] text-[11px] rounded border border-[#E5E7EB]">
                  + {scholarship.required_documents.length - 2} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}