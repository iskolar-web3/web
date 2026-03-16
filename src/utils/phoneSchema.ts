import z from "zod"

/**
 * Zod schema for validating Philippine phone numbers.
 * Accepts mobile numbers only: exactly 11 digits starting with '09'.
 * Example: 09123456789
 */
export const philippinePhoneSchema = z
  .string()
  .nonempty({ error: "Contact number is required" })
  .regex(/^\d+$/, "Contact number must contain only numbers")
  .min(11, "Contact number must be exactly 11 digits")
  .max(11, "Contact number must be exactly 11 digits")
  .refine((val) => val.startsWith("09"), {
    message: "Mobile number must start with '09' (e.g., 09123456789)",
  })