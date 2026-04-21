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