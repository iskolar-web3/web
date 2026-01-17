import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, Building2 } from 'lucide-react';
import { forwardRef } from 'react';
import type { JSX } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AgencyType, updateGovernmentSponsorRequestSchema, type GovernmentSponsor, type UpdateGovernmentSponsorRequest } from '@/lib/sponsor/model';

/**
 * Props for GovernmentSponsorProfileForm component
 */
interface GovernmentSponsorProfileFormProps {
  /** Initial profile data to populate form */
  profile: GovernmentSponsor;
  /** Whether the form is in edit mode */
  isEditing: boolean;
  /** Whether the form is currently submitting */
  isSaving: boolean;
  /** Callback when form is submitted */
  onSubmit: (data: UpdateGovernmentSponsorRequest) => Promise<void>;
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
    } = useForm<UpdateGovernmentSponsorRequest>({
      resolver: zodResolver(updateGovernmentSponsorRequestSchema),
      mode: 'onBlur',
      defaultValues: {
        id: profile.id,
        userId: profile.userId,
        name: profile.name,
        agencyType: profile.agencyType.code,
        contact: {
            contactType: profile.contact.code,
            value: profile.contact.value,
        },
        avatarUrl: profile.avatarUrl || "",
        sponsorType: profile.sponsorType.code,
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
              <div className="min-h-[40px] px-4 bg-[#F9FAFB] border border-border rounded-sm flex items-center gap-2">
                <p className="text-sm md:text-base text-primary">{profile.name || '—'}</p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
              Agency Type
            </label>
            <div className="min-h-[40px] px-4 bg-[#F9FAFB] border border-border rounded-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
              <p className="text-sm md:text-base text-primary">
                {
                  [
                    { value: AgencyType.NationalGovernmentAgency, label: 'National Government Agency' },
                    { value: AgencyType.LocalGovernmentUnit, label: 'Local Government Unit' },
                    {
                      value: AgencyType.GovernmentOwnedAndControlledCorporation,
                      label: 'Government Owned and Controlled Corporation',
                    },
                  ].find((opt) => opt.value === profile.agencyType.code)?.label || profile.agencyType.name || '—'
                }
              </p>
            </div>
          </div>
          <div>
            <label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
              Contact Number
            </label>
            <div className="min-h-[40px] px-4 bg-[#F9FAFB] border border-border rounded-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
              <p className="text-sm md:text-base text-primary">{profile.contact.value || '—'}</p>
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
                    className={`h-auto ${
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
            name="agencyType"
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
                    className={`h-auto ${
                      errors.agencyType
                        ? 'border-[#EF4444] focus:ring-[#EF4444]/20'
                        : ''
                    }`}
                  >
                    <SelectValue placeholder="Select agency type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AgencyType.NationalGovernmentAgency}>
                      National Government Agency
                    </SelectItem>
                    <SelectItem value={AgencyType.LocalGovernmentUnit}>
                      Local Government Unit
                    </SelectItem>
                    <SelectItem value={AgencyType.GovernmentOwnedAndControlledCorporation}>
                      Government Owned and Controlled Corporation
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.agencyType && (
                  <p className="mt-1 text-xs text-[#EF4444]">
                    {errors.agencyType.message}
                  </p>
                )}
              </div>
            )}
          />

				<Controller
					name="contact.value"
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
									errors.contact?.value
										? "border-[#EF4444] focus-visible:ring-[#EF4444]/20"
										: ""
								}`}
							/>
							{errors.contact?.value && (
								<p className="mt-1 text-xs text-[#EF4444]">
									{errors.contact.value?.message}
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
