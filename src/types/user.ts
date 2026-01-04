import { enumDetailSchema } from "@/lib/api";
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

export type LoginResponse = {
	user: User;
	token: string;
};
