import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Trainee Portal",
  description: "Sign in to access your account",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <SignInForm />
    </div>
  );
}