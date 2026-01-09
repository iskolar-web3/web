import { Edit2, Trash2 } from 'lucide-react';
import type { CreateFormFieldRequest } from '@/hooks/useScholarshipForm';
import {
  Type as TypeIcon,
  AlignLeft,
  ListChecks,
  CheckSquare,
  Hash,
  Mail,
  Phone,
  Paperclip,
  CalendarIcon,
} from 'lucide-react';
import { FormFieldType } from '@/lib/scholarship/model';

/**
 * Custom form field structure
 */
// interface CustomFormField {
//   /** Field type */
//   type: CustomFieldType;
//   /** Field label */
//   label: string;
//   /** Whether the field is required */
//   required: boolean;
//   /** Options for dropdown/checkbox/multiple choice fields */
//   options?: string[];
// }

/**
 * Props for the CustomFormFieldsList component
 */
interface CustomFormFieldsListProps {
  /** Array of custom form fields */
  fields: CreateFormFieldRequest[];
  /** Callback when edit button is clicked */
  onEdit: (index: number) => void;
  /** Callback when remove button is clicked */
  onRemove: (index: number) => void;
  /** Whether the list is disabled */
  disabled?: boolean;
}

/**
 * Renders the appropriate icon for a given field type
 * @param fieldType - The custom field type
 * @returns Icon component for the field type
 */
export const renderFieldTypeIcon = (fieldType: FormFieldType) => {
  const iconProps = { size: 18, className: "text-secondary" };

  switch(fieldType) {
      case FormFieldType.ShortAnswer:
        return <TypeIcon {...iconProps} />
      case FormFieldType.Paragraph:
        return <AlignLeft {...iconProps} />
      case FormFieldType.Dropdown:
        return <ListChecks {...iconProps} />
      case FormFieldType.MultipleChoice:
        return <ListChecks {...iconProps} />
      case FormFieldType.Checkbox:
        return <CheckSquare {...iconProps} />
      case FormFieldType.Number:
        return <Hash {...iconProps} />
      case FormFieldType.Date:
        return <CalendarIcon {...iconProps} />
      case FormFieldType.Email:
        return <Mail {...iconProps} />
      case FormFieldType.Phone:
        return <Phone {...iconProps} />
      case FormFieldType.File:
        return <Paperclip {...iconProps} />
  }
};

/**
 * Gets the human-readable label for a field type
 * @param fieldType - The custom field type
 * @returns Display label for the field type
 */
export const getFieldTypeLabel = (fieldType: FormFieldType) => {
  switch(fieldType) {
      case FormFieldType.ShortAnswer:
        return "Short answer"
      case FormFieldType.Paragraph:
        return "Long answer"
      case FormFieldType.MultipleChoice:
        return "Multiple choice"
      case FormFieldType.Dropdown:
        return "Dropdown"
      case FormFieldType.Checkbox:
        return "Checkbox"
      case FormFieldType.Number:
        return "Number"
      case FormFieldType.Date:
        return "Date"
      case FormFieldType.Email:
        return "Email"
      case FormFieldType.Phone:
        return "Phone number"
      case FormFieldType.File:
        return "File upload"
      default:
          return "IDK"
  }
};

/**
 * Custom form fields list component
 * Displays a list of custom form fields with edit and remove actions
 * @param props - Component props
 * @returns List of custom form fields or null if empty
 */
export default function CustomFormFieldsList({
  fields,
  onEdit,
  onRemove,
  disabled = false,
}: CustomFormFieldsListProps) {
  if (fields.length === 0) return null;

  return (
    <div className="space-y-2 mb-3">
      {fields.map((field, index) => (
        <div key={index} className="flex items-center gap-3 p-3 bg-white border border-[#E0ECFF] rounded-lg">
          <div className="w-9 h-9 bg-[#E0ECFF] rounded-lg flex items-center justify-center">
            {renderFieldTypeIcon(field.fieldType)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-primary">{field.label}</span>
              {field.isRequired && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded">Required</span>
              )}
            </div>
            <p className="text-xs text-[#6B7280]">{getFieldTypeLabel(field.fieldType)}</p>
          </div>
          <button
            disabled={disabled}
            onClick={() => onEdit(index)}
            className="p-1.5 hover:bg-gray-100 rounded"
          >
            <Edit2 size={16} className="text-secondary" />
          </button>
          <button
            disabled={disabled}
            onClick={() => onRemove(index)}
            className="p-1.5 hover:bg-gray-100 rounded"
          >
            <Trash2 size={16} className="text-[#EF4444]" />
          </button>
        </div>
      ))}
    </div>
  );
}


