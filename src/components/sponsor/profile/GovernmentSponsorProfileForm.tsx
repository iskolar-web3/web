import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Building2 } from 'lucide-react';
import { forwardRef } from 'react';
import type { JSX } from 'react';
import type { GovernmentSponsorProfile } from '@/types/profile.types';
import FormInput from '@/components/profile/form/FormInput';
import FormSelect from '@/components/profile/form/FormSelect';

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
            <FormInput
              label="Agency Name"
              value={profile.name}
              disabled
              isEditing={false}
            />
          </div>
          <FormSelect
            label="Agency Type"
            value={profile.agency_type}
            options={[
              { value: 'national_government_agency', label: 'National Government Agency' },
              { value: 'local_government_unit', label: 'Local Government Unit' },
              {
                value: 'government_owned_and_controlled_corporation',
                label: 'Government Owned and Controlled Corporation',
              },
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
                  label="Agency Name"
                  {...field}
                  error={errors.name?.message}
                  isEditing={isEditing}
                  disabled={isSaving}
                />
              )}
            />
          </div>

          <Controller
            name="agency_type"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Agency Type"
                {...field}
                icon={<Building2 className="w-4 h-4 text-[#6B7280]" />}
                options={[
                  { value: 'national_government_agency', label: 'National Government Agency' },
                  { value: 'local_government_unit', label: 'Local Government Unit' },
                  {
                    value: 'government_owned_and_controlled_corporation',
                    label: 'Government Owned and Controlled Corporation',
                  },
                ]}
                error={errors.agency_type?.message}
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

GovernmentSponsorProfileForm.displayName = 'GovernmentSponsorProfileForm';

export default GovernmentSponsorProfileForm;
