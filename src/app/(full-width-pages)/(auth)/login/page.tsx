import SignInForm from "@/components/auth/SignInForm";
import GridShape from "@/components/common/GridShape";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In | Trainee Portal",
  description: "Sign in to access your account",
};

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col lg:flex-row dark:bg-gray-900">
      {/* Left Side - Sign In Form */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2 lg:p-12">
        <SignInForm />
      </div>

      {/* Right Side - Branding */}
      <div className="hidden h-screen w-full items-center justify-center bg-brand-950 dark:bg-white/5 lg:flex lg:w-1/2">
        <div className="relative z-10 flex items-center justify-center">
          {/* Grid Shape Background */}
          <GridShape />
          
          {/* Content */}
          <div className="relative flex flex-col items-center space-y-4 px-8">
            <Link href="/" className="block">
              <Image
                width={231}
                height={48}
                src="/images/logo/LogoLight.png"
                alt="Logo"
                priority
              />
            </Link>
            <p className="text-center text-base text-gray-400 dark:text-white/60">
              Empowering Trainees, Enabling Success
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}