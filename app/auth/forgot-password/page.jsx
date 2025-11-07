"use client";

import Button from "@/components/ui/Button";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok && data.status) {
        // SUCCESS CASE
        toast.success(data.message);
        setTimeout(() => {
          router.push("/auth/sign-in");
        }, 2000);
      } else {
        // ERROR CASE - could be "No account found" or other errors
        if (data.errors && data.errors.email) {
          // SHOW THE SPECIFIC EMAIL-RELATED ERROR
          toast.error(data.errors.email[0]);
        } else {
          // SHOW GENERAL ERROR MESSAGE
          toast.error(data.message || "Failed to send reset link");
        }
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-white overflow-hidden">
      {/* DECORATIVE CIRCLES */}
      <div className="absolute left-16 top-24 h-10 w-[39px] rounded-full bg-tms-landing-4" />
      <div className="absolute left-21 top-24 h-[71px] w-[69px] rounded-full bg-tms-landing-3" />

      {/* BG WAVE (middle layer - image) */}
      <img
        src="/universityTranscript/loginWave.svg"
        alt="Wave Background"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1440px] h-[380px] max-w-full object-cover z-20 pointer-events-none"
      />

      {/* RESET PASSWORD (topmost layer) */}
      <div className="relative z-40 flex justify-center w-full max-w-[420px] h-[440px] flex-col bg-white p-8 rounded-2xl shadow-2xl border gap-4 max-md:p-8">
        <div className="flex justify-center mb-4">
          <Link href="/">
            <img
              src="/universityTranscript/testifyIconLogin.svg"
              alt="Testify Logo"
              className="w-[70px] h-auto"
            />
          </Link>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold text-tms-admin-dash mb-1">
            Forgot Password
          </h1>
          <p className="text-base text-tms-gray-20 mb-1">Don't worry!</p>
          <p className="text-sm text-tms-gray-20 mb-4 text-center">
            Enter your email and we'll send you a link to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* EMAIL */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-tms-admin-dash"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 text-sm border border-[#e0e0e0] rounded-lg outline-none bg-white text-black placeholder:text-[#999999] focus:border-[#10b981]"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* SUBMIT BTN */}
          <Button
            type="submit"
            disabled={isLoading}
            width="100%"
            height="48px"
            className="mt-2 text-base font-semibold text-white bg-tms-lightGreen border-none rounded-lg cursor-pointer transition-colors hover:bg-[#059669] active:bg-[#047857] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>

          {/* BACK TO SIGN IN */}
          <div className="text-center mt-4">
            <Link
              href="/auth/sign-in"
              className="text-sm font-medium text-tms-admin-dash hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}
