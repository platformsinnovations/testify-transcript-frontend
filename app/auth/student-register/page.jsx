"use client";

import Button from "@/components/ui/Button";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StudentRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    matricNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  const validatePassword = (password) => {
    // CHECKS IF PASSWORD CONTAINS AT LEAST ONE NUMBER
    return /\d/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // CLIENT-SIDE VALIDATION FOR PASSWORD  
    if (!validatePassword(formData.password)) {
      toast.error("Password must contain at least one number");
      return;
    }

    setIsLoading(true);

    try {
      // CHECK IF API URL IS DEFINED/CONFIGURED
      if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
        throw new Error('API URL is not configured');
      }

      
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/student/register`;
      console.log('Attempting registration with API URL:', apiUrl);

      const requestData = {
        name: formData.name,
        email: formData.email,
        matric_number: formData.matricNumber, 
        password: formData.password
      };

      console.log('Request data:', requestData);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        toast.success(data.message);
        // STORE TOKEN AND STUDENT DATA FOR AUTO LOGIN
        sessionStorage.setItem('token', data.data.token);
        sessionStorage.setItem('user', JSON.stringify(data.data.student));
        
        // START REDIRECT COUNTDOWN
        setIsRedirecting(true);
        setRedirectCountdown(3);
        
        const countdownInterval = setInterval(() => {
          setRedirectCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              router.push('/student/dashboard');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        // HANDLE VALIDATION ERRORS
        if (data.errors) {
          // GET ERROR MESSAGE FOR EACH FIELD
          Object.entries(data.errors).forEach(([field, errors]) => {
            if (Array.isArray(errors) && errors.length > 0) {
              toast.error(errors[0]);
            }
          });
        } else if (data.exception) {
          // HANDLE SERVER/DB ERRORS
          console.error('Server Error:', data);
          toast.error('Server error occurred. Please try again later.');
        } else if (data.message) {
          // SHOW SERVER SPECIFIC ERRORS
          toast.error(data.message);
        } else {
          // Fallback general error message
          toast.error('Registration failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      console.log('Environment:', {
        NODE_ENV: process.env.NODE_ENV,
        API_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
      });
      
      // CHECK IF IT'S A NETWORK ERROR
      if (!window.navigator.onLine) {
        toast.error('Please check your internet connection.');
      } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
        // More specific error for API configuration issues
        if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
          toast.error('API URL is not configured. Please check your environment variables.');
          console.error('Missing API URL configuration');
        } else {
          toast.error('Unable to connect to the server. Please check your API configuration.');
          console.error('Full API URL attempted:', apiUrl);
        }
      } else {
        console.error('Detailed error:', {
          message: error.message,
          stack: error.stack,
          type: error.constructor.name
        });
        toast.error('Connection error. Please try again or contact support.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-end bg-white pr-56 max-lg:justify-center max-lg:pr-0 overflow-hidden">
      {/* REDIRECT SUCCESS OVERLAY */}
      {isRedirecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-4">Your account has been created successfully.</p>
            <p className="text-lg font-semibold text-gray-700 mb-2">Redirecting to Student Dashboard</p>
            <div className="flex items-center justify-center gap-2">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="3"
                    strokeDasharray={`${(3 - redirectCountdown) * 94.2} 282.6`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.3s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-tms-lightGreen">{redirectCountdown}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
        className="absolute left-28 top-60 -translate-y-1/2 w-[494px] h-[550px] max-w-full object-contain rounded-[29px] p-10 pt-12 pb-12 z-10 hidden lg:block"
      />

      {/* TOP LEFT LOGO */}
      <div className="absolute top-6 left-8 z-30">
        <Link href="/">
          <img
            src="/universityTranscript/testifyIconLogin.svg"
            alt="Testify Logo"
            className="w-[70px] h-auto"
          />
        </Link>
      </div>

      {/* REGISTRATION FORM (topmost layer) */}
      <div className="relative z-40 flex justify-center w-full max-w-[420px] flex-col bg-white p-5 rounded-2xl shadow-2xl border gap-2">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-xl font-bold text-tms-admin-dash">
            Student Registration
          </h1>
          <p className="text-sm text-tms-gray-20">Join Testify Today!</p>
          <p className="text-xs text-tms-gray-20 mb-1">
            Create your account to access your transcript
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          {/* FULL NAME */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="name"
              className="text-xs font-semibold text-tms-admin-dash"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-3 py-2 text-sm border border-[#e0e0e0] rounded-lg outline-none bg-white text-black placeholder:text-[#999999] focus:border-[#10b981]"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-xs font-semibold text-tms-admin-dash"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 text-sm border border-[#e0e0e0] rounded-lg outline-none bg-white text-black placeholder:text-[#999999] focus:border-[#10b981]"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* MATRIC NUMBER */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="matricNumber"
              className="text-xs font-semibold text-tms-admin-dash"
            >
              Matric Number
            </label>
            <input
              type="text"
              id="matricNumber"
              name="matricNumber"
              className="w-full px-3 py-2 text-sm border border-[#e0e0e0] rounded-lg outline-none bg-white text-black placeholder:text-[#999999] focus:border-[#10b981]"
              placeholder="Enter your matric number"
              value={formData.matricNumber}
              onChange={handleChange}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-xs font-semibold text-tms-admin-dash"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="w-full px-3 py-2 text-sm border border-[#e0e0e0] rounded-lg outline-none bg-white text-black placeholder:text-[#999999] focus:border-[#10b981]"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
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

          {/* SUBMIT BTN */}
          <Button
            type="submit"
                      disabled={isLoading}
                      width="100%"
            height="48px"
            className="w-full bg-tms-lightGreen text-white py-2 rounded-lg hover:opacity-90 transition-all duration-200 mt-1"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>

          {/* SIGN IN LINK */}
          <p className="text-center text-xs text-tms-gray-20">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="text-tms-lightGreen hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>

      <Toaster position="top-center" />
    </div>
  );
}
