import { useCallback, useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
} from '@/components/ui/select';
import Toast from '@/components/Toast';
import { usePageTitle } from '@/hooks/use-page-title';
import type { Scholarship } from '@/types/scholarship.types';
import { scholarshipManagementService } from '@/services/scholarship-management.service';

export const Route = createFileRoute('/_sponsor/scholarship/$id/edit')({
  component: EditScholarshipPage,
});

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

const editScholarshipSchema = z.object({
  type: z.enum(['merit_based', 'skill_based'], { message: 'Please select a scholarship type' }),
  purpose: z.enum(['allowance', 'tuition'], { message: 'Please select a purpose' }),
  status: z.enum(['active', 'closed'], { message: 'Please select a status' }),
  title: z.string().min(1, 'Scholarship title is required').max(150, 'Title must be less than 150 characters'),
  description: z.string().optional(),
  imageUrl: z.string().min(1, 'Please upload a scholarship image'),
  totalAmount: z.string()
    .min(1, 'Total amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Please enter a valid amount greater than 0',
    }),
  totalSlot: z.string()
    .min(1, 'Total slot is required')
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
      message: 'Please enter a valid slot number greater than 0',
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

type EditScholarshipFormData = z.infer<typeof editScholarshipSchema>;

function EditScholarshipPage() {
  usePageTitle('Edit');

  const { id } = Route.useParams();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<EditScholarshipFormData>({
    resolver: zodResolver(editScholarshipSchema),
    mode: 'onBlur',
    defaultValues: {
      type: undefined,
      purpose: undefined,
      status: 'active',
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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    type: 'success' as 'success' | 'error',
    title: '',
    message: '',
  });
  const [showToast, setShowToast] = useState(false);

  const criteria = watch('criteria');
  const requiredDocuments = watch('requiredDocuments');
  const customFormFields = watch('customFormFields') || [];
  const description = watch('description');
  const type = watch('type');
  const purpose = watch('purpose');
  const status = watch('status');

  const showToastMessage = useCallback((type: 'success' | 'error', title: string, message: string) => {
    setToastConfig({ type, title, message });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }, []);

  const loadScholarshipDetails = useCallback(async () => {
    setLoading(true);
    try {
      // const response = await scholarshipManagementService.getScholarshipById(id);
      // if (response.success && response.scholarship) {
      //   hydrateForm(response.scholarship);
      //   return;
      // }

      // Mocked placeholder while integration is pending
      const mockScholarship: Scholarship = {
        scholarship_id: '1',
        sponsor_id: '1',
        status: 'active',
        type: 'merit_based',
        purpose: 'tuition',
        title: 'CHED Merit Scholarship Program',
        description: 'A sample description for the scholarship program.',
        total_amount: 250000,
        total_slot: 25,
        application_deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
        criteria: ['Minimum GWA of 1.75', 'STEM Strand Graduate'],
        required_documents: ['Birth Certificate', 'Report Card'],
        custom_form_fields: [
          { type: 'text', label: 'Full Name', required: true },
          { type: 'email', label: 'Email Address', required: true },
          { type: 'file', label: 'Upload Transcript', required: true },
        ],
        image_url: '/src/logo.svg',
        sponsor: {
          name: 'Sponsor Name',
          email: 'sponsor@example.com',
          profile_url: 'src/logo.svg',
        },
        applications_count: 120,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      hydrateForm(mockScholarship);
    } catch (error) {
      console.error('Failed to load scholarship:', error);
      showToastMessage('error', 'Error', 'Unable to load scholarship details.');
    } finally {
      setLoading(false);
    }
  }, [id, reset, showToastMessage]);

  const hydrateForm = useCallback((scholarship: Scholarship) => {
    reset({
      type: (scholarship.type as 'merit_based' | 'skill_based') ?? 'merit_based',
      purpose: (scholarship.purpose as 'allowance' | 'tuition') ?? 'allowance',
      status: (scholarship.status === 'closed' ? 'closed' : 'active') as 'active' | 'closed',
      title: scholarship.title || '',
      description: scholarship.description || '',
      imageUrl: scholarship.image_url || '/src/logo.svg',
      totalAmount: scholarship.total_amount ? String(scholarship.total_amount) : '',
      totalSlot: scholarship.total_slot ? String(scholarship.total_slot) : '',
      applicationDeadline: scholarship.application_deadline ? new Date(scholarship.application_deadline) : undefined,
      criteria: scholarship.criteria || [],
      requiredDocuments: scholarship.required_documents || [],
      customFormFields: scholarship.custom_form_fields || [],
    });
    setImagePreview(scholarship.image_url || null);
  }, [reset]);

  useEffect(() => {
    loadScholarshipDetails();
  }, [loadScholarshipDetails]);

  const renderFieldTypeIcon = (fieldType: CustomFieldType) => {
    const iconProps = { size: 18, className: 'text-[#3A52A6]' };
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
    const trimmed = criteriaInput.trim();
    if (trimmed) {
      setValue('criteria', [...criteria, trimmed], { shouldValidate: true });
      setCriteriaInput('');
    }
  };

  const removeCriterion = (index: number) => {
    setValue('criteria', criteria.filter((_, i) => i !== index), { shouldValidate: true });
  };

  const addDocument = () => {
    const trimmed = documentsInput.trim();
    if (trimmed) {
      setValue('requiredDocuments', [...requiredDocuments, trimmed], { shouldValidate: true });
      setDocumentsInput('');
    }
  };

  const removeDocument = (index: number) => {
    setValue('requiredDocuments', requiredDocuments.filter((_, i) => i !== index), { shouldValidate: true });
  };

  const openCustomFormModal = (index?: number) => {
    if (typeof index === 'number') {
      const field = customFormFields[index];
      setEditingFieldIndex(index);
      setNewFieldType(field.type as CustomFieldType);
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
    setDropdownOptionInput('');
    setShowCustomFieldModal(true);
  };

  const resetCustomFieldState = () => {
    setShowCustomFieldModal(false);
    setEditingFieldIndex(null);
    setNewFieldLabel('');
    setNewFieldRequired(false);
    setDropdownOptions([]);
    setDropdownOptionInput('');
  };

  const saveCustomFormField = () => {
    if (!newFieldLabel.trim()) return;

    const newField = {
      type: newFieldType,
      label: newFieldLabel.trim(),
      required: newFieldRequired,
      ...((newFieldType === 'dropdown' || newFieldType === 'checkbox' || newFieldType === 'multiple_choice') && dropdownOptions.length > 0
        ? { options: dropdownOptions }
        : {}),
    };

    if (editingFieldIndex !== null) {
      const updatedFields = customFormFields.map((field, index) =>
        index === editingFieldIndex ? newField : field
      );
      setValue('customFormFields', updatedFields, { shouldValidate: true });
    } else {
      setValue('customFormFields', [...customFormFields, newField], { shouldValidate: true });
    }

    resetCustomFieldState();
  };

  const removeCustomFormField = (index: number) => {
    setValue('customFormFields', customFormFields.filter((_, i) => i !== index), { shouldValidate: true });
  };

  const onSubmit = async (data: EditScholarshipFormData) => {
    setSaving(true);
    try {
      // const updatePayload = {
      //   type: data.type,
      //   purpose: data.purpose,
      //   status: data.status,
      //   title: data.title.trim(),
      //   description: data.description?.trim(),
      //   total_amount: parseFloat(data.totalAmount),
      //   total_slot: parseInt(data.totalSlot, 10),
      //   application_deadline: data.applicationDeadline,
      //   criteria: data.criteria,
      //   required_documents: data.requiredDocuments,
      //   custom_form_fields: data.customFormFields,
      // };
      //
      // const result = await scholarshipManagementService.updateScholarship(id, updatePayload);
      //
      // if (result.success) {
      //   showToastMessage('success', 'Updated', result.message');
      //   return;
      // }
      //
      // showToastMessage('error', 'Error', result.message || 'Failed to update scholarship.');

      showToastMessage('success', 'Mock Update', `"${data.title}" saved.`);
    } catch (error) {
      console.error('Failed to update scholarship:', error);
      showToastMessage('error', 'Error', 'Failed to update scholarship. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-[#3A52A6]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading scholarship details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Toast visible={showToast} type={toastConfig.type} title={toastConfig.title} message={toastConfig.message} />
      <div className="max-w-[40rem] mx-auto">
        <div className="space-y-4">
          {/* Status */}
          <div>
            <Select
              value={status}
              onValueChange={(value) =>
                setValue('status', value as 'active' | 'closed', { shouldValidate: true })
              }
            >
              <SelectTrigger
                disabled={saving}
                className={`w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.status
                    ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]'
                    : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]'
                }`}
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-xs text-[#EF4444] mt-1">{errors.status.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select
                value={type}
                onValueChange={(value) =>
                  setValue('type', value as 'merit_based' | 'skill_based', { shouldValidate: true })
                }
              >
                <SelectTrigger
                  disabled={saving}
                  className={`w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all data-[placeholder]:text-gray-400 ${
                    errors.type
                      ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]'
                      : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]'
                  }`}
                >
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
                onValueChange={(value) =>
                  setValue('purpose', value as 'allowance' | 'tuition', { shouldValidate: true })
                }
              >
                <SelectTrigger
                  disabled={saving}
                  className={`w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all data-[placeholder]:text-gray-400 ${
                    errors.purpose
                      ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]'
                      : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]'
                  }`}
                >
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

          <div className="bg-[#F8F9FC] rounded-xl p-4 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-[218px]">
                <label className="block">
                  {imagePreview ? (
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                      <img src={imagePreview} alt="Scholarship banner" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => {
                          setImagePreview(null);
                          setValue('imageUrl', '', { shouldValidate: true });
                        }}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`border-2 border-dashed ${
                        errors.imageUrl ? 'border-[#EF4444]' : 'border-[#3A52A6]'
                      } rounded-lg text-center cursor-pointer hover:bg-[#F0F7FF] transition-colors flex flex-col items-center justify-center w-full aspect-square px-4`}
                    >
                      <Upload className="mb-3 text-[#5B7BA6]" size={40} />
                      <p className="text-[#3A52A6] text-sm opacity-70">Click to select an image</p>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </div>
                  )}
                </label>
                {errors.imageUrl && <p className="text-xs text-[#EF4444] mt-1">{errors.imageUrl.message}</p>}
              </div>

              <div className="md:flex-1 space-y-4">
                <div>
                  <Controller
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <input
                        {...field}
                        placeholder="Scholarship Title"
                        disabled={saving}
                        className={`w-full text-2xl border-b-2 ${
                          errors.title ? 'border-[#EF4444]' : 'border-transparent'
                        } bg-transparent pb-2 focus:outline-none focus:border-[#3A52A6] text-[#111827]`}
                      />
                    )}
                  />
                  {errors.title && <p className="text-xs text-[#EF4444] mt-1">{errors.title.message}</p>}
                </div>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setTempDescription(description || '');
                    setShowDescriptionModal(true);
                  }}
                  className="w-full cursor-pointer flex items-center gap-2 px-4 py-3 rounded-lg border bg-[#F3F4F6] text-[#6B7280] text-sm hover:bg-[#E5E7EB] transition-colors"
                >
                  <span className="text-[#8B9CB5]">☰</span>
                  {description ? 'Edit Description' : 'Add Description'}
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Controller
                      control={control}
                      name="totalAmount"
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          disabled={saving}
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
                          disabled={saving}
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

                <div>
                  <Controller
                    control={control}
                    name="applicationDeadline"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            disabled={saving}
                            className={`w-full px-4 py-3 text-sm border rounded-lg bg-[#F8F9FC] focus:outline-none focus:ring-2 focus:ring-[#3A52A6] flex items-center justify-between ${
                              field.value ? 'text-[#111827]' : 'text-gray-400'
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
                  {errors.applicationDeadline && (
                    <p className="text-xs text-[#EF4444] mt-1">{errors.applicationDeadline.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex gap-2">
              <input
                value={criteriaInput}
                disabled={saving}
                onChange={(event) => setCriteriaInput(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && (event.preventDefault(), addCriterion())}
                placeholder="Enter eligibility criterion"
                className={`flex-1 px-4 py-3 rounded-lg border ${
                  errors.criteria ? 'border-[#EF4444]' : 'border-[#C4CBD5]'
                } bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#3A52A6]`}
              />
              <button
                type="button"
                disabled={saving}
                onClick={addCriterion}
                className="w-11 h-11 bg-[#3A52A6] text-white rounded-lg flex items-center justify-center hover:bg-[#2A4296] transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            {errors.criteria && <p className="text-xs text-[#EF4444] mt-1">{errors.criteria.message}</p>}
            {criteria.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {criteria.map((criterion, index) => (
                  <span key={index} className="inline-flex items-center gap-2 px-3 py-2 bg-[#F9FAFB] text-[#374151] text-xs rounded-md border border-[#E5E7EB]">
                    {criterion}
                    <button disabled={saving} onClick={() => removeCriterion(index)} className="hover:text-[#2A4296]">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex gap-2">
              <input
                value={documentsInput}
                disabled={saving}
                onChange={(event) => setDocumentsInput(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && (event.preventDefault(), addDocument())}
                placeholder="Enter required document"
                className={`flex-1 px-4 py-3 rounded-lg border ${
                  errors.requiredDocuments ? 'border-[#EF4444]' : 'border-[#C4CBD5]'
                } bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#3A52A6]`}
              />
              <button
                type="button"
                disabled={saving}
                onClick={addDocument}
                className="w-11 h-11 bg-[#3A52A6] text-white rounded-lg flex items-center justify-center hover:bg-[#2A4296] transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            {errors.requiredDocuments && (
              <p className="text-xs text-[#EF4444] mt-1">{errors.requiredDocuments.message}</p>
            )}
            {requiredDocuments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {requiredDocuments.map((doc, index) => (
                  <span key={index} className="inline-flex items-center gap-2 px-3 py-2 bg-[#F9FAFB] text-[#374151] text-xs rounded-md border border-[#E5E7EB]">
                    {doc}
                    <button disabled={saving} onClick={() => removeDocument(index)} className="hover:text-[#2A4296]">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-3">
              <label className="block text-sm text-[#4A5568] mb-1 ml-0.5">Application Form</label>
              <p className="text-xs text-[#6B7280] ml-0.5">Maintain the form fields applicants complete when applying.</p>
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
                        <span className="text-sm text-[#111827]">{field.label}</span>
                        {field.required && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded">Required</span>
                        )}
                      </div>
                      <p className="text-xs text-[#6B7280]">{getFieldTypeLabel(field.type as CustomFieldType)}</p>
                    </div>
                    <button disabled={saving} onClick={() => openCustomFormModal(index)} className="p-1.5 hover:bg-gray-100 rounded">
                      <Edit2 size={16} className="text-[#3A52A6]" />
                    </button>
                    <button disabled={saving} onClick={() => removeCustomFormField(index)} className="p-1.5 hover:bg-gray-100 rounded">
                      <Trash2 size={16} className="text-[#EF4444]" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              disabled={saving}
              onClick={() => openCustomFormModal()}
              className={`w-full flex cursor-pointer items-center justify-center gap-2 px-4 py-3.5 border-2 border-dashed ${
                errors.customFormFields ? 'border-[#EF4444]' : 'border-[#3A52A6]'
              } bg-[#E0ECFF] text-[#3A52A6] text-sm rounded-lg hover:bg-[#D0DCFF] transition-colors`}
            >
              <Plus size={20} />
              {customFormFields.length === 0 ? 'Add Form Field' : 'Add Another Field'}
            </button>
            {errors.customFormFields && (
              <p className="text-xs text-[#EF4444] mt-1">{errors.customFormFields.message}</p>
            )}
          </div>

          <button
            onClick={handleSubmit(onSubmit)}
            className={`w-full py-3 cursor-pointer bg-[#EFA508] my-2 text-white rounded-lg hover:bg-[#D89407] transition-colors ${
              saving && 'opacity-60 cursor-not-allowed'
            }`}
            disabled={saving}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
              </span>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>

      {showDescriptionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#F0F7FF] rounded-2xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-[#3A52A6]">Scholarship Description</h3>
              <button onClick={() => setShowDescriptionModal(false)} className="text-[#4A5568] cursor-pointer hover:text-[#3A52A6]">
                <X size={22} />
              </button>
            </div>
            <textarea
              value={tempDescription}
              onChange={(event) => setTempDescription(event.target.value)}
              placeholder="Enter detailed description of the scholarship program..."
              className="w-full h-48 px-4 py-3 rounded-lg border border-[#C4CBD5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3A52A6] resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowDescriptionModal(false)}
                className="flex-1 py-2.5 cursor-pointer border border-[#C4CBD5] rounded-lg text-sm text-[#4A5568] bg-gray-50 hover:bg-[#F0F7FF] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setValue('description', tempDescription);
                  setShowDescriptionModal(false);
                }}
                className="flex-1 py-2.5 cursor-pointer bg-[#3A52A6] text-sm text-[#F0F7FF] rounded-lg hover:bg-[#2A4296] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showCustomFieldModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#F0F7FF] rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-[#3A52A6]">
                {editingFieldIndex !== null ? 'Edit Field' : 'Add Form Field'}
              </h3>
              <button onClick={resetCustomFieldState} className="text-[#4A5568] hover:text-[#3A52A6]">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#4A5568] mb-2">Field Type</label>
                <Select value={newFieldType} onValueChange={(value) => setNewFieldType(value as CustomFieldType)}>
                  <SelectTrigger className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]">
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

              <div>
                <label className="block text-sm text-[#4A5568] mb-2">Field Label</label>
                <input
                  value={newFieldLabel}
                  onChange={(event) => setNewFieldLabel(event.target.value)}
                  placeholder="e.g., Full Name, Email, etc."
                  className="w-full px-4 py-3 rounded-lg border border-[#C4CBD5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3A52A6]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newFieldRequired}
                    onChange={(event) => setNewFieldRequired(event.target.checked)}
                    className="w-5 h-5 rounded border-[#C4CBD5] text-[#3A52A6] focus:ring-2 focus:ring-[#3A52A6] accent-[#3A52A6]"
                  />
                  <span className="text-sm text-[#111827]">Required Field</span>
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
                      onChange={(event) => setDropdownOptionInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          const trimmed = dropdownOptionInput.trim();
                          if (trimmed && !dropdownOptions.includes(trimmed)) {
                            setDropdownOptions([...dropdownOptions, trimmed]);
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
                      className="w-11 h-11 bg-[#3A52A6] text-white rounded-lg flex items-center justify-center hover:bg-[#2A4296] transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  {dropdownOptions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {dropdownOptions.map((option, index) => (
                        <span key={index} className="inline-flex items-center gap-2 px-3 py-2 bg-[#E0ECFF] text-[#3A52A6] text-sm rounded-lg">
                          {option}
                          <button
                            onClick={() => setDropdownOptions(dropdownOptions.filter((_, i) => i !== index))}
                            className="hover:text-[#2A4296]"
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
                onClick={resetCustomFieldState}
                className="flex-1 py-2.5 cursor-pointer border border-[#C4CBD5] text-sm rounded-lg text-[#4A5568] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveCustomFormField}
                className="flex-1 py-2.5 cursor-pointer bg-[#3A52A6] text-white text-sm rounded-lg hover:bg-[#2A4296] transition-colors"
              >
                {editingFieldIndex !== null ? 'Update' : 'Add'} Field
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}