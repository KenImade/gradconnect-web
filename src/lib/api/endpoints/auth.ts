import { fetchAPIClient } from "../client";
import type { User } from "./users.types";
import type { Envelope } from "../envelope";


export async function login(input: {
    email: string;
    password: string;
}): Promise<User> {
    const response = await fetchAPIClient<User>("/auth/login", {
        method: "POST",
        body: JSON.stringify(input),
    });
    return response;
}

export async function register(input: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}): Promise<User> {
    const response = await fetchAPIClient<User>("/auth/register", {
        method: "POST",
        body: JSON.stringify(input),
    });
    return response;
}

export async function logout(): Promise<void> {
    await fetchAPIClient("/auth/logout", {
        method: "POST",
    });
}

export async function resendVerificationEmail(): Promise<{ message: string }> {
    return fetchAPIClient<{ message: string }>("/auth/resend-verification", {
        method: "POST",
    });
}

/**
 * POST /auth/forgot-password — request a password reset email.
 * Always returns 200 regardless of whether the email exists (enumeration-proof).
 */
export async function forgotPassword(input: {
    email: string;
}): Promise<{ message: string }> {
    const response = await fetchAPIClient<{ data: { message: string } }>(
        "/auth/forgot-password",
        {
            method: "POST",
            body: JSON.stringify(input),
        },
    );
    return response.data;
}

/**
 * POST /auth/reset-password — validate a reset token and set a new password.
 */
export async function resetPassword(input: {
    token: string;
    new_password: string;
}): Promise<{ message: string }> {
    const response = await fetchAPIClient<{ data: { message: string } }>(
        "/auth/reset-password",
        {
            method: "POST",
            body: JSON.stringify(input),
        },
    );
    return response.data;
}