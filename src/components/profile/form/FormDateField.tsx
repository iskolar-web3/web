import { Calendar, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { formatDate, parseDateString } from '@/utils/profile.utils';
import type { JSX } from 'react';

/**
 * Props for FormDateField component
 */
interface FormDateFieldProps {
  /** Label text for the date field */
  label: string;
  /** Current date value in string format */
  value?: string;
  /** Error message to display */
  error?: string;
  /** Whether the field is in edit mode */
  isEditing?: boolean;
  /** Callback function when date selection changes */
  onChange?: (date: string) => void;
  /** Whether the field is disabled */
  disabled?: boolean;
}

/**
 * Reusable form date field component
 * Supports both view and edit modes with calendar picker
 *
 * @param props - Component props
 * @returns Form date field component
 */
export default function FormDateField({
  label,
  value,
  error,
  isEditing = false,
  onChange,
  disabled,
}: FormDateFieldProps): JSX.Element {
  const dateValue = value ? parseDateString(value) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (date && onChange) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      onChange(`${year}-${month}-${day}`);
    }
  };

  return (
    <div>
      <label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
        {label}
      </label>
      {isEditing && !disabled ? (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              className={`w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all text-left flex items-center justify-between ${
                dateValue ? 'text-primary' : 'text-gray-400'
              } ${
                error
                  ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                  : 'border-[#D1D5DB] focus:border-[#3A52A6] focus:ring-[#3A52A6]/20'
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
            >
              <span>
                {dateValue
                  ? dateValue.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Set date'}
              </span>
              <CalendarIcon className="h-4 w-4 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={dateValue}
              onSelect={handleDateSelect}
              captionLayout="dropdown"
              disabled={(date) => date > new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      ) : (
        <div className="px-4 py-3 bg-[#F9FAFB] border border-border rounded-lg flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#6B7280]" />
          <p className="text-sm md:text-base text-primary">
            {value ? formatDate(value) : '—'}
          </p>
        </div>
      )}
      {error && isEditing && !disabled && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}