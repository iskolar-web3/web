import { enumDetailSchema } from "@/lib/api";
import type { Student } from "@/types/student";
import z from "zod";

export enum UserRole {
	Student = "student",
	Sponsor = "sponsor",
	Admin = "admin",
}

export enum UserStatus {
	Active = "active",
	Inactive = "inactive",
	Suspended = "suspended",
}

export const userSchema = z.object({
	id: z.uuidv4(),
	lastLoginAt: z.coerce.date(),
	email: z.email(),
	avatarUrl: z.string().nullable(),
	role: enumDetailSchema(UserRole).nullable(),
	status: enumDetailSchema(UserStatus),
});

export type User = z.output<typeof userSchema>;

export type AuthSession = {
	user: User;
	token: string;
	refreshToken: string;
};

export enum ContactType {
	Phone = "phone",
	// Insert other values
}

export const contactDetailSchema = z.object({
	id: z.uuidv4(),
	name: z.string().nonempty(),
	code: z.enum(ContactType),
	value: z.string().nonempty(),
});
export type ContactDetail = z.infer<typeof contactDetailSchema>;

export type UserProfile = Student;
