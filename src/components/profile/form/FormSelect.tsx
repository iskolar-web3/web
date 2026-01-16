import type { JSX, SelectHTMLAttributes } from 'react';

/**
 * Props for FormSelect component
 */
interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Label text for the select */
  label: string;
  /** Array of available options */
  options: Array<{ value: string; label: string }>;
  /** Error message to display */
  error?: string;
  /** Whether the field is in edit mode */
  isEditing?: boolean;
  /** Optional icon to display */
  icon?: React.ReactNode;
}

/**
 * Reusable form select component
 * Supports both view and edit modes with validation errors
 *
 * @param props - Select element props and custom props
 * @returns Form select component
 */
export default function FormSelect({
  label,
  options,
  error,
  isEditing = false,
  icon,
  value,
  onChange,
  onBlur,
  disabled,
  ...props
}: FormSelectProps): JSX.Element {
  const displayLabel = options.find((opt) => opt.value === value)?.label || value;

  return (
    <div>
      <label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
        {label}
      </label>
      {isEditing && !disabled ? (
        <div className="relative">
          <select
            {...props}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm md:text-base text-primary ${
              error
                ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                : 'border-[#D1D5DB] focus:ring-[#3A52A6]/20 focus:border-[#3A52A6]'
            } disabled:bg-gray-100 disabled:cursor-not-allowed`}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      ) : (
        <div className="px-4 py-3 bg-[#F9FAFB] border border-border rounded-lg flex items-center gap-2">
          {icon}
          <p className="text-sm md:text-base text-primary">{displayLabel || '—'}</p>
        </div>
      )}
    </div>
  );
}