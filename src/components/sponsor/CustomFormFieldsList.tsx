import { Edit2, Trash2 } from 'lucide-react';
import type { CustomFieldType } from '@/hooks/useScholarshipForm';
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

interface CustomFormField {
  type: CustomFieldType;
  label: string;
  required: boolean;
  options?: string[];
}

interface CustomFormFieldsListProps {
  fields: CustomFormField[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
}

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
            {renderFieldTypeIcon(field.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-primary">{field.label}</span>
              {field.required && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded">Required</span>
              )}
            </div>
            <p className="text-xs text-[#6B7280]">{getFieldTypeLabel(field.type)}</p>
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


