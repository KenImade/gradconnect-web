import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
    title: "Create an account",
    description: "Sign up to bookmark opportunities, track applications, and share reviews.",
};

export default async function RegisterPage() {
    const user = await getSession();
    if (user) redirect("/dashboard");

    return (
        <div>
            <div className="text-center">
                <h1 className="font-display text-display-lg text-foreground">Create an account</h1>
                <p className="mt-3 text-body-sm text-text-dim">Get started on your graduate job preparation.</p>
            </div>

            <div className="mt-10">
                <RegisterForm />
            </div>

            <p className="mt-8 text-center text-body-sm text-text-dim">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="text-primary hover:text-primary-hover underline underline-offset-4 transition-colors"
                >
                    Log in
                </Link>
            </p>
        </div>
    );
}