import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Controller } from 'react-hook-form';
import {
  Upload,
  X,
  Plus,
  CalendarIcon,
  Loader2,
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Toast from '@/components/Toast';
import ScholarshipPreviewCard from '@/components/sponsor/ScholarshipPreviewCard';
import ScholarshipFullPreviewModal from '@/components/sponsor/ScholarshipFullPreviewDrawer';
import CustomFormFieldModal from '@/components/sponsor/CustomFormFieldModal';
import CustomFormFieldsList from '@/components/sponsor/CustomFormFieldsList';
import DescriptionModal from '@/components/sponsor/DescriptionModal';
import { useScholarshipForm, type ScholarshipFormData, type CustomFieldType } from '@/hooks/useScholarshipForm';
import { useScholarshipPreview } from '@/hooks/useScholarshipPreview';
import { useToast } from '@/hooks/useToast';
import { usePageTitle } from "@/hooks/usePageTitle";
import { handleError } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';
import { scholarshipManagementService } from '@/services/scholarshipManagement.service';

export const Route = createFileRoute('/_sponsor/create')({
  component: CreateScholarship,
});

function CreateScholarship() {
  usePageTitle('Create');

  const {
    form,
    imagePreview,
    criteriaInput,
    setCriteriaInput,
    documentsInput,
    setDocumentsInput,
    handleImageUpload,
    removeImage,
    addCriterion,
    removeCriterion,
    addDocument,
    removeDocument,
    resetForm,
  } = useScholarshipForm();

  const { control, handleSubmit, setValue, watch, formState: { errors } } = form;
  const { toast, showSuccess, showError } = useToast();
  
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showCustomFieldModal, setShowCustomFieldModal] = useState(false);
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const criteria = watch('criteria');
  const requiredDocuments = watch('requiredDocuments');
  const customFormFields = watch('customFormFields') || [];
  const description = watch('description');
  const title = watch('title');
  const totalAmount = watch('totalAmount');
  const totalSlot = watch('totalSlot');
  const applicationDeadline = watch('applicationDeadline');
  const type = watch('type');
  const purpose = watch('purpose');
  const imageUrl = watch('imageUrl');

  const { previewScholarship } = useScholarshipPreview({
    type,
    purpose,
    title,
    description,
    imageUrl,
    totalAmount,
    totalSlot,
    applicationDeadline,
    criteria,
    requiredDocuments,
  });

  const openCustomFormModal = (index?: number) => {
    setEditingFieldIndex(index ?? null);
    setShowCustomFieldModal(true);
  };

  const handleSaveCustomField = (field: {
    type: CustomFieldType;
    label: string;
    required: boolean;
    options?: string[];
  }) => {
    if (editingFieldIndex !== null) {
      const updatedFields = customFormFields.map((f, i) => 
        i === editingFieldIndex ? field : f
      );
      setValue('customFormFields', updatedFields);
    } else {
      setValue('customFormFields', [...customFormFields, field]);
    }
    setEditingFieldIndex(null);
  };

  const removeCustomFormField = (index: number) => {
    setValue('customFormFields', customFormFields.filter((_, i) => i !== index));
  };

  const handleSaveDescription = (desc: string) => {
    setValue('description', desc);
  };

  const onSubmit = async (data: ScholarshipFormData) => {
    setLoading(true);
    
    try {
      const scholarshipData = {
        type: data.type,
        purpose: data.purpose,
        title: data.title.trim(),
        description: data.description?.trim(),
        total_amount: parseFloat(data.totalAmount),
        total_slot: parseInt(data.totalSlot),
        application_deadline: data.applicationDeadline.toISOString(),
        criteria: data.criteria,
        required_documents: data.requiredDocuments,
        custom_form_fields: data.customFormFields || [],
      };

      const response = await scholarshipManagementService.createScholarship(scholarshipData);

      if (response.success && response.scholarship) {
        showSuccess('Success', response.message, 2000);
        resetForm();
      } else {
        showError('Error', response.message);
      }
    } catch(error) {
      const handled = handleError(error, 'Failed to connect to server.');
      logger.error('Connection Error', handled.raw);
      showError(`Error ${handled.code}`, handled.message, 2500);
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {toast && <Toast {...toast} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Scholarship Details */}
        <div className="space-y-4">
          {/* Type and Purpose */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select 
                value={type} 
                onValueChange={(value) => setValue('type', value as 'merit_based' | 'skill_based', { shouldValidate: true })}
              >
                <SelectTrigger disabled={loading} className={`w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all data-[placeholder]:text-gray-400 ${
                  errors.type
                    ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] text-primary'
                    : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                }`}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="merit_based">Merit-Based</SelectItem>
                  <SelectItem value="skill_based">Skill-Based</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-xs text-[#EF4444] mt-1">{errors.type.message}</p>}
            </div>

            <div>
              <Select 
                value={purpose} 
                onValueChange={(value) => setValue('purpose', value as 'allowance' | 'tuition', { shouldValidate: true })}
              >
                <SelectTrigger disabled={loading} className={`w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all data-[placeholder]:text-gray-400 ${
                  errors.purpose
                    ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] text-primary'
                    : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                }`}>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allowance">Allowance</SelectItem>
                  <SelectItem value="tuition">Tuition</SelectItem>
                </SelectContent>
              </Select>
              {errors.purpose && <p className="text-xs text-[#EF4444] mt-1">{errors.purpose.message}</p>}
            </div>
          </div>

          <div className="bg-[#F8F9FC] rounded-xl p-3 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Image Upload */}
              <div className="md:w-[218px]">
                <label className="block">
                  {imagePreview ? (
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        disabled={loading}
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-black/50 text-tertiary rounded-full p-1.5 hover:bg-black/70"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className={`border-2 border-dashed ${
                      errors.imageUrl ? 'border-[#EF4444]' : 'border-[#3A52A6]'
                    } rounded-lg text-center cursor-pointer hover:bg-[#F0F7FF] transition-colors flex flex-col items-center justify-center w-full aspect-square px-4`}>
                      <Upload className="mb-3 text-[#5B7BA6]" size={40} />
                      <p className="text-secondary text-sm opacity-70">Click to select an image</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </label>
                {errors.imageUrl && <p className="text-xs text-[#EF4444] mt-1">{errors.imageUrl.message}</p>}
              </div>

              <div className="md:w-2/3 space-y-3.5">
                {/* Title */}
                <div>
                  <Controller
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <input
                        {...field}
                        placeholder="Scholarship Title"
                        disabled={loading}
                        className={`w-full text-2xl border-b-2 ${
                          errors.title ? 'border-[#EF4444]' : 'border-transparent'
                        } bg-transparent pb-2 focus:outline-none focus:border-[#3A52A6] text-primary`}
                      />
                    )}
                  />
                  {errors.title && <p className="text-xs text-[#EF4444] mt-1">{errors.title.message}</p>}
                </div>

                {/* Description */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowDescriptionModal(true)}
                  className="w-full cursor-pointer flex items-center gap-2 px-4 py-3 rounded-lg bg-[#F3F4F6] border text-[#6B7280] text-sm hover:bg-muted transition-colors"
                >
                  <span className="text-[#8B9CB5]">☰</span>
                  {description ? 'Edit Description' : 'Add Description'}
                </button>

                {/* Total Amount & Slot */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Controller
                      control={control}
                      name="totalAmount"
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          disabled={loading}
                          placeholder="Total amount"
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.totalAmount ? 'border-[#EF4444]' : 'border-[#C4CBD5]'
                          } bg-[#F8F9FC] text-sm focus:outline-none focus:ring-2 focus:ring-[#3A52A6]`}
                        />
                      )}
                    />
                    {errors.totalAmount && <p className="text-xs text-[#EF4444] mt-1">{errors.totalAmount.message}</p>}
                  </div>

                  <div>
                    <Controller
                      control={control}
                      name="totalSlot"
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          disabled={loading}
                          placeholder="Total slots"
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.totalSlot ? 'border-[#EF4444]' : 'border-[#C4CBD5]'
                          } bg-[#F8F9FC] text-sm focus:outline-none focus:ring-2 focus:ring-[#3A52A6]`}
                        />
                      )}
                    />
                    {errors.totalSlot && <p className="text-xs text-[#EF4444] mt-1">{errors.totalSlot.message}</p>}
                  </div>
                </div>

                {/* Application Deadline */}
                <div>
                  <Controller
                    control={control}
                    name="applicationDeadline"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            disabled={loading}
                            className={`w-full px-4 py-3 text-sm border rounded-lg bg-[#F8F9FC] focus:outline-none focus:ring-2 focus:ring-[#3A52A6] flex items-center justify-between ${
                              field.value ? 'text-primary' : 'text-gray-400'
                            } ${errors.applicationDeadline ? 'border-[#EF4444]' : 'border-[#C4CBD5]'}`}
                          >
                            <span>
                              {field.value
                                ? field.value.toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })
                                : 'Application deadline'}
                            </span>
                            <CalendarIcon className="h-4 w-4 opacity-60" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ?? undefined}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(date);
                              }
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.applicationDeadline && <p className="text-xs text-[#EF4444] mt-1">{errors.applicationDeadline.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Criteria */}
          <div>
            <div className="flex gap-2">
              <input
                value={criteriaInput}
                disabled={loading}
                onChange={(e) => setCriteriaInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCriterion())}
                placeholder="Enter eligibility criterion"
                className={`flex-1 px-4 py-3 rounded-lg border ${
                  errors.criteria ? 'border-[#EF4444]' : 'border-[#C4CBD5]'
                } bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#3A52A6]`}
              />
              <button
                type="button"
                disabled={loading}
                onClick={addCriterion}
                className="w-11 h-11 bg-[#3A52A6] text-tertiary rounded-lg flex items-center justify-center hover:bg-[#2A4296] transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            {errors.criteria && <p className="text-xs text-[#EF4444] mt-1">{errors.criteria.message}</p>}
            {criteria.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {criteria.map((criterion, index) => (
                  <span key={index} className="inline-flex items-center gap-2 px-3 py-2 border border-border bg-[#F9FAFB] text-primary text-xs rounded-md">
                    {criterion}
                    <button disabled={loading} onClick={() => removeCriterion(index)} className="cursor-pointer hover:text-[#2A4296]">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Required Documents */}
          <div>
            <div className="flex gap-2">
              <input
                value={documentsInput}
                disabled={loading}
                onChange={(e) => setDocumentsInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDocument())}
                placeholder="Enter required document"
                className={`flex-1 px-4 py-3 rounded-lg border ${
                  errors.requiredDocuments ? 'border-[#EF4444]' : 'border-[#C4CBD5]'
                } bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#3A52A6]`}
              />
              <button
                type="button"
                disabled={loading}
                onClick={addDocument}
                className="w-11 h-11 bg-[#3A52A6] text-tertiary rounded-lg flex items-center justify-center hover:bg-[#2A4296] transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            {errors.requiredDocuments && <p className="text-xs text-[#EF4444] mt-1">{errors.requiredDocuments.message}</p>}
            {requiredDocuments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {requiredDocuments.map((doc, index) => (
                  <span key={index} className="inline-flex items-center gap-2 px-3 py-2 bg-[#F9FAFB] text-[#374151] text-xs rounded-md border border-border rounded-lg">
                    {doc}
                    <button disabled={loading} onClick={() => removeDocument(index)} className="hover:text-[#2A4296]">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Custom Form Fields */}
          <div>
            <div className="mb-3">
              <label className="block text-sm text-[#4A5568] mb-1 ml-0.5">Application Form</label>
              <p className="text-xs text-[#6B7280] ml-0.5">Add custom fields to collect information from applicants.</p>
            </div>

            <CustomFormFieldsList
              fields={customFormFields}
              onEdit={openCustomFormModal}
              onRemove={removeCustomFormField}
              disabled={loading}
            />

            <button
              type="button"
              disabled={loading}
              onClick={() => openCustomFormModal()}
              className={`w-full flex cursor-pointer items-center justify-center gap-2 px-4 py-3.5 border-2 border-dashed ${
                errors.customFormFields ? 'border-[#EF4444]' : 'border-[#3A52A6]'
              } bg-[#E0ECFF] text-secondary text-sm rounded-lg hover:bg-[#D0DCFF] transition-colors`}
            >
              <Plus size={20} />
              {customFormFields.length === 0 ? 'Add Form Field' : 'Add Another Field'}
            </button>
            {errors.customFormFields && <p className="text-xs text-[#EF4444] mt-1">{errors.customFormFields.message}</p>}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit(onSubmit)}
            className={`w-full mt-2 mb-6 md:mb-0 py-3 bg-[#EFA508] text-tertiary cursor-pointer rounded-lg hover:bg-[#D89407] transition-colors ${
              loading && "opacity-60 cursor-not-allowed"
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
              </span>
            ) : (
              <span>Create Scholarship</span>
            )}
          </button>
        </div>

        {/* Live Preview */}
        <div className="lg:sticky lg:top-6 h-fit md:ml-24">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm text-primary">Live Preview</h2>
          </div>
          
          <ScholarshipPreviewCard 
            scholarship={previewScholarship}
            onClick={() => setShowFullPreview(true)}
          />
        </div>
      </div>

      <DescriptionModal
        isOpen={showDescriptionModal}
        onClose={() => setShowDescriptionModal(false)}
        description={description || ''}
        onSave={handleSaveDescription}
      />

      <CustomFormFieldModal
        isOpen={showCustomFieldModal}
        onClose={() => {
          setShowCustomFieldModal(false);
          setEditingFieldIndex(null);
        }}
        onSave={handleSaveCustomField}
        editingField={editingFieldIndex !== null ? customFormFields[editingFieldIndex] : null}
      />

      {showFullPreview && (
        <ScholarshipFullPreviewModal
          scholarship={previewScholarship}
          onClose={() => setShowFullPreview(false)}
          isPreview={true}
        />
      )}
    </div>
  );
}