import { fetchAPIClient } from "../client";
import type { Envelope } from "../envelope";
import type { User } from "./users.types";
import { normalize, type RawUser } from "./users.shared";

export async function login(input: { email: string; password: string }): Promise<User> {
  const response = await fetchAPIClient<Envelope<RawUser>>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return normalize(response.data);
}

export async function register(input: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<User> {
  const response = await fetchAPIClient<Envelope<RawUser>>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return normalize(response.data);
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

export async function forgotPassword(input: { email: string }): Promise<{ message: string }> {
  const response = await fetchAPIClient<{ data: { message: string } }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function resetPassword(input: {
  token: string;
  new_password: string;
}): Promise<{ message: string }> {
  const response = await fetchAPIClient<{ data: { message: string } }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function googleAuth(input: { code: string }): Promise<User> {
  const response = await fetchAPIClient<Envelope<RawUser>>("/auth/google", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return normalize(response.data);
}

export async function changePassword(input: {
  current_password: string;
  new_password: string;
  new_password_confirm: string;
}): Promise<{ message: string }> {
  const response = await fetchAPIClient<{ data: { message: string } }>("/me/password", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function deleteAccount(input: {
  password: string; // empty string for Google users
  confirmation: string; // must be "DELETE"
  reason?: string;
}): Promise<void> {
  await fetchAPIClient("/me", {
    method: "DELETE",
    body: JSON.stringify(input),
  });
}