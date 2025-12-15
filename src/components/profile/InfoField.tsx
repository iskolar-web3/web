import type { JSX } from 'react';

/**
 * Props for the InfoField component
 */
interface InfoFieldProps {
  /** Label text for the field */
  label: string;
  /** Current field value */
  value: string;
  /** Optional icon to display in view mode */
  icon?: React.ReactNode;
  /** Whether the field is in edit mode */
  isEditing?: boolean;
  /** Callback function when value changes */
  onChange?: (value: string) => void;
  /** Input type for the field */
  type?: 'text' | 'tel' | 'email';
}

/**
 * Reusable info field component
 * Supports both view and edit modes with icon support
 * @param props - Component props
 * @returns Info field component with icon or input
 */
export default function InfoField({ 
  label, 
  value, 
  icon, 
  isEditing = false, 
  onChange, 
  type = 'text' 
}: InfoFieldProps): JSX.Element {
  return (
    <div>
      <label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
        {label}
      </label>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent text-sm md:text-base text-primary"
        />
      ) : (
        <div className="px-4 py-3 bg-[#F9FAFB] border border-border rounded-lg flex items-center gap-2">
          {icon}
          <p className="text-sm md:text-base text-primary">{value}</p>
        </div>
      )}
    </div>
  );
}