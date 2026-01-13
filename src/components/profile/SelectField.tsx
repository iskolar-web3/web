import type { JSX } from 'react';

/**
 * Props for the SelectField component
 */
interface SelectFieldProps {
  /** Label text for the select field */
  label: string;
  /** Current selected value */
  value: string;
  /** Array of available options */
  options: Array<{ value: string; label: string }>;
  /** Optional icon to display in view mode */
  icon?: React.ReactNode;
  /** Whether the field is in edit mode */
  isEditing?: boolean;
  /** Callback function when selection changes */
  onChange?: (value: string) => void;
}

/**
 * Reusable select field component
 * Supports both view and edit modes with dropdown options
 * @param props - Component props
 * @returns Select field component with dropdown or display mode
 */
export default function SelectField({ 
  label, 
  value, 
  options, 
  icon, 
  isEditing = false, 
  onChange 
}: SelectFieldProps): JSX.Element {
  const displayLabel = options.find(opt => opt.value === value)?.label || value;
  
  return (
    <div>
      <label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
        {label}
      </label>
      {isEditing ? (
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent text-sm md:text-base text-primary"
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="px-4 py-3 bg-[#F9FAFB] border border-border rounded-lg flex items-center gap-2">
          {icon}
          <p className="text-sm md:text-base text-primary">{displayLabel}</p>
        </div>
      )}
    </div>
  );
}
