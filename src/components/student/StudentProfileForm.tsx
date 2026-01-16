import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone } from 'lucide-react';
import { forwardRef } from 'react';
import type { JSX } from 'react';
import type { StudentProfile } from '@/types/profile.types';
import FormInput from '@/components/profile/form/FormInput';
import FormSelect from '@/components/profile/form/FormSelect';
import FormDateField from '@/components/profile/form/FormDateField';

/**
 * Validation schema for student profile updates
 */
export const studentProfileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  gender: z.string().min(1, 'Gender is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  contact_number: z
    .string()
    .min(1, 'Contact number is required')
    .regex(/^\d+$/, 'Contact number must contain only numbers')
    .min(11, 'Contact number must be at least 11 digits'),
});

export type StudentProfileFormData = z.infer<typeof studentProfileSchema>;

/**
 * Props for StudentProfileForm component
 */
interface StudentProfileFormProps {
  /** Initial profile data to populate form */
  profile: StudentProfile;
  /** Whether the form is in edit mode */
  isEditing: boolean;
  /** Whether the form is currently submitting */
  isSaving: boolean;
  /** Callback when form is submitted */
  onSubmit: (data: StudentProfileFormData) => Promise<void>;
}

/**
 * Student profile edit form component using react-hook-form
 * Handles validation and submission of student profile updates
 *
 * @param props - Component props
 * @returns Student profile form component
 */
const StudentProfileForm = forwardRef<HTMLFormElement, StudentProfileFormProps>(
  function StudentProfileForm(
    { profile, isEditing, isSaving, onSubmit },
    ref
  ): JSX.Element {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<StudentProfileFormData>({
      resolver: zodResolver(studentProfileSchema),
      mode: 'onBlur',
      defaultValues: {
        full_name: profile.full_name,
        gender: profile.gender,
        date_of_birth: profile.date_of_birth,
        contact_number: profile.contact_number,
      },
    });

    if (!isEditing) {
      // View mode
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <FormInput
            label="Full Name"
            value={profile.full_name}
            disabled
            isEditing={false}
          />
          <FormSelect
            label="Gender"
            value={profile.gender}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
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
                label="Full Name"
                {...field}
                error={errors.full_name?.message}
                isEditing={isEditing}
                disabled={isSaving}
              />
            )}
          />

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Gender"
                {...field}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                ]}
                error={errors.gender?.message}
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

        {/* Form submit button is handled by parent component via EditHeader */}
        {isSaving && (
          <div className="text-center text-sm text-gray-500">
            Saving changes...
          </div>
        )}
      </form>
    );
  }
);

StudentProfileForm.displayName = 'StudentProfileForm';

export default StudentProfileForm;