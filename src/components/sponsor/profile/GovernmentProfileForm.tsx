import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Building2 } from 'lucide-react';
import { forwardRef } from 'react';
import type { JSX } from 'react';
import type { GovernmentSponsorProfile } from '@/types/profile.types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Validation schema for government sponsor profile updates
 */
export const governmentSponsorProfileSchema = z.object({
  name: z.string().min(1, 'Agency name is required'),
  agency_type: z.string().min(1, 'Agency type is required'),
  contact_number: z
    .string()
    .min(1, 'Contact number is required')
    .regex(/^\d+$/, 'Contact number must contain only numbers')
    .min(11, 'Contact number must be at least 11 digits'),
});

export type GovernmentSponsorProfileFormData = z.infer<
  typeof governmentSponsorProfileSchema
>;

/**
 * Props for GovernmentSponsorProfileForm component
 */
interface GovernmentSponsorProfileFormProps {
  /** Initial profile data to populate form */
  profile: GovernmentSponsorProfile;
  /** Whether the form is in edit mode */
  isEditing: boolean;
  /** Whether the form is currently submitting */
  isSaving: boolean;
  /** Callback when form is submitted */
  onSubmit: (data: GovernmentSponsorProfileFormData) => Promise<void>;
}

/**
 * Government sponsor profile edit form component using react-hook-form
 * Handles validation and submission of government sponsor profile updates
 *
 * @param props - Component props
 * @returns Government sponsor profile form component
 */
const GovernmentSponsorProfileForm = forwardRef<HTMLFormElement, GovernmentSponsorProfileFormProps>(
  function GovernmentSponsorProfileForm(
    { profile, isEditing, isSaving, onSubmit },
    ref
  ): JSX.Element {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<GovernmentSponsorProfileFormData>({
      resolver: zodResolver(governmentSponsorProfileSchema),
      mode: 'onBlur',
      defaultValues: {
        name: profile.name,
        agency_type: profile.agency_type,
        contact_number: profile.contact_number,
      },
    });

    if (!isEditing) {
      // View mode
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="md:col-span-2">
            <div>
              <label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
                Agency Name
              </label>
              <div className="px-4 py-3 bg-[#F9FAFB] border border-border rounded-lg flex items-center gap-2">
                <p className="text-sm md:text-base text-primary">{profile.name || '—'}</p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
              Agency Type
            </label>
            <div className="px-4 py-3 bg-[#F9FAFB] border border-border rounded-lg flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#6B7280]" />
              <p className="text-sm md:text-base text-primary">
                {
                  [
                    { value: 'national_government_agency', label: 'National Government Agency' },
                    { value: 'local_government_unit', label: 'Local Government Unit' },
                    {
                      value: 'government_owned_and_controlled_corporation',
                      label: 'Government Owned and Controlled Corporation',
                    },
                  ].find((opt) => opt.value === profile.agency_type)?.label || profile.agency_type || '—'
                }
              </p>
            </div>
          </div>
          <div>
            <label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
              Contact Number
            </label>
            <div className="px-4 py-3 bg-[#F9FAFB] border border-border rounded-lg flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#6B7280]" />
              <p className="text-sm md:text-base text-primary">{profile.contact_number || '—'}</p>
            </div>
          </div>
        </div>
      );
    }

    // Edit mode with form
    return (
      <form ref={ref} onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="md:col-span-2">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
                    Agency Name
                  </label>
                  <Input
                    {...field}
                    disabled={isSaving}
                    className={`h-auto py-3 ${
                      errors.name
                        ? 'border-[#EF4444] focus-visible:ring-[#EF4444]/20'
                        : ''
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-[#EF4444]">{errors.name.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <Controller
            name="agency_type"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
                  Agency Type
                </label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSaving}
                >
                  <SelectTrigger
                    className={`h-auto py-3 ${
                      errors.agency_type
                        ? 'border-[#EF4444] focus:ring-[#EF4444]/20'
                        : ''
                    }`}
                  >
                    <SelectValue placeholder="Select agency type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="national_government_agency">
                      National Government Agency
                    </SelectItem>
                    <SelectItem value="local_government_unit">
                      Local Government Unit
                    </SelectItem>
                    <SelectItem value="government_owned_and_controlled_corporation">
                      Government Owned and Controlled Corporation
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.agency_type && (
                  <p className="mt-1 text-xs text-[#EF4444]">
                    {errors.agency_type.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="contact_number"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
                  Contact Number
                </label>
                <Input
                  {...field}
                  type="tel"
                  disabled={isSaving}
                  className={`h-auto py-3 ${
                    errors.contact_number
                      ? 'border-[#EF4444] focus-visible:ring-[#EF4444]/20'
                      : ''
                  }`}
                />
                {errors.contact_number && (
                  <p className="mt-1 text-xs text-[#EF4444]">
                    {errors.contact_number.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Form submit button is handled by parent component */}
        {isSaving && (
          <div className="text-center text-sm text-gray-500">
            Saving changes...
          </div>
        )}
      </form>
    );
  }
);

GovernmentSponsorProfileForm.displayName = 'GovernmentSponsorProfileForm';

export default GovernmentSponsorProfileForm;
