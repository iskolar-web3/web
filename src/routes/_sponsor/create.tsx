import { useState, useCallback } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Upload,
  X,
  Plus,
  Edit2,
  Trash2,
  CalendarIcon,
  Loader2,
  Type as TypeIcon,
  AlignLeft,
  ListChecks,
  CheckSquare,
  Hash,
  Mail,
  Phone,
  Paperclip,
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
import ScholarshipPreviewCard from '@/components/ScholarshipPreviewCard';
import ScholarshipFullPreviewModal from '@/components/ScholarshipFullPreviewModal';
import { normalizeText, normalizeArray } from '@/utils/normalize';
import { scholarshipManagementService } from '@/services/scholarship-management.service';

// Form field types
const customFieldTypes = [
  'text',
  'textarea',
  'multiple_choice',
  'dropdown',
  'checkbox',
  'number',
  'date',
  'email',
  'phone',
  'file',
] as const;
type CustomFieldType = (typeof customFieldTypes)[number];

// Validation 
const scholarshipSchema = z.object({
  type: z.enum(['merit_based', 'skill_based'], { message: 'Please select a scholarship type' }),
  purpose: z.enum(['allowance', 'tuition'], { message: 'Please select a purpose' }),
  title: z.string().min(1, 'Scholarship title is required').max(150, 'Title must be less than 150 characters'),
  description: z.string().optional(),
  imageUrl: z.string().min(1, 'Please upload a scholarship image'),
  totalAmount: z.string()
    .min(1, 'Total amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Please enter a valid amount greater than 0'
    }),
  totalSlot: z.string()
    .min(1, 'Total slot is required')
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
      message: 'Please enter a valid slot number greater than 0'
    }),
  applicationDeadline: z.date('Please select an application deadline'),
  criteria: z.array(z.string()).min(1, 'At least one eligibility criterion is required'),
  requiredDocuments: z.array(z.string()).min(1, 'At least one required document is required'),
  customFormFields: z.array(z.object({
    type: z.enum(customFieldTypes),
    label: z.string().min(1, 'Field label is required'),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
  })).min(1, 'At least one form field is required'),
});

type ScholarshipFormData = z.infer<typeof scholarshipSchema>;

export const Route = createFileRoute('/_sponsor/create')({
  component: CreateScholarship,
});

