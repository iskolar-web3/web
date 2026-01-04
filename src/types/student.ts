import { enumDetailSchema } from "@/lib/api";
import { schoolSchema } from "./school";
import z from "zod";
import { contactDetailSchema } from "./user";

export enum Gender {
	Male = "male",
	Female = "female",
}

export const studentSchema = z
	.object({
		id: z.uuidv4(),
		userId: z.uuidv4(),
		firstName: z.string(),
		middleName: z.string().nullable(),
		lastName: z.string(),
		birthDate: z.coerce.date(),
		gender: enumDetailSchema(Gender),
		school: schoolSchema.nullable(),
		contact: contactDetailSchema,
	})
export type Student = z.output<typeof studentSchema>;
