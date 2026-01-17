import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Briefcase, CalendarIcon } from "lucide-react";
import { forwardRef } from "react";
import type { JSX } from "react";
import type { IndividualSponsorProfile } from "@/types/profile.types";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate, parseDateString } from "@/utils/profile.utils";

/**
 * Validation schema for individual sponsor profile updates
 */
export const individualSponsorProfileSchema = z.object({
	full_name: z.string().min(1, "Full name is required"),
	employment_type: z.string().min(1, "Employment type is required"),
	date_of_birth: z.string().min(1, "Date of birth is required"),
	contact_number: z
		.string()
		.min(1, "Contact number is required")
		.regex(/^\d+$/, "Contact number must contain only numbers")
		.min(11, "Contact number must be at least 11 digits"),
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
const IndividualSponsorProfileForm = forwardRef<
	HTMLFormElement,
	IndividualSponsorProfileFormProps
>(function IndividualSponsorProfileForm(
	{ profile, isEditing, isSaving, onSubmit },
	ref,
): JSX.Element {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<IndividualSponsorProfileFormData>({
		resolver: zodResolver(individualSponsorProfileSchema),
		mode: "onBlur",
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
				<div>
					<label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
						Name
					</label>
					<div className="min-h-[40px] px-4 bg-[#F9FAFB] border border-border rounded-sm flex items-center gap-2">
						<p className="text-sm md:text-base text-primary">
							{profile.full_name || "—"}
						</p>
					</div>
				</div>
				<div>
					<label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
						Employment Type
					</label>
					<div className="min-h-[40px] px-4 bg-[#F9FAFB] border border-border rounded-sm flex items-center gap-2">
						<Briefcase className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
						<p className="text-sm md:text-base text-primary">
							{[
								{ value: "employed", label: "Employed" },
								{ value: "self_employed", label: "Self Employed" },
								{ value: "freelancer", label: "Freelancer" },
								{
									value: "overseas_filipino_worker",
									label: "Overseas Filipino Worker",
								},
								{ value: "student", label: "Student" },
							].find((opt) => opt.value === profile.employment_type)?.label ||
								profile.employment_type ||
								"—"}
						</p>
					</div>
				</div>
				<div>
					<label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
						Date of Birth
					</label>
					<div className="min-h-[40px] px-4 bg-[#F9FAFB] border border-border rounded-sm flex items-center gap-2">
						<CalendarIcon className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
						<p className="text-sm md:text-base text-primary">
							{profile.date_of_birth ? formatDate(profile.date_of_birth) : "—"}
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
							{profile.contact_number || "—"}
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
				<Controller
					name="full_name"
					control={control}
					render={({ field }) => (
						<div>
							<label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
								Name
							</label>
							<Input
								{...field}
								disabled={isSaving}
								className={`h-auto ${
									errors.full_name
										? "border-[#EF4444] focus-visible:ring-[#EF4444]/20"
										: ""
								}`}
							/>
							{errors.full_name && (
								<p className="mt-1 text-xs text-[#EF4444]">
									{errors.full_name.message}
								</p>
							)}
						</div>
					)}
				/>

				<Controller
					name="employment_type"
					control={control}
					render={({ field }) => (
						<div>
							<label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
								Employment Type
							</label>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
								disabled={isSaving}
							>
								<SelectTrigger
									className={`h-auto ${
										errors.employment_type
											? "border-[#EF4444] focus:ring-[#EF4444]/20"
											: ""
									}`}
								>
									<SelectValue placeholder="Select employment type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="employed">Employed</SelectItem>
									<SelectItem value="self_employed">Self Employed</SelectItem>
									<SelectItem value="freelancer">Freelancer</SelectItem>
									<SelectItem value="overseas_filipino_worker">
										Overseas Filipino Worker
									</SelectItem>
									<SelectItem value="student">Student</SelectItem>
								</SelectContent>
							</Select>
							{errors.employment_type && (
								<p className="mt-1 text-xs text-[#EF4444]">
									{errors.employment_type.message}
								</p>
							)}
						</div>
					)}
				/>

				<Controller
					name="date_of_birth"
					control={control}
					render={({ field }) => {
						const dateValue = field.value
							? parseDateString(field.value)
							: undefined;
						const handleDateSelect = (date: Date | undefined) => {
							if (date) {
								const year = date.getFullYear();
								const month = String(date.getMonth() + 1).padStart(2, "0");
								const day = String(date.getDate()).padStart(2, "0");
								field.onChange(`${year}-${month}-${day}`);
							}
						};

						return (
							<div>
								<label className="block text-xs md:text-sm text-[#6B7280] mb-1.5">
									Date of Birth
								</label>
								<Popover>
									<PopoverTrigger asChild>
										<button
											type="button"
											disabled={isSaving}
											className={`w-full min-h-[40px] px-4 text-sm border rounded-sm focus:outline-none focus:ring-2 transition-all text-left flex items-center justify-between ${
												dateValue ? "text-primary" : "text-gray-400"
											} ${
												errors.date_of_birth
													? "border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]"
													: "border-input focus:border-[#3A52A6] focus:ring-[#3A52A6]/20"
											} disabled:bg-gray-100 disabled:cursor-not-allowed`}
										>
											<span>
												{dateValue
													? dateValue.toLocaleDateString("en-US", {
															month: "long",
															day: "numeric",
															year: "numeric",
														})
													: "Set date"}
											</span>
											<CalendarIcon className="h-4 w-4 opacity-50" />
										</button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={dateValue}
											onSelect={handleDateSelect}
											captionLayout="dropdown"
											disabled={(date) => date > new Date()}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								{errors.date_of_birth && (
									<p className="mt-1 text-xs text-[#EF4444]">
										{errors.date_of_birth.message}
									</p>
								)}
							</div>
						);
					}}
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
								className={`h-auto ${
									errors.contact_number
										? "border-[#EF4444] focus-visible:ring-[#EF4444]/20"
										: ""
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
});

IndividualSponsorProfileForm.displayName = "IndividualSponsorProfileForm";

export default IndividualSponsorProfileForm;

