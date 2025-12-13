import { Calendar, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { formatDate, parseDateString } from '@/utils/profile.utils';
import type { JSX } from 'react';

/**
 * Props for the DateField component
 */
interface DateFieldProps {
  /** Label text for the date field */
  label: string;
  /** Current date value in string format */
  value: string;
  /** Whether the field is in edit mode */
  isEditing?: boolean;
  /** Callback function when date selection changes */
  onChange?: (date: Date | undefined) => void;
}

/**
 * Reusable date field component with calendar picker
 * Supports both view and edit modes with date validation
 * @param props - Component props
 * @returns Date field component with calendar picker in edit mode or formatted display
 */
export default function DateField({ 
  label, 
  value, 
  isEditing = false, 
  onChange 
}: DateFieldProps): JSX.Element {
  const dateValue = value ? parseDateString(value) : undefined;
  
  return (
    <div>
      <label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
        {label}
      </label>
      {isEditing ? (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all text-left flex items-center justify-between ${
                dateValue ? 'text-primary' : 'text-gray-400'
              } border-[#D1D5DB] focus:border-[#3A52A6] focus:ring-[#3A52A6]/20`}
            >
              <span>
                {dateValue 
                  ? dateValue.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                  : 'Set birth date'}
              </span>
              <CalendarIcon className="h-4 w-4 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={dateValue}
              onSelect={onChange}
              captionLayout="dropdown"
              disabled={(date) => date > new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      ) : (
        <div className="px-4 py-3 bg-[#F9FAFB] border border-border rounded-lg flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#6B7280]" />
          <p className="text-sm md:text-base text-primary">{formatDate(value)}</p>
        </div>
      )}
    </div>
  );
}