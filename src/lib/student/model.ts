import z from "zod";
import { enumDetailSchema } from "../api";
import { Gender } from "@/types/student";
import { contactDetailSchema } from "../user/model";
import { schoolSchema } from "../school/model";

export const studentSchema = z.object({
	id: z.uuidv4(),
	userId: z.uuidv4(),
	firstName: z.string(),
	middleName: z.string().nullable(),
	lastName: z.string(),
	birthDate: z.coerce.date(),
	gender: enumDetailSchema(Gender),
	school: schoolSchema.nullable(),
	contact: contactDetailSchema,
	avatarUrl: z.string().nullable(),
	email: z.email(),
});
export type Student = z.output<typeof studentSchema>;
