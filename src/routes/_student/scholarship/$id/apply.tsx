import { useCallback, useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Calendar,
  Upload,
  X,
  Loader2,
  AlertCircle,
  CalendarDays,
} from 'lucide-react';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { Skeleton } from '@/components/ui/skeleton';
import type { Scholarship, CustomFormField } from '@/types/scholarship.types';
import { usePageTitle } from '@/hooks/usePageTitle';
import { compressFile } from '@/utils/fileCompression';
import { normalizeText, normalizeEmail, normalizePhone, normalizeNumber } from '@/utils/normalize';
import { handleError } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';
import { mockScholarshipDetails, mockApiDelay } from '@/mocks/scholarshipDetails.mock';
import { scholarshipApplicationService } from '@/services/scholarshipApplication.service';
import { scholarshipManagementService } from '@/services/scholarshipManagement.service';

const USE_MOCK_DATA = true;

export const Route = createFileRoute('/_student/scholarship/$id/apply')({
  component: ApplyScholarshipPage,
});

// Helper schema builder
const buildValidationSchema = (fields: CustomFormField[]) => {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    const fieldKey = field.label;

    switch (field.type) {
      case 'text':
      case 'textarea':
        schemaObject[fieldKey] = field.required
          ? z.string().min(1, `${field.label} is required`)
          : z.string().optional();
        break;

      case 'email':
        schemaObject[fieldKey] = field.required
          ? z.string().min(1, `${field.label} is required`).email(`${field.label} must be a valid email`)
          : z.string().email(`${field.label} must be a valid email`).optional().or(z.literal(''));
        break;

      case 'phone':
        const phoneValidation = z.string().refine((val) => {
          if (!val) return true;
          const phoneDigits = val.replace(/\D/g, '');
          return phoneDigits.length >= 10 && phoneDigits.length <= 12;
        }, `${field.label} must be a valid phone number`);
        
        schemaObject[fieldKey] = field.required
          ? phoneValidation.min(1, `${field.label} is required`)
          : phoneValidation.optional();
        break;

      case 'number':
        schemaObject[fieldKey] = field.required
          ? z.string().min(1, `${field.label} is required`).refine((val) => !isNaN(Number(val)), `${field.label} must be a valid number`)
          : z.string().refine((val) => !val || !isNaN(Number(val)), `${field.label} must be a valid number`).optional();
        break;

      case 'date':
        schemaObject[fieldKey] = field.required
          ? z.string().min(1, `${field.label} is required`)
          : z.string().optional();
        break;

      case 'dropdown':
      case 'multiple_choice':
        if (field.options && field.options.length > 0) {
          schemaObject[fieldKey] = field.required
            ? z.enum([field.options[0], ...field.options.slice(1)] as [string, ...string[]], { message: `${field.label} is required` })
            : z.enum([field.options[0], ...field.options.slice(1)] as [string, ...string[]]).optional().or(z.literal(''));
        } else {
          schemaObject[fieldKey] = field.required
            ? z.string().min(1, `${field.label} is required`)
            : z.string().optional();
        }
        break;

      case 'checkbox':
        if (field.options && field.options.length > 0) {
          const checkboxValidation = z.array(z.enum([field.options[0], ...field.options.slice(1)] as [string, ...string[]]));
          schemaObject[fieldKey] = field.required
            ? checkboxValidation.min(1, `${field.label} requires at least one selection`)
            : checkboxValidation.optional();
        } else {
          schemaObject[fieldKey] = field.required
            ? z.array(z.string()).min(1, `${field.label} requires at least one selection`)
            : z.array(z.string()).optional();
        }
        break;

      case 'file':
        schemaObject[fieldKey] = z.any().optional();
        break;

      default:
        schemaObject[fieldKey] = field.required
          ? z.string().min(1, `${field.label} is required`)
          : z.string().optional();
    }
  });

  return z.object(schemaObject);
};

