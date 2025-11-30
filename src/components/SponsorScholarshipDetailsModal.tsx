import { useNavigate } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import type { Scholarship } from '@/types/scholarship.types';
import { 
  Calendar, 
  Users, 
  Coins, 
  ChevronsRight, 
  Images, 
  Type, 
  AlignLeft, 
  ListChecks, 
  CheckSquare, 
  Hash, 
  Mail, 
  Phone, 
  Paperclip, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  Loader2 } from 'lucide-react';
import { useState } from 'react';

interface SponsorScholarshipDetailsModalProps {
  scholarship: Scholarship;
  onClose: () => void;
  onEdit?: (scholarship: Scholarship) => void;
  onDelete?: (scholarship: Scholarship) => void;
  onViewApplicants?: (scholarship: Scholarship) => void;
}

export default function SponsorScholarshipDetailsModal({
  scholarship,
  onClose,
  onEdit,
  onDelete,
  onViewApplicants,
}: SponsorScholarshipDetailsModalProps) {
  const navigate = useNavigate()

  const [isExiting, setIsExiting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const getFieldTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      text: 'Short answer',
      textarea: 'Long answer',
      dropdown: 'Dropdown',
      multiple_choice: 'Multiple choice',
      checkbox: 'Checkbox',
      number: 'Number',
      date: 'Date',
      email: 'Email',
      phone: 'Phone number',
      file: 'File upload',
    };
    return typeMap[type] || type;
  };

  const renderFieldTypeIcon = (fieldType: string) => {
    const iconProps = { size: 20, className: "text-[#3A52A6]" };
    
    switch (fieldType) {
      case 'text':
        return <Type {...iconProps} />;
      case 'textarea':
        return <AlignLeft {...iconProps} />;
      case 'dropdown':
      case 'multiple_choice':
        return <ListChecks {...iconProps} />;
      case 'checkbox':
        return <CheckSquare {...iconProps} />;
      case 'number':
        return <Hash {...iconProps} />;
      case 'date':
        return <Calendar {...iconProps} />;
      case 'email':
        return <Mail {...iconProps} />;
      case 'phone':
        return <Phone {...iconProps} />;
      case 'file':
        return <Paperclip {...iconProps} />;
      default:
        return <Type {...iconProps} />;
    }
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 200);
  };

  const handleEdit = () => {
    // navigate({ to: `/scholarship/${scholarship.id}/edit` });
    onEdit?.(scholarship);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleViewApplicants = () => {
    onViewApplicants?.(scholarship);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);

      await onDelete?.(scholarship);
      
      setShowDeleteModal(false);
      handleClose();
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setLoading(false);
    }
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
              Scholarship Details
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
                    : 'Application deadline'}
                </span>
              </div>
            </div>

            {/* Amount and Slots */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-[#6B7280] mb-1.5">
                  <Users size={16} />
                  <span className="text-xs">Applications</span>
                </div>
                <p className="text-base text-[#111827]">{scholarship.applications_count || 0}</p>
                <p className="text-xs text-[#6B7280]">applicants</p>
              </div>

              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-[#6B7280] mb-1.5">
                  <Coins size={16} />
                  <span className="text-xs">Amount</span>
                </div>
                <p className="text-base text-[#111827] mb-0.5">
                  {amountPerScholar !== null
                    ? `₱${amountPerScholar.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : '₱0.00'}
                </p>
                <p className="text-xs text-[#6B7280]">per scholar</p>
              </div>

              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-[#6B7280] mb-1.5">
                  <Users size={16} />
                  <span className="text-xs">Slots</span>
                </div>
                <p className="text-base text-[#111827] mb-0.5">{scholarship.total_slot || 0}</p>
                <p className="text-xs text-[#6B7280]">scholars</p>
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
                      className="px-3 py-1.5 bg-[#F9FAFB] text-[#374151] text-xs rounded border border-[#E5E7EB]"
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
                      className="px-3 py-2 bg-[#F9FAFB] text-[#374151] text-xs rounded border border-[#E5E7EB] text-center"
                    >
                      {doc}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Form Fields */}
            {scholarship.custom_form_fields && scholarship.custom_form_fields.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm text-[#111827] mb-3">Application Form Fields</h3>
                <div className="space-y-2.5">
                  {scholarship.custom_form_fields.map((field: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-[#F9FAFB] border border-[#E0ECFF] rounded-lg">
                      <div className="w-9 h-9 bg-[#E0ECFF] rounded-lg flex items-center justify-center flex-shrink-0">
                        {renderFieldTypeIcon(field.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[13px] text-[#111827] font-medium">{field.label}</span>
                          {field.required && (
                            <span className="px-1.5 py-0.5 bg-[#FEE2E2] text-[#DC2626] text-[9px] rounded">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#6B7280]">
                          {getFieldTypeLabel(field.type)}
                          {(field.type === 'dropdown' || field.type === 'checkbox' || field.type === 'multiple_choice') && 
                            field.options && field.options.length > 0 && 
                            ` • ${field.options.length} option${field.options.length !== 1 ? 's' : ''}`
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View Applicants Button */}
            <button 
              onClick={handleViewApplicants}
              className="w-full bg-[#E0ECFF] cursor-pointer text-[#3A52A6] py-3 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all duration-100 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] active:shadow-md border-2 border-[#3A52A6] mb-3"
            >
              <Users size={15} />
              View Applicants
            </button>

            {/* Edit and Delete Buttons */}
            <div className="flex gap-3 mt-2">
              <button 
                onClick={handleEdit}
                className="flex-1 bg-[#3A52A6] cursor-pointer text-[#F0F7FF] py-3 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all duration-100 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] active:shadow-md"
              >
                <Edit2 size={15} />
                Edit
              </button>
              <button 
                onClick={handleDeleteClick}
                className="flex-1 bg-[#EF4444] cursor-pointer text-[#F0F7FF] py-3 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all duration-100 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] active:shadow-md"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>
        </motion.div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-[#F0F7FF] rounded-xl shadow-2xl max-w-sm w-full p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full text-[#EF4444] mb-1">
                  <AlertCircle size={38}/>
                </div>
                <h3 className="text-lg text-[#111827] mb-2">Delete Scholarship</h3>
                <p className="text-sm text-[#6B7280] mb-6">
                  Are you sure you want to delete "<strong>{scholarship.title}</strong>"? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                  className={`flex-1 px-4 py-2 cursor-pointer text-sm bg-[#F0F7FF] border border-[#D1D5DB] text-[#374151] rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 ${
                    loading && "opacity-60 cursor-not-allowed"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={loading}
                  className={`flex-1 px-4 py-2 cursor-pointer bg-[#EF4444] text-sm text-[#F0F7FF] rounded-md hover:bg-[#DC2626] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                    loading && "opacity-60 cursor-not-allowed"
                  }`}
                >
                  {loading ? (
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
    </AnimatePresence>
  );
}