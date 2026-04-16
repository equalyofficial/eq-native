import { z } from "zod";
import { PasswordSchema, PhoneSchema } from "@/lib/schemas";

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: PasswordSchema,
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name is too long"),
});

export const LoginSchema = z.union([
  z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    mode: z.literal("email"),
  }),
  z.object({
    phone: PhoneSchema,
    password: z.string().min(1, "Password is required"),
    mode: z.literal("phone"),
  }),
]);

export const ForgotPasswordSchema = z.union([
  z.object({
    phone: PhoneSchema,
    mode: z.literal("phone"),
  }),
  z.object({
    email: z.string().email("Invalid email address"),
    mode: z.literal("email"),
  }),
]);

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    new_password: PasswordSchema,
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type RegisterFormValues = z.infer<typeof RegisterSchema>;
export type LoginFormValues = z.infer<typeof LoginSchema>;
export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;