function CreateScholarship() {
  const { control, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<ScholarshipFormData>({
    resolver: zodResolver(scholarshipSchema),
    mode: "onBlur",
    defaultValues: {
      type: undefined,
      purpose: undefined,
      title: '',
      description: '',
      imageUrl: '',
      totalAmount: '',
      totalSlot: '',
      applicationDeadline: undefined,
      criteria: [],
      requiredDocuments: [],
      customFormFields: [],
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [criteriaInput, setCriteriaInput] = useState('');
  const [documentsInput, setDocumentsInput] = useState('');
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [tempDescription, setTempDescription] = useState('');
  const [showCustomFieldModal, setShowCustomFieldModal] = useState(false);
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
  const [newFieldType, setNewFieldType] = useState<CustomFieldType>('text');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);
  const [dropdownOptionInput, setDropdownOptionInput] = useState('');
  const [showFullPreview, setShowFullPreview] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    type: 'success' as 'success' | 'error',
    title: '',
    message: '',
  });

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

  const showToastMessage = useCallback((type: 'success' | 'error', title: string, message: string, duration: number) => {
    setToastConfig({ type, title, message });
    setShowToast(true);
    setTimeout(() => setShowToast(false), duration);
  }, []);

  // Create scholarship object for preview
  const previewScholarship = {
    type: type,
    purpose: purpose,
    title: title,
    description: description,
    image_url: imageUrl,
    total_amount: totalAmount ? parseFloat(totalAmount) : 0,
    total_slot: totalSlot ? parseInt(totalSlot) : 0,
    application_deadline: applicationDeadline ? applicationDeadline.toISOString() : '',
    criteria: criteria,
    required_documents: requiredDocuments,
    sponsor: {
      name: 'iSkolar',
      profile_url: 'src/logo.svg',
    },
  };

  const renderFieldTypeIcon = (fieldType: CustomFieldType) => {
    const iconProps = { size: 18, className: "text-secondary" };
    const icons = {
      text: <TypeIcon {...iconProps} />,
      textarea: <AlignLeft {...iconProps} />,
      dropdown: <ListChecks {...iconProps} />,
      multiple_choice: <ListChecks {...iconProps} />,
      checkbox: <CheckSquare {...iconProps} />,
      number: <Hash {...iconProps} />,
      date: <CalendarIcon {...iconProps} />,
      email: <Mail {...iconProps} />,
      phone: <Phone {...iconProps} />,
      file: <Paperclip {...iconProps} />,
    };
    return icons[fieldType] || icons.text;
  };

  const getFieldTypeLabel = (fieldType: CustomFieldType) => {
    const labels = {
      text: 'Short answer',
      textarea: 'Long answer',
      multiple_choice: 'Multiple choice',
      dropdown: 'Dropdown',
      checkbox: 'Checkbox',
      number: 'Number',
      date: 'Date',
      email: 'Email',
      phone: 'Phone number',
      file: 'File upload',
    };
    return labels[fieldType] || fieldType;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setValue('imageUrl', result, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const addCriterion = () => {
    const normalized = normalizeText(criteriaInput);
    if (normalized && !criteria.includes(normalized)) {
      setValue('criteria', [...criteria, normalized]);
      setCriteriaInput('');
    }
  };

  const removeCriterion = (index: number) => {
    setValue('criteria', criteria.filter((_, i) => i !== index));
  };

  const addDocument = () => {
    const normalized = normalizeText(documentsInput);
    if (normalized && !requiredDocuments.includes(normalized)) {
      setValue('requiredDocuments', [...requiredDocuments, normalized]);
      setDocumentsInput('');
    }
  };

  const removeDocument = (index: number) => {
    setValue('requiredDocuments', requiredDocuments.filter((_, i) => i !== index));
  };

  const openCustomFormModal = (index?: number) => {
    if (index !== undefined) {
      const field = customFormFields[index];
      setEditingFieldIndex(index);
      setNewFieldType(field.type);
      setNewFieldLabel(field.label);
      setNewFieldRequired(field.required);
      setDropdownOptions(field.options || []);
    } else {
      setEditingFieldIndex(null);
      setNewFieldType('text');
      setNewFieldLabel('');
      setNewFieldRequired(false);
      setDropdownOptions([]);
    }
    setShowCustomFieldModal(true);
  };

  const saveCustomFormField = () => {
    const normalized = normalizeText(newFieldLabel);
    if (!normalized) return;

    const newField = {
      type: newFieldType,
      label: normalized,
      required: newFieldRequired,
      ...((newFieldType === 'dropdown' || newFieldType === 'checkbox' || newFieldType === 'multiple_choice') && {
        options: normalizeArray(dropdownOptions),
      }),
    };

    if (editingFieldIndex !== null) {
      const updatedFields = customFormFields.map((field, index) => 
        index === editingFieldIndex ? newField : field
      );
      setValue('customFormFields', updatedFields);
    } else {
      setValue('customFormFields', [...customFormFields, newField]);
    }

    setShowCustomFieldModal(false);
    setEditingFieldIndex(null);
    setNewFieldLabel('');
    setNewFieldRequired(false);
    setDropdownOptions([]);
    setDropdownOptionInput('');
  };

  const removeCustomFormField = (index: number) => {
    setValue('customFormFields', customFormFields.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ScholarshipFormData) => {
    setLoading(true);
    
    try {
      // const scholarshipData = {
      //   type: data.type || undefined,
      //   purpose: data.purpose || undefined,
      //   title: data.title.trim(),
      //   description: data.description?.trim() || undefined,
      //   total_amount: parseFloat(data.totalAmount),
      //   total_slot: parseInt(data.totalSlot),
      //   application_deadline: data.applicationDeadline || undefined,
      //   criteria: data.criteria,
      //   required_documents: data.requiredDocuments,
      //   custom_form_fields: data.customFormFields && data.customFormFields.length > 0 ? data.customFormFields : undefined,
      // };

      // const response = await scholarshipManagementService.createScholarship(scholarshipData);

      // if (response.success) {
      //   const scholarshipId = response.scholarship.scholarship_id;

      //   showToastMessage('success', 'Success', response.message, 2000);

      //   reset();
      //   setImagePreview('')
      //   setCriteriaInput('');
      //   setDocumentsInput('');
      // } else {
      //   showToastMessage('error', 'Error', response.message, 2500);
      // }
    } catch(error) {
      console.error('Profile setup error:', error);
      showToastMessage('error', 'Error', 'Failed to create scholarship. Please try again.', 2500);
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Toast visible={showToast} type={toastConfig.type} title={toastConfig.title} message={toastConfig.message} />
      
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
                        onClick={() => {
                          setImagePreview(null);
                          setValue('imageUrl', '', { shouldValidate: true });
                        }}
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
                  onClick={() => {
                    setTempDescription(description || '');
                    setShowDescriptionModal(true);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-[#F3F4F6] border text-[#6B7280] text-sm hover:bg-muted transition-colors"
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

            {customFormFields.length > 0 && (
              <div className="space-y-2 mb-3">
                {customFormFields.map((field, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white border border-[#E0ECFF] rounded-lg">
                    <div className="w-9 h-9 bg-[#E0ECFF] rounded-lg flex items-center justify-center">
                      {renderFieldTypeIcon(field.type as CustomFieldType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm  text-primary">{field.label}</span>
                        {field.required && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded">Required</span>
                        )}
                      </div>
                      <p className="text-xs text-[#6B7280]">{getFieldTypeLabel(field.type as CustomFieldType)}</p>
                    </div>
                    <button disabled={loading} onClick={() => openCustomFormModal(index)} className="p-1.5 hover:bg-gray-100 rounded">
                      <Edit2 size={16} className="text-secondary" />
                    </button>
                    <button disabled={loading} onClick={() => removeCustomFormField(index)} className="p-1.5 hover:bg-gray-100 rounded">
                      <Trash2 size={16} className="text-[#EF4444]" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              disabled={loading}
              onClick={() => openCustomFormModal()}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 border-2 border-dashed ${
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

      {/* Description Modal */}
      {showDescriptionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#F0F7FF] rounded-2xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-secondary">Scholarship Description</h3>
              <button onClick={() => setShowDescriptionModal(false)} className="text-[#4A5568] hover:text-secondary">
                <X size={24} />
              </button>
            </div>
            <textarea
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              placeholder="Enter detailed description of the scholarship program..."
              className="w-full h-48 px-4 py-3 rounded-lg border border-[#C4CBD5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3A52A6] resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowDescriptionModal(false)}
                className="flex-1 py-2.5 border border-[#C4CBD5] rounded-lg text-[#4A5568] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setValue('description', tempDescription);
                  setShowDescriptionModal(false);
                }}
                className="flex-1 py-2.5 bg-[#3A52A6] text-tertiary rounded-lg hover:bg-[#2A4296] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Field Modal */}
      {showCustomFieldModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#F0F7FF] rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-secondary">
                {editingFieldIndex !== null ? 'Edit Field' : 'Add Form Field'}
              </h3>
              <button onClick={() => setShowCustomFieldModal(false)} className="text-[#4A5568] hover:text-secondary">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#4A5568] mb-2">Field Type</label>
                <div className="relative">
                  <Select 
                    value={newFieldType} 
                    onValueChange={(value) => setNewFieldType(value as CustomFieldType)}
                  >
                    <SelectTrigger className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {customFieldTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          <div className="flex items-center gap-2">
                            {renderFieldTypeIcon(type)}
                            <span>{getFieldTypeLabel(type)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#4A5568] mb-2">Field Label</label>
                <input
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  placeholder="e.g., Full Name, Email, etc."
                  className="w-full px-4 py-3 rounded-lg border border-[#C4CBD5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3A52A6]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newFieldRequired}
                    onChange={(e) => setNewFieldRequired(e.target.checked)}
                    className="w-4 h-4 rounded border-[#C4CBD5] text-secondary focus:ring-2 focus:ring-[#3A52A6] accent-[#3A52A6]"
                  />
                  <span className="text-sm text-primary">Required Field</span>
                </label>
              </div>

              {(newFieldType === 'dropdown' || newFieldType === 'checkbox' || newFieldType === 'multiple_choice') && (
                <div>
                  <label className="block text-sm text-[#4A5568] mb-2">
                    {newFieldType === 'checkbox'
                      ? 'Checkbox Options'
                      : newFieldType === 'multiple_choice'
                      ? 'Choices'
                      : 'Dropdown Options'}
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={dropdownOptionInput}
                      onChange={(e) => setDropdownOptionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const normalized = normalizeText(dropdownOptionInput);
                          if (normalized && !dropdownOptions.includes(normalized)) {
                            setDropdownOptions([...dropdownOptions, normalized]);
                            setDropdownOptionInput('');
                          }
                        }
                      }}
                      placeholder="Enter option"
                      className="flex-1 px-4 py-3 rounded-lg border border-[#C4CBD5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3A52A6]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const trimmed = dropdownOptionInput.trim();
                        if (trimmed && !dropdownOptions.includes(trimmed)) {
                          setDropdownOptions([...dropdownOptions, trimmed]);
                          setDropdownOptionInput('');
                        }
                      }}
                      className="w-11 h-11 bg-[#3A52A6] text-tertiary rounded-lg flex items-center justify-center hover:bg-[#2A4296] transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  {dropdownOptions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {dropdownOptions.map((option, index) => (
                        <span key={index} className="inline-flex items-center gap-2 px-3 py-2 border border-border bg-[#F9FAFB] text-primary text-xs rounded-md">
                          {option}
                          <button
                            onClick={() => setDropdownOptions(dropdownOptions.filter((_, i) => i !== index))}
                            className="hover:text-[#2A4296] cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCustomFieldModal(false);
                  setEditingFieldIndex(null);
                  setNewFieldLabel('');
                  setNewFieldRequired(false);
                  setDropdownOptions([]);
                  setDropdownOptionInput('');
                }}
                className="flex-1 py-2.5 border border-[#C4CBD5] cursor-pointer text-sm rounded-md text-[#4A5568] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveCustomFormField}
                className="flex-1 py-2.5 bg-[#3A52A6] cursor-pointer text-sm text-tertiary rounded-md hover:bg-[#2A4296] transition-colors"
              >
                {editingFieldIndex !== null ? 'Update' : 'Add'} Field
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Preview Modal */}
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