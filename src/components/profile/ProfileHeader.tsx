import { Mail, Phone, Users } from "lucide-react";
import { getRoleLabel } from "@/utils/profile.utils";
import type { JSX } from "react";
import type { UserRole } from "@/lib/user/model";
import { useAuth } from "@/auth";

/**
 * Props for the ProfileHeader component
 */
interface ProfileHeaderProps {
	/** User's full name */
	name: string;
	/** User's role type */
	role: UserRole;
	/** User's email address */
	email: string;
	/** User's contact number */
	contactNumber: string;
}

/**
 * ProfileHeader component
 * Displays user profile information including name, role, email, and contact
 * @param props - Component props
 * @returns Profile header component with user information
 */
export default function ProfileHeader({
	name,
	email,
	contactNumber,
}: ProfileHeaderProps): JSX.Element {
	const auth = useAuth();

	return (
		<div className="flex-1 text-center md:text-left mt-4 md:mt-6">
			<div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
				<h2 className="text-xl md:text-2xl text-primary">{name}</h2>
				<span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E0ECFF] text-[#3A52A6] text-xs md:text-sm rounded-md mx-auto md:mx-0 w-fit">
					<Users className="w-3.5 h-3.5" />
					{auth.user ? getRoleLabel(auth.user, auth.profile) : "No role"}
				</span>
			</div>

			<div className="flex flex-col md:items-start items-center justify-center md:justify-start gap-2 text-[#6B7280] text-sm">
				<div className="flex items-center gap-2">
					<Mail className="w-4 h-4" />
					<span>{email}</span>
				</div>
				<div className="flex items-center gap-2">
					<Phone className="w-4 h-4" />
					<span>{contactNumber}</span>
				</div>
			</div>
		</div>
	);
}
