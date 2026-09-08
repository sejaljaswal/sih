import { z } from "zod";

// Indian mobile numbers: 10 digits, first digit 6-9.
const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, "auth.errors.phone_invalid");

const passwordSchema = z
  .string()
  .min(8, "auth.errors.password_too_short");

export const registerSchema = z
  .object({
    phone: phoneSchema,
    fullName: z.string().trim().min(2, "auth.errors.full_name_too_short"),
    password: passwordSchema,
    confirmPassword: z.string(),
    preferredLanguage: z.enum(["en", "hi", "pa"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "auth.errors.passwords_dont_match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, "auth.errors.password_required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
