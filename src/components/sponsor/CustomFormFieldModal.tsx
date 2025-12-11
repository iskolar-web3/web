import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { normalizeText, normalizeArray } from '@/utils/normalize';
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

/**
 * Available custom form field types
 */
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

/**
 * Props for the CustomFormFieldModal component
 */
interface CustomFormFieldModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback function to close the modal */
  onClose: () => void;
  /** Callback function when field is saved */
  onSave: (field: {
    type: CustomFieldType;
    label: string;
    required: boolean;
    options?: string[];
  }) => void;
  /** Existing field data when editing */
  editingField?: {
    type: CustomFieldType;
    label: string;
    required: boolean;
    options?: string[];
  } | null;
}

/**
 * Renders the appropriate icon for a given field type
 * @param fieldType - The custom field type
 * @returns Icon component for the field type
 */
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

/**
 * Gets the human-readable label for a field type
 * @param fieldType - The custom field type
 * @returns Display label for the field type
 */
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

/**
 * Custom form field modal component for sponsors
 * Allows creating and editing custom form fields for scholarship applications
 * @param props - Component props
 * @returns Modal dialog for managing custom form fields
 */
export default function CustomFormFieldModal({
  isOpen,
  onClose,
  onSave,
  editingField,
}: CustomFormFieldModalProps) {
  const [newFieldType, setNewFieldType] = useState<CustomFieldType>(editingField?.type || 'text');
  const [newFieldLabel, setNewFieldLabel] = useState(editingField?.label || '');
  const [newFieldRequired, setNewFieldRequired] = useState(editingField?.required || false);
  const [dropdownOptions, setDropdownOptions] = useState<string[]>(editingField?.options || []);
  const [dropdownOptionInput, setDropdownOptionInput] = useState('');

  useEffect(() => {
    if (editingField) {
      setNewFieldType(editingField.type);
      setNewFieldLabel(editingField.label);
      setNewFieldRequired(editingField.required);
      setDropdownOptions(editingField.options || []);
    } else {
      setNewFieldType('text');
      setNewFieldLabel('');
      setNewFieldRequired(false);
      setDropdownOptions([]);
    }
    setDropdownOptionInput('');
  }, [editingField, isOpen]);

  if (!isOpen) return null;

  /**
   * Handles saving the form field
   * Validates and normalizes input before calling onSave callback
   */
  const handleSave = () => {
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

    onSave(newField);
    onClose();
  };

  /**
   * Handles adding a new option to dropdown/checkbox/multiple choice fields
   */
  const handleAddOption = () => {
    const trimmed = dropdownOptionInput.trim();
    if (trimmed && !dropdownOptions.includes(trimmed)) {
      setDropdownOptions([...dropdownOptions, trimmed]);
      setDropdownOptionInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#F0F7FF] rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg text-secondary">
            {editingField ? 'Edit Field' : 'Add Form Field'}
          </h3>
          <button onClick={onClose} className="text-[#4A5568] hover:text-secondary">
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
                  onClick={handleAddOption}
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
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#C4CBD5] cursor-pointer text-sm rounded-md text-[#4A5568] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 bg-[#3A52A6] cursor-pointer text-sm text-tertiary rounded-md hover:bg-[#2A4296] transition-colors"
          >
            {editingField ? 'Update' : 'Add'} Field
          </button>
        </div>
      </div>
    </div>
  );
}

