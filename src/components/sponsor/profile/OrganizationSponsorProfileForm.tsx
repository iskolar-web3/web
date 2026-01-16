import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Building2 } from 'lucide-react';
import { forwardRef } from 'react';
import type { JSX } from 'react';
import type { OrganizationSponsorProfile } from '@/types/profile.types';
import FormInput from '@/components/profile/form/FormInput';
import FormSelect from '@/components/profile/form/FormSelect';

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
            <FormInput
              label="Organization Name"
              value={profile.name}
              disabled
              isEditing={false}
            />
          </div>
          <FormSelect
            label="Organization Type"
            value={profile.organization_type}
            options={[
              { value: 'private_company', label: 'Private Company' },
              {
                value: 'non_governmental_organization',
                label: 'Non-Governmental Organization',
              },
              { value: 'educational_institution', label: 'Educational Institution' },
            ]}
            icon={<Building2 className="w-4 h-4 text-[#6B7280]" />}
            disabled
            isEditing={false}
          />
          <FormInput
            label="Contact Number"
            value={profile.contact_number}
            icon={<Phone className="w-4 h-4 text-[#6B7280]" />}
            disabled
            isEditing={false}
          />
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
                <FormInput
                  label="Organization Name"
                  {...field}
                  error={errors.name?.message}
                  isEditing={isEditing}
                  disabled={isSaving}
                />
              )}
            />
          </div>

          <Controller
            name="organization_type"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Organization Type"
                {...field}
                icon={<Building2 className="w-4 h-4 text-[#6B7280]" />}
                options={[
                  { value: 'private_company', label: 'Private Company' },
                  {
                    value: 'non_governmental_organization',
                    label: 'Non-Governmental Organization',
                  },
                  {
                    value: 'educational_institution',
                    label: 'Educational Institution',
                  },
                ]}
                error={errors.organization_type?.message}
                isEditing={isEditing}
                disabled={isSaving}
              />
            )}
          />

          <Controller
            name="contact_number"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Contact Number"
                type="tel"
                icon={<Phone className="w-4 h-4 text-[#6B7280]" />}
                {...field}
                error={errors.contact_number?.message}
                isEditing={isEditing}
                disabled={isSaving}
              />
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