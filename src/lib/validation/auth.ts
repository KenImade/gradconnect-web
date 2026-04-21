import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
    .object({
        first_name: z
            .string()
            .min(1, "First name is required")
            .max(100, "First name is too long"),
        last_name: z
            .string()
            .min(1, "Last name is required")
            .max(100, "Last name is too long"),
        email: z.string().min(1, "Email is required").email("Enter a valid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(128, "Password is too long"),
        password_confirm: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.password_confirm, {
        message: "Passwords don't match",
        path: ["password_confirm"],
    });

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Enter a valid email address"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
    .object({
        new_password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(128, "Password is too long"),
        password_confirm: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.new_password === data.password_confirm, {
        message: "Passwords don't match",
        path: ["password_confirm"],
    });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;