import { createFileRoute } from "@tanstack/react-router";
import { User, Edit, Award } from "lucide-react";
import { motion } from "framer-motion";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useRef, useState, useEffect } from "react";
import { useToast } from "@/hooks/useToast";
import { useUserProfile } from "@/hooks/queries/useUserProfile";
import Toast from "@/components/Toast";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import ProfileError from "@/components/profile/ProfileError";
import ProfileHeader from "@/components/profile/ProfileHeader";
import EditHeader from "@/components/profile/EditHeader";
import StudentProfileForm, {
	type StudentProfileFormData,
} from "@/components/student/profile/ProfileForm";
import CredentialUploadModal from "@/components/student/profile/credentials/CredentialUploadModal";
import CredentialsList from "@/components/student/profile/credentials/CredentialsList";
import type { StudentProfile } from "@/types/profile.types";
import { useAuth } from "@/auth";
import type { Student } from "@/lib/student/model";
import { UserRole } from "@/lib/user/model";
import { updateStudent } from "@/lib/student/api";
import { useMutation } from "@tanstack/react-query";

export const Route = createFileRoute("/_student/profile/student/$studentId")({
	component: StudentProfilePage,
});

function StudentProfilePage() {
	usePageTitle("Profile");

	const { studentId } = Route.useParams();
	const auth = useAuth<Student>();
	const {
		data: profile,
		isLoading,
		error,
		isError,
	} = useUserProfile(studentId);

	const [localProfile, setLocalProfile] = useState<StudentProfile | null>(
		profile && profile.role === "student" ? (profile as StudentProfile) : null,
	);
	const [isCredentialModalOpen, setIsCredentialModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const formRef = useRef<HTMLFormElement>(null);
	const { toast, showSuccess, showError } = useToast();

	const mutation = useMutation({
		mutationFn: updateStudent,
		onSuccess: async (res) => {
			console.log(res.data);
			showSuccess(`Success`, res.message, 1250);
			setIsEditing(false);
			setIsSaving(false);
		},
		onError: (err) => {
			showError("Error", err.message);
			console.error(err);
			setIsSaving(false);
		},
	});

	// Update local profile when fetched profile changes
	useEffect(() => {
		if (
			profile &&
			profile.role === "student" &&
			localProfile?.user_id !== profile.user_id
		) {
			setLocalProfile(profile as StudentProfile);
		}
	}, [profile, localProfile?.user_id]);

	if (isLoading) {
		return <ProfileSkeleton />;
	}

	if (isError || !localProfile || !profile) {
		return <ProfileError error={error?.message || "Failed to load profile"} />;
	}

	const handleEditClick = () => {
		setIsEditing(true);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
	};

	const handleSaveEdit = async () => {
		if (formRef.current) {
			formRef.current.dispatchEvent(
				new Event("submit", { bubbles: true, cancelable: true })
			);
		}
	};

	const handleFormSubmit = async (data: StudentProfileFormData) => {
		setIsSaving(true);
		try {
			// Map StudentProfileFormData to UpdateStudentRequest format
			const updateData = {
				id: auth.profile.id,
				userId: auth.profile.userId,
				firstName: data.full_name.split(" ")[0],
				middleName: data.full_name.split(" ").slice(1, -1).join(" ") || "",
				lastName: data.full_name.split(" ").pop() || "",
				gender: data.gender as any, // The API expects the enum value
				birthDate: new Date(data.date_of_birth),
				contact: {
					value: data.contact_number,
					contactType: auth.profile.contact.code,
				},
				avatarUrl: auth.profile.avatarUrl || "",
			};

			// Update local profile immediately for UX
			setLocalProfile({
				...localProfile,
				full_name: data.full_name,
				gender: data.gender,
				date_of_birth: data.date_of_birth,
				contact_number: data.contact_number,
			});

			// Persist to server
			mutation.mutate(updateData);
		} catch (err) {
			showError("Error", "Failed to save profile");
			console.error(err);
			setIsSaving(false);
		}
	};

	const handleCredentialSuccess = () => {
		showSuccess("Success", "Your credential has been saved.", 2500);
	};

	return (
		<div className="min-h-screen">
			{toast && <Toast {...toast} />}

			{/* Credential Upload Modal */}
			<CredentialUploadModal
				isOpen={isCredentialModalOpen}
				onClose={() => setIsCredentialModalOpen(false)}
				onSuccess={handleCredentialSuccess}
			/>

			<div className="max-w-2xl mx-auto space-y-4">
				{/* Profile Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.1 }}
					className="bg-card rounded-lg shadow-sm border border-[#E0ECFF] overflow-hidden"
				>
					<div className="px-6 pb-6">
						<div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-6">
							<ProfileAvatar />
							<ProfileHeader
								name={`${auth.profile.firstName} ${auth.profile.lastName}`}
								role={UserRole.Student}
								email={auth.profile.email}
								contactNumber={auth.profile.contact.value}
							/>
						</div>
					</div>
				</motion.div>

				{/* Personal Information */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.2 }}
					className="bg-white rounded-lg shadow-sm border border-[#E0ECFF] p-6"
				>
					<EditHeader
						title="Personal Information"
						isEditing={isEditing}
						isSaving={isSaving}
						onEdit={handleEditClick}
						onCancel={handleCancelEdit}
						onSave={handleSaveEdit}
					/>

					<StudentProfileForm
						ref={formRef}
						profile={localProfile}
						isEditing={isEditing}
						isSaving={isSaving}
						onSubmit={handleFormSubmit}
					/>
				</motion.div>

				{/* Credentials */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.3 }}
					className="bg-white rounded-lg shadow-sm border border-[#E0ECFF] p-6"
				>
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-2">
							<h2 className="text-lg text-primary">Credentials</h2>
						</div>
						<button
							onClick={() => setIsCredentialModalOpen(true)}
							className="px-4 py-2 cursor-pointer bg-[#3B5AA8] hover:bg-[#2f4389] text-white text-xs font-medium rounded-sm transition-colors flex items-center gap-1"
						>
							<Award className="w-3.5 h-3.5" />
							Add Credential
						</button>
					</div>

					<CredentialsList />
				</motion.div>
			</div>
		</div>
	);
}

function ProfileAvatar() {
	return (
		<div className="relative">
			<div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white p-1 shadow-lg">
				<div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
					<User className="w-12 h-12 md:w-14 md:h-14 text-[#6B7280]" />
				</div>
			</div>
			<button
				className="absolute bottom-0 right-0 w-8 h-8 bg-secondary hover:bg-[#2f4389] rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer"
				title="Edit profile picture"
				aria-label="Edit profile picture"
			>
				<Edit className="w-4 h-4 text-tertiary" />
			</button>
		</div>
	);
}