import type { JSX, InputHTMLAttributes } from 'react';

/**
 * Props for FormInput component
 */
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text for the input */
  label: string;
  /** Error message to display */
  error?: string;
  /** Whether the field is in edit mode */
  isEditing?: boolean;
  /** Optional icon to display */
  icon?: React.ReactNode;
}

/**
 * Reusable form input component
 * Supports both view and edit modes with validation errors
 *
 * @param props - Input element props and custom props
 * @returns Form input component
 */
export default function FormInput({
  label,
  error,
  isEditing = false,
  icon,
  value,
  onChange,
  onBlur,
  disabled,
  ...props
}: FormInputProps): JSX.Element {
  return (
    <div>
      <label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
        {label}
      </label>
      {isEditing && !disabled ? (
        <div className="relative">
          <input
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
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      ) : (
        <div className="px-4 py-3 bg-[#F9FAFB] border border-border rounded-lg flex items-center gap-2">
          {icon}
          <p className="text-sm md:text-base text-primary">{value || '—'}</p>
        </div>
      )}
    </div>
  );
}