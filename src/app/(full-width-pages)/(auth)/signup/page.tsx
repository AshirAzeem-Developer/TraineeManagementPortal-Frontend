import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Trainee Portal",
  description: "Create your trainee account",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <SignUpForm />
    </div>
  );
}