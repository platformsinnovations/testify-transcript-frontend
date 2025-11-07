"use client";

import Button from "@/components/ui/Button";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";

const SignIn = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password, rememberMe);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-end overflow-hidden bg-white pr-56 max-lg:justify-center max-lg:pr-0">
      {/* DECORATIVE CIRCLES */}
      <div className="absolute left-16 top-24 h-10 w-[39px] rounded-full bg-tms-landing-4" />
      <div className="absolute left-21 top-24 h-[71px] w-[69px] rounded-full bg-tms-landing-3" />

      {/* BG WAVE (middle layer - image) */}
      <img
        src="/universityTranscript/loginWave.svg"
        alt="Wave Background"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1440px] h-[380px] max-w-full object-cover z-20 pointer-events-none"
      />

      {/* LEFT IMAGE (lowest layer) */}
      <img
        src="/universityTranscript/loginImage.svg"
        alt="Graduate"
        className="absolute left-28 top-60 -translate-y-1/2 w-[494px] h-[550px] max-w-full object-contain rounded-[29px] p-[40px] pt-[48px] pb-[48px] z-10 hidden lg:block"
      />

      {/* TOP-LEFT LOGO */}
      <div className="absolute top-6 left-8 z-30">
        <Link
          href="/"
        >
          <img
            src="/universityTranscript/testifyIconLogin.svg"
            alt="Testify Logo"
            className="w-[70px] h-auto"
          />
        </Link>
      </div>

      {/* SIGN IN FORM (topmost layer) */}
      <div className="relative z-40 flex justify-center w-full max-w-[420px] h-[440px] flex-col bg-white p-8 rounded-2xl shadow-2xl border gap-4 max-md:p-8">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold text-tms-admin-dash mb-1">
            Sign In
          </h1>
          <p className="text-base text-tms-gray-20">Welcome back to Testify!</p>
          <p className="text-sm text-tms-gray-20 mb-4">
            Kindly sign in to access your transcript
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

          {/* PASSWORD */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-tms-admin-dash"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full px-4 py-3 text-sm border border-[#e0e0e0] rounded-lg outline-none bg-white text-black placeholder:text-[#999999] focus:border-[#10b981]"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* REMEMBER ME + FORGOT PASSWORD OPTIONS */}
          <div className="flex justify-between items-center pt-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                className="w-4 h-4 cursor-pointer accent-[#10b981]"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label
                htmlFor="rememberMe"
                className="text-xs font-medium text-tms-admin-dash cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-tms-admin-dash hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* SUBMIT BTN */}
          <Button
            type="submit"
            disabled={isLoading}
            width="100%"
            height="48px"
            className="mt-2 text-base font-semibold text-white bg-tms-lightGreen border-none rounded-lg cursor-pointer transition-colors hover:bg-[#059669] active:bg-[#047857] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default SignIn;
