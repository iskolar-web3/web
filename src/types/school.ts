import { enumDetailSchema } from "@/lib/api";
import { contactDetailSchema } from "@/lib/user/model";
import z from "zod";

export enum SchoolType {
	Public = "public",
	Private = "private",
	International = "international",
	Vocational = "vocational",
	Religious = "religious",
}

export const schoolSchema = z.object({
	id: z.uuidv4(),
	userId: z.uuidv4(),
	email: z.email(),
	name: z.string().nonempty(),
	schoolType: enumDetailSchema(SchoolType),
	contact: contactDetailSchema,
});
export type School = z.output<typeof schoolSchema>;