function ApplyScholarshipPage() {
  usePageTitle('Apply');

  const { id } = Route.useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scholarship, setScholarship] = useState<Partial<Scholarship> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingData, setPendingData] = useState<Record<string, any> | null>(null);
  const [customFiles, setCustomFiles] = useState<Record<string, File[]>>({});
  const { toast, showSuccess, showError } = useToast();

  const customFields = scholarship?.custom_form_fields || [];
  const validationSchema = buildValidationSchema(customFields);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(validationSchema),
    mode: 'onBlur',
    defaultValues: customFields.reduce((acc, field) => {
      acc[field.label] = field.type === 'checkbox' ? [] : '';
      return acc;
    }, {} as Record<string, any>),
  });

  const fetchScholarshipDetails = useCallback(async () => {
    setLoading(true);
    try {
      if (USE_MOCK_DATA) {
        // Mock data path
        await mockApiDelay(2000);
        setScholarship(mockScholarshipDetails);
        
        const defaultValues = mockScholarshipDetails.custom_form_fields?.reduce((acc, field) => {
          acc[field.label] = field.type === 'checkbox' ? [] : '';
          return acc;
        }, {} as Record<string, any>);
        reset(defaultValues);
      } else {
        const response = await scholarshipManagementService.getScholarshipById(id);
        if (response.success && response.scholarship) {
          setScholarship(response.scholarship);
          const defaultValues = response.scholarship.custom_form_fields?.reduce((acc, field) => {
            acc[field.label] = field.type === 'checkbox' ? [] : '';
            return acc;
          }, {} as Record<string, any>);
          reset(defaultValues);
        }
      }
    } catch (err) {
      const handled = handleError(err, 'Failed to connect to server.');
      logger.error('Fetch scholarship details error:', handled.raw);
      setError(handled.message);
    } finally {
      setLoading(false);
    }
  }, [id, reset]);

  useEffect(() => {
    fetchScholarshipDetails();
  }, [fetchScholarshipDetails]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleFileUpload = async (fieldLabel: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;
    
    const file = files[0];
    
    // Validate file size 
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      showError('File Too Large', `Maximum file size is 10MB.`, 2500);
      event.target.value = ''; 
      return;
    }
    
    // Validate file type 
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];
    
    if (!allowedTypes.includes(file.type)) {
      showError('Invalid File Type', 'Only PDF and image files are allowed', 2500);
      event.target.value = ''; 
      return;
    }
    
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(fileExtension)) {
      showError('Invalid File Extension', 'File extension does not match allowed types', 2500);
      event.target.value = '';
      return;
    }
    
    try {
      // Compress the file
      const compressedFile = await compressFile(file);
      
      setCustomFiles(prev => ({
        ...prev,
        [fieldLabel]: [compressedFile],
      }));
    } catch (error) {
      logger.error('File compression error:', error);
      showError('Compression Failed', 'Using original file', 2000);
      
      setCustomFiles(prev => ({
        ...prev,
        [fieldLabel]: [file],
      }));
    }

    event.target.value = '';
  };

  const removeFile = (fieldLabel: string, index: number) => {
    setCustomFiles(prev => ({
      ...prev,
      [fieldLabel]: (prev[fieldLabel] || []).filter((_, i) => i !== index),
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); 
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = (data: Record<string, any>) => {
    const normalizedData = { ...data };
    
    customFields.forEach(field => {
      const value = normalizedData[field.label];
      
      if (!value || (typeof value === 'string' && value.trim() === '')) return;
      
      // Normalize based on field type
      switch (field.type) {
        case 'text':
        case 'textarea':
          normalizedData[field.label] = normalizeText(value);
          break;
        
        case 'email':
          normalizedData[field.label] = normalizeEmail(value);
          break;
        
        case 'phone':
          normalizedData[field.label] = normalizePhone(value);
          break;
        
        case 'number':
          normalizedData[field.label] = normalizeNumber(value);
          break;
        
        case 'checkbox':
          if (Array.isArray(value)) {
            normalizedData[field.label] = value.map(v => normalizeText(v));
          }
          break;
      }
    });

    const fileErrors: string[] = [];
    customFields.forEach(field => {
      if (field.type === 'file' && field.required) {
        const files = customFiles[field.label] || [];
        if (files.length === 0) {
          fileErrors.push(`${field.label} is required`);
        }
      }
    });

    if (fileErrors.length > 0) {
      showError('Missing Required Files', fileErrors.join(', '), 2500);
      return;
    }

    setPendingData(normalizedData);
    setShowConfirmation(true);
  };

  const processSubmission = async () => {
    if (!pendingData) return;

    setSubmitting(true);
    setShowConfirmation(false);

    try {
      if (USE_MOCK_DATA) {
        // Mock submission
        await mockApiDelay(2000);
        showSuccess('Success', 'Application submitted successfully', 2000);
        
        setTimeout(() => {
          window.history.back();
        }, 1500);
      } else {
        const response = await scholarshipApplicationService.checkApplicationExists(String(scholarship?.scholarship_id));

        if (response.success) {
          showError('Already Applied', response.message, 2500);
          return;
        }

        // Transform form data into custom_form_response format
        const customFormResponse = Object.entries(pendingData).map(([label, value]) => ({
          label,
          value,
        }));

        // Submit application (without files first)
        const submitResult = await scholarshipApplicationService.submitApplication(
          id,
          customFormResponse
        );

        if (!submitResult.success) {
          throw new Error(submitResult.message);
        }

        const applicationId = submitResult.application?.scholarship_application_id;

        if (!applicationId) {
          throw new Error('Application ID not returned from server');
        }

        // Upload files if any exist
        const fileUploadPromises: Promise<any>[] = [];

        for (const [fieldKey, files] of Object.entries(customFiles)) {
          if (files.length > 0) {
            const filesData = await Promise.all(
              files.map(async (file) => ({
                uri: await fileToBase64(file),
                name: file.name,
                mimeType: file.type,
                size: file.size,
              }))
            );

            fileUploadPromises.push(
              scholarshipApplicationService.uploadApplicationFiles(
                applicationId,
                fieldKey,
                filesData
              )
            );
          }
        }

        if (fileUploadPromises.length > 0) {
          const uploadResults = await Promise.all(fileUploadPromises);
          
          const failedUploads = uploadResults.filter(response => !response.success);
          if (failedUploads.length > 0) {
            logger.warn('Some files failed to upload:', failedUploads);
          }
        }

        showSuccess('Success', 'Application submitted successfully', 2000);
        
        setTimeout(() => {
          window.history.back();
        }, 1500);
      }
    } catch (error) {
      const handled = handleError(error, 'Failed to submit application.');
      logger.error('Submission error:', handled.raw);
      showError(`Error ${handled.code}`, handled.message, 2500);
    } finally {
      setSubmitting(false);
    }
  };

  const renderFormField = (field: CustomFormField, index: number) => {
    const fieldKey = field.label;
    const fieldError = errors[fieldKey];

    return (
      <div key={`${fieldKey}-${index}`} className="space-y-2">
        <label className="block text-xs md:text-sm text-primary">
          {field.label}
          {field.required && <span className="text-[#EF4444] ml-1">*</span>}
        </label>

        {field.type === 'text' && (
          <Controller
            control={control}
            name={fieldKey}
            render={({ field: { onChange, onBlur, value } }) => (
              <input
                type="text"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className={`w-full px-4 py-3 rounded-lg border ${
                  fieldError ? 'border-[#EF4444]' : 'border-[#E0ECFF]'
                } bg-[#F6F9FF] text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#3A52A6] text-primary`}
              />
            )}
          />
        )}

        {field.type === 'textarea' && (
          <Controller
            control={control}
            name={fieldKey}
            render={({ field: { onChange, onBlur, value } }) => (
              <textarea
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border ${
                  fieldError ? 'border-[#EF4444]' : 'border-[#E0ECFF]'
                } bg-[#F6F9FF] text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#3A52A6] resize-none text-primary`}
              />
            )}
          />
        )}

        {field.type === 'number' && (
          <Controller
            control={control}
            name={fieldKey}
            render={({ field: { onChange, onBlur, value } }) => (
              <input
                type="number"
                step="0.01"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className={`w-full px-4 py-3 rounded-lg border ${
                  fieldError ? 'border-[#EF4444]' : 'border-[#E0ECFF]'
                } bg-[#F6F9FF] text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#3A52A6] text-primary`}
              />
            )}
          />
        )}

        {field.type === 'email' && (
          <Controller
            control={control}
            name={fieldKey}
            render={({ field: { onChange, onBlur, value } }) => (
              <input
                type="email"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className={`w-full px-4 py-3 rounded-lg border ${
                  fieldError ? 'border-[#EF4444]' : 'border-[#E0ECFF]'
                } bg-[#F6F9FF] text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#3A52A6] text-primary`}
              />
            )}
          />
        )}

        {field.type === 'phone' && (
          <Controller
            control={control}
            name={fieldKey}
            render={({ field: { onChange, onBlur, value } }) => (
              <input
                type="tel"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="09XX XXX XXXX"
                className={`w-full px-4 py-3 rounded-lg border ${
                  fieldError ? 'border-[#EF4444]' : 'border-[#E0ECFF]'
                } bg-[#F6F9FF] text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#3A52A6] text-primary`}
              />
            )}
          />
        )}

        {field.type === 'date' && (
          <Controller
            control={control}
            name={fieldKey}
            render={({ field: { onChange, value } }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={`w-full px-4 py-3 text-xs md:text-sm border rounded-lg bg-[#F6F9FF] focus:outline-none focus:ring-2 focus:ring-[#3A52A6] flex items-center justify-between ${
                      value ? 'text-primary' : 'text-[#9CA3AF]'
                    } ${fieldError ? 'border-[#EF4444]' : 'border-[#E0ECFF]'}`}
                  >
                    <span>
                      {value ? formatDate(value) : `Select ${field.label.toLowerCase()}`}
                    </span>
                    <Calendar className="h-4 w-4 opacity-60" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarPicker
                    mode="single"
                    selected={value ? new Date(value) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        onChange(date.toISOString().split('T')[0]);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        )}

        {field.type === 'dropdown' && field.options && (
          <Controller
            control={control}
            name={fieldKey}
            render={({ field: { onChange, value } }) => (
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger
                  className={`w-full px-4 py-3 text-xs md:text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all data-[placeholder]:text-[#9CA3AF] ${
                    fieldError
                      ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]'
                      : 'border-[#E0ECFF] focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                  } bg-[#F6F9FF]`}
                >
                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option, idx) => (
                    <SelectItem key={idx} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {field.type === 'multiple_choice' && field.options && (
          <Controller
            control={control}
            name={fieldKey}
            render={({ field: { onChange, value } }) => (
              <div className="space-y-1">
                {field.options?.map((option, idx) => {
                  const isSelected = value === option;

                  return (
                    <label
                      key={idx}
                      className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-[#F0F7FF] rounded-lg transition-colors"
                    >
                      <input
                        type="radio"
                        name={fieldKey}
                        checked={isSelected}
                        onChange={() => onChange(option)}
                        className="w-3 h-3 md:w-4 md:h-4 border-[#C4CBD5] text-secondary focus:ring-2 focus:ring-[#3A52A6] accent-[#3A52A6]"
                      />
                      <span className="text-xs md:text-sm text-primary">{option}</span>
                    </label>
                  );
                })}
              </div>
            )}
          />
        )}

        {field.type === 'checkbox' && field.options && (
          <Controller
            control={control}
            name={fieldKey}
            render={({ field: { onChange, value } }) => (
              <div className="space-y-1">
                {field.options?.map((option, idx) => {
                  const selectedValues = Array.isArray(value) ? value : [];
                  const isChecked = selectedValues.includes(option);

                  return (
                    <label
                      key={idx}
                      className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-[#F0F7FF] rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const currentValues = Array.isArray(value) ? [...value] : [];
                          if (isChecked) {
                            onChange(currentValues.filter(v => v !== option));
                          } else {
                            onChange([...currentValues, option]);
                          }
                        }}
                        className="w-3 h-3 md:w-4 md:h-4 rounded border-[#C4CBD5] text-secondary focus:ring-2 focus:ring-[#3A52A6] accent-[#3A52A6]"
                      />
                      <span className="text-xs md:text-sm text-primary">{option}</span>
                    </label>
                  );
                })}
              </div>
            )}
          />
        )}

        {field.type === 'file' && (
          <div className="space-y-3">
            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-[#3A52A6] bg-[#E0ECFF] text-secondary rounded-lg cursor-pointer hover:bg-[#D0DCFF] transition-colors">
              <Upload size={16} />
              <span className="text-[11px] md:text-xs">Upload File</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,"
                onChange={(e) => handleFileUpload(fieldKey, e)}
                className="hidden"
              />
            </label>

            {customFiles[fieldKey] && customFiles[fieldKey].length > 0 && (
              <div className="space-y-2">
                {/* Only show the single file */}
                <div className="flex items-center gap-3 px-4 py-2 bg-[#F6F9FF] border border-[#E0ECFF] rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-primary truncate">{customFiles[fieldKey][0].name}</p>
                    <p className="text-[11px] text-[#6B7280]">{formatFileSize(customFiles[fieldKey][0].size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(fieldKey, 0)}
                    className="p-1 hover:bg-[#EF4444]/10 rounded transition-colors"
                  >
                    <X size={16} className="text-[#EF4444]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {fieldError && (
          <p className="text-xs text-[#EF4444] flex items-center gap-1">
            <AlertCircle size={12} />
            {fieldError.message as string}
          </p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC]">
        <div className="max-w-[40rem] mx-auto space-y-4">
          {/* Scholarship Details Skeleton */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-[#E0ECFF]">
            {/* Title Skeleton */}
            <Skeleton className="h-7 w-full md:h-8 mb-3 bg-muted-foreground" />
            
            {/* Sponsor Info Skeleton */}
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="w-4 h-4 rounded-full bg-muted-foreground" />
              <Skeleton className="h-4 w-48 md:h-5 md:w-56 bg-muted-foreground" />
            </div>
            
            {/* Deadline Skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded bg-muted-foreground" />
              <Skeleton className="h-4 w-40 md:h-5 md:w-48 bg-muted-foreground" />
            </div>
          </div>

          {/* Application Form Skeleton */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-[#E0ECFF]">
            {/* Form Header Skeleton */}
            <Skeleton className="h-5 w-36 md:h-6 md:w-40 mb-1 bg-muted-foreground" />
            <Skeleton className="h-4 w-64 md:h-5 md:w-72 mb-6 md:mb-8 bg-muted-foreground" />

            {/* Form Fields Skeleton */}
            <div className="space-y-5">
              {/* Text Field Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 md:h-5 md:w-28 bg-muted-foreground" />
                <Skeleton className="h-11 w-full rounded-lg bg-muted-foreground" />
              </div>

              {/* Email Field Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 md:h-5 md:w-36 bg-muted-foreground" />
                <Skeleton className="h-11 w-full rounded-lg bg-muted-foreground" />
              </div>

              {/* File Upload Field Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-48 md:h-5 md:w-56 bg-muted-foreground" />
                <Skeleton className="h-12 w-full rounded-lg border-2 border-dashed bg-muted-foreground" />
              </div>
            </div>
          </div>
          
          <Skeleton className="h-10 md:h-12 w-full rounded-lg bg-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-[#EF4444] mx-auto mb-4" />
          <h3 className="text-lg text-primary mb-2">Something went wrong</h3>
          <p className="text-[#5D6673] mb-6">{error}</p>
          <button
            onClick={fetchScholarshipDetails}
            className="px-6 py-2.5 bg-[#3A52A6] text-tertiary rounded-lg hover:bg-[#2A4296] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {toast && <Toast {...toast} />}

      <div className="max-w-[40rem] mx-auto space-y-4">
        {/* Scholarship Details */}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-[#E0ECFF]">
          <h1 className="text-xl md:text-2xl text-primary mb-3">{scholarship?.title}</h1>
          <div className="flex items-center gap-2 text-xs md:text-sm text-[#6B7280] mb-2">
            <div className="flex items-center gap-2">
              <img
                src={scholarship?.sponsor?.profile_url || "src/logo.svg"}
                alt="Sponsor Profile"
                className="w-4 h-4 bg-white/20 rounded-full flex-shrink-0 object-cover overflow-hidden block"
              />
              <span>{scholarship?.sponsor?.name || 'Unknown Sponsor'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm text-[#6B7280]">
            <CalendarDays size={16} />
            <span>{formatDate(scholarship?.application_deadline)}</span>
          </div>
        </div>

        {/* Application Form */}
        {customFields.length > 0 && (
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-[#E0ECFF]">
            <h2 className="text-base md:text-lg text-primary mb-1">Application Form</h2>
            <p className="text-xs md:text-sm text-[#6B7280] mb-6 md:mb-8">
              Please provide the following information requested.
            </p>

            <div className="space-y-5">
              {customFields.map((field, index) => renderFormField(field, index))}
            </div>
            
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={submitting}
          className={`w-full py-3 cursor-pointer text-sm bg-[#EFA508] text-tertiary rounded-md hover:bg-[#D89407] transition-colors flex items-center justify-center gap-2 ${
            submitting && 'opacity-60 cursor-not-allowed'
          }`}
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
            </>
          ) : (
            <span>Submit Application</span>
          )}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#F0F7FF] rounded-2xl p-5 max-w-md w-full">
            <h3 className="text-lg text-primary text-center mb-2">Submit Application?</h3>
            <p className="text-sm text-[#4B5563] text-center mb-6">
              Please review your information before submitting. Once submitted, you cannot modify your application.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className={`flex-1 py-2.5 text-sm cursor-pointer bg-[#CACDD2] text-[#4B5563] rounded-md hover:bg-[#B8BCC2] transition-colors ${
                  submitting && 'opacity-60 cursor-not-allowed'
                }`}
              >
                Review
              </button>
              <button
                onClick={processSubmission}
                className={`flex-1 py-2.5 text-sm cursor-pointer bg-[#EFA508] text-tertiary rounded-md hover:bg-[#D89407] transition-colors ${
                  submitting && 'opacity-60 cursor-not-allowed'
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </>
                ) : (
                  <span>Submit</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}