import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Briefcase } from 'lucide-react';
import { forwardRef } from 'react';
import type { JSX } from 'react';
import type { IndividualSponsorProfile } from '@/types/profile.types';
import FormInput from '@/components/profile/form/FormInput';
import FormSelect from '@/components/profile/form/FormSelect';
import FormDateField from '@/components/profile/form/FormDateField';

/**
 * Validation schema for individual sponsor profile updates
 */
export const individualSponsorProfileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  employment_type: z.string().min(1, 'Employment type is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  contact_number: z
    .string()
    .min(1, 'Contact number is required')
    .regex(/^\d+$/, 'Contact number must contain only numbers')
    .min(11, 'Contact number must be at least 11 digits'),
});

export type IndividualSponsorProfileFormData = z.infer<
  typeof individualSponsorProfileSchema
>;

/**
 * Props for IndividualSponsorProfileForm component
 */
interface IndividualSponsorProfileFormProps {
  /** Initial profile data to populate form */
  profile: IndividualSponsorProfile;
  /** Whether the form is in edit mode */
  isEditing: boolean;
  /** Whether the form is currently submitting */
  isSaving: boolean;
  /** Callback when form is submitted */
  onSubmit: (data: IndividualSponsorProfileFormData) => Promise<void>;
}

/**
 * Individual sponsor profile edit form component using react-hook-form
 * Handles validation and submission of individual sponsor profile updates
 *
 * @param props - Component props
 * @returns Individual sponsor profile form component
 */
const IndividualSponsorProfileForm = forwardRef<HTMLFormElement, IndividualSponsorProfileFormProps>(
  function IndividualSponsorProfileForm(
    { profile, isEditing, isSaving, onSubmit },
    ref
  ): JSX.Element {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<IndividualSponsorProfileFormData>({
      resolver: zodResolver(individualSponsorProfileSchema),
      mode: 'onBlur',
      defaultValues: {
        full_name: profile.full_name,
        employment_type: profile.employment_type,
        date_of_birth: profile.date_of_birth,
        contact_number: profile.contact_number,
      },
    });

    if (!isEditing) {
      // View mode
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <FormInput
            label="Name"
            value={profile.full_name}
            disabled
            isEditing={false}
          />
          <FormSelect
            label="Employment Type"
            value={profile.employment_type}
            options={[
              { value: 'employed', label: 'Employed' },
              { value: 'self_employed', label: 'Self Employed' },
              { value: 'freelancer', label: 'Freelancer' },
              { value: 'overseas_filipino_worker', label: 'Overseas Filipino Worker' },
              { value: 'student', label: 'Student' },
            ]}
            disabled
            isEditing={false}
          />
          <FormDateField
            label="Date of Birth"
            value={profile.date_of_birth}
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
          <Controller
            name="full_name"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Name"
                {...field}
                error={errors.full_name?.message}
                isEditing={isEditing}
                disabled={isSaving}
              />
            )}
          />

          <Controller
            name="employment_type"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Employment Type"
                {...field}
                icon={<Briefcase className="w-4 h-4 text-[#6B7280]" />}
                options={[
                  { value: 'employed', label: 'Employed' },
                  { value: 'self_employed', label: 'Self Employed' },
                  { value: 'freelancer', label: 'Freelancer' },
                  { value: 'overseas_filipino_worker', label: 'Overseas Filipino Worker' },
                  { value: 'student', label: 'Student' },
                ]}
                error={errors.employment_type?.message}
                isEditing={isEditing}
                disabled={isSaving}
              />
            )}
          />

          <Controller
            name="date_of_birth"
            control={control}
            render={({ field }) => (
              <FormDateField
                label="Date of Birth"
                {...field}
                error={errors.date_of_birth?.message}
                isEditing={isEditing}
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

IndividualSponsorProfileForm.displayName = 'IndividualSponsorProfileForm';

export default IndividualSponsorProfileForm;