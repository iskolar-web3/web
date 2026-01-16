import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Building2 } from 'lucide-react';
import { forwardRef } from 'react';
import type { JSX } from 'react';
import type { OrganizationSponsorProfile } from '@/types/profile.types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Validation schema for organization sponsor profile updates
 */
export const organizationSponsorProfileSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  organization_type: z.string().min(1, 'Organization type is required'),
  contact_number: z
    .string()
    .min(1, 'Contact number is required')
    .regex(/^\d+$/, 'Contact number must contain only numbers')
    .min(11, 'Contact number must be at least 11 digits'),
});

export type OrganizationSponsorProfileFormData = z.infer<
  typeof organizationSponsorProfileSchema
>;

/**
 * Props for OrganizationSponsorProfileForm component
 */
interface OrganizationSponsorProfileFormProps {
  /** Initial profile data to populate form */
  profile: OrganizationSponsorProfile;
  /** Whether the form is in edit mode */
  isEditing: boolean;
  /** Whether the form is currently submitting */
  isSaving: boolean;
  /** Callback when form is submitted */
  onSubmit: (data: OrganizationSponsorProfileFormData) => Promise<void>;
}

/**
 * Organization sponsor profile edit form component using react-hook-form
 * Handles validation and submission of organization sponsor profile updates
 *
 * @param props - Component props
 * @returns Organization sponsor profile form component
 */
const OrganizationSponsorProfileForm = forwardRef<HTMLFormElement, OrganizationSponsorProfileFormProps>(
  function OrganizationSponsorProfileForm(
    { profile, isEditing, isSaving, onSubmit },
    ref
  ): JSX.Element {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<OrganizationSponsorProfileFormData>({
      resolver: zodResolver(organizationSponsorProfileSchema),
      mode: 'onBlur',
      defaultValues: {
        name: profile.name,
        organization_type: profile.organization_type,
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
                Organization Name
              </label>
              <div className="px-4 py-3 bg-[#F9FAFB] border border-border rounded-lg flex items-center gap-2">
                <p className="text-sm md:text-base text-primary">{profile.name || '—'}</p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
              Organization Type
            </label>
            <div className="px-4 py-3 bg-[#F9FAFB] border border-border rounded-lg flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#6B7280]" />
              <p className="text-sm md:text-base text-primary">
                {
                  [
                    { value: 'private_company', label: 'Private Company' },
                    {
                      value: 'non_governmental_organization',
                      label: 'Non-Governmental Organization',
                    },
                    { value: 'educational_institution', label: 'Educational Institution' },
                  ].find((opt) => opt.value === profile.organization_type)?.label || profile.organization_type || '—'
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
                    Organization Name
                  </label>
                  <Input
                    {...field}
                    disabled={isSaving}
                    className={`h-auto py-3 ${
                      errors.name
                        ? 'border-red-500 focus-visible:ring-red-500/20'
                        : ''
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <Controller
            name="organization_type"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
                  Organization Type
                </label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSaving}
                >
                  <SelectTrigger
                    className={`h-auto py-3 ${
                      errors.organization_type
                        ? 'border-red-500 focus:ring-red-500/20'
                        : ''
                    }`}
                  >
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private_company">Private Company</SelectItem>
                    <SelectItem value="non_governmental_organization">
                      Non-Governmental Organization
                    </SelectItem>
                    <SelectItem value="educational_institution">
                      Educational Institution
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.organization_type && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.organization_type.message}
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
                      ? 'border-red-500 focus-visible:ring-red-500/20'
                      : ''
                  }`}
                />
                {errors.contact_number && (
                  <p className="mt-1 text-xs text-red-500">
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

OrganizationSponsorProfileForm.displayName = 'OrganizationSponsorProfileForm';

export default OrganizationSponsorProfileForm;