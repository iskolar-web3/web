import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, Building2 } from "lucide-react";
import { forwardRef } from "react";
import type { JSX } from "react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	OrganizationType,
	updateOrganizationSponsorRequestSchema,
	type OrganizationSponsor,
	type UpdateOrganizationSponsorRequest,
} from "@/lib/sponsor/model";

/**
 * Props for OrganizationSponsorProfileForm component
 */
interface OrganizationSponsorProfileFormProps {
	/** Initial profile data to populate form */
	profile: OrganizationSponsor;
	/** Whether the form is in edit mode */
	isEditing: boolean;
	/** Whether the form is currently submitting */
	isSaving: boolean;
	/** Callback when form is submitted */
	onSubmit: (data: UpdateOrganizationSponsorRequest) => Promise<void>;
}

/**
 * Organization sponsor profile edit form component using react-hook-form
 * Handles validation and submission of organization sponsor profile updates
 *
 * @param props - Component props
 * @returns Organization sponsor profile form component
 */
const OrganizationSponsorProfileForm = forwardRef<
	HTMLFormElement,
	OrganizationSponsorProfileFormProps
>(function OrganizationSponsorProfileForm(
	{ profile, isEditing, isSaving, onSubmit },
	ref,
): JSX.Element {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<UpdateOrganizationSponsorRequest>({
		resolver: zodResolver(updateOrganizationSponsorRequestSchema),
		mode: "onBlur",
		defaultValues: {
			id: profile.id,
			userId: profile.userId,
			name: profile.name,
			avatarUrl: profile.avatarUrl || "",
			contact: {
				value: profile.contact.value,
				contactType: profile.contact.code,
			},
			sponsorType: profile.sponsorType.code,
			organizationType: profile.organizationType.code,
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
						<div className="min-h-[40px] px-4 bg-[#F9FAFB] border border-border rounded-sm flex items-center gap-2">
							<p className="text-sm md:text-base text-primary">
								{profile.name || "—"}
							</p>
						</div>
					</div>
				</div>
				<div>
					<label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
						Organization Type
					</label>
					<div className="min-h-[40px] px-4 bg-[#F9FAFB] border border-border rounded-sm flex items-center gap-2">
						<Building2 className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
						<p className="text-sm md:text-base text-primary">
							{[
								{
									value: OrganizationType.PrivateCompany,
									label: "Private Company",
								},
								{
									value: OrganizationType.NonGovernmentalOrganization,
									label: "Non-Governmental Organization",
								},
								{
									value: OrganizationType.EducationalInstitution,
									label: "Educational Institution",
								},
							].find((opt) => opt.value === profile.organizationType.code)
								?.label ||
								profile.organizationType.name ||
								"—"}
						</p>
					</div>
				</div>
				<div>
					<label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
						Contact Number
					</label>
					<div className="min-h-[40px] px-4 bg-[#F9FAFB] border border-border rounded-sm flex items-center gap-2">
						<Phone className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
						<p className="text-sm md:text-base text-primary">
							{profile.contact.value || "—"}
						</p>
					</div>
				</div>
			</div>
		);
	}

	// Edit mode with form
	return (
		<form
			ref={ref}
			onSubmit={handleSubmit(onSubmit)}
			className="space-y-4 md:space-y-6"
		>
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
									className={`h-auto ${
										errors.name
											? "border-[#EF4444] focus-visible:ring-[#EF4444]/20"
											: ""
									}`}
								/>
								{errors.name && (
									<p className="mt-1 text-xs text-[#EF4444]">
										{errors.name.message}
									</p>
								)}
							</div>
						)}
					/>
				</div>

				<Controller
					name="organizationType"
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
									className={`h-auto ${
										errors.organizationType
											? "border-[#EF4444] focus:ring-[#EF4444]/20"
											: ""
									}`}
								>
									<SelectValue placeholder="Select organization type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={OrganizationType.PrivateCompany}>
										Private Company
									</SelectItem>
									<SelectItem value={OrganizationType.NonGovernmentalOrganization}>
										Non-Governmental Organization
									</SelectItem>
									<SelectItem value={OrganizationType.EducationalInstitution}>
										Educational Institution
									</SelectItem>
								</SelectContent>
							</Select>
							{errors.organizationType && (
								<p className="mt-1 text-xs text-[#EF4444]">
									{errors.organizationType.message}
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
});

OrganizationSponsorProfileForm.displayName = "OrganizationSponsorProfileForm";

export default OrganizationSponsorProfileForm;
