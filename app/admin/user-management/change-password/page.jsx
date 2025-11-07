"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function ChangePassword() {
  const { user, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // GET BRAND COLOR FROM USER'S SCHOOL OR USE DEFAULT
  const getBrandColor = () => {
    return user?.school?.brandColor || '#04BF68'; // Default color
  };

  const brandColor = getBrandColor();
  
  // GET AUTH TOKEN FROM STORAGE - (sessionStorage or localStorage)
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // CLIENT VALIDATION (first)
    if (!token) {
      toast.error("You are not authenticated. Please login again.");
      setIsLoading(false);
      return;
    }

    // CHECK IF PASSWORDS MATCH BEFORE SENDING TO SERVER
    if (newPassword !== newPasswordConfirmation) {
      toast.error("New password and confirmation do not match");
      setIsLoading(false);
      return;
    }

    // CHECK PASSWORD LENGTH AND COMPLEXITY
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const requestData = {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation,
      };
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/change-password`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      const data = response.data;
      
      // ON SUCCESS, SHOW MESSAGE AND CLEAR FORM
      toast.success(data.message || "Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirmation("");

      // LOG OUT AFTER SUCCESSFUL PASSWORD CHANGE
      setTimeout(() => {
        logout();
      }, 1500); // DELAY TO LET USER SEE SUCCESS MESSAGE
    } catch (error) {
      console.error('Error details:', error);
      console.log('Full error response:', error.response);
      console.log('Response data:', error.response?.data);
      console.log('Response status:', error.response?.status);
      
      const responseData = error.response?.data;

      // SHOW ONLY ONE ERROR MESSAGE BASED ON PRIORITY
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 422) {
        console.log('Validation errors:', responseData?.errors);

        // CHECK IF IT'S A CURRENT PASSWORD VALIDATION ERROR
        if (responseData?.errors?.current_password) {
          toast.error("Current password is incorrect");
          setCurrentPassword(""); // Clear only current password
        } else if (responseData?.errors?.new_password) {
          // HANDLE NEW PASSWORD VALIDATION ERRORS
          toast.error(responseData.errors.new_password[0] || "Invalid new password format");
        } else if (responseData?.errors?.new_password_confirmation) {
          // HANDLE CONFIRMATION VALIDATION ERRORS
          toast.error("Passwords do not match");
        } else if (responseData?.message) {
          // HANDLE GENERAL VALIDATION MESSAGE
          toast.error(responseData.message);
        } else {
          // FALLBACK ERROR MESSAGE
          toast.error("Please check your password requirements and try again");
        }
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex w-full items-center justify-center overflow-hidden bg-white min-h-[calc(100vh-160px)] px-2 sm:px-4">
      {/* WAVE BG */}
      {/* <img
        src="/universityTranscript/changepasswordWave.svg"
        alt="Wave Background"
        className="absolute bottom-0 left-0 w-full object-cover pointer-events-none"
        style={{height: '220px'}}
      /> */}
      {/* CENTERED FORM */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-md bg-white rounded-2xl shadow-2xl border p-4 sm:p-6 mx-auto mt-8 mb-4 sm:mt-0 sm:mb-0" style={{minHeight: '360px'}}>
        {/* <img src="/universityTranscript/testifyIconLogin.svg" alt="Testify Logo" className="w-10 h-auto mb-2" /> */}
        {/* <h1 className="text-lg font-bold text-tms-admin-dash mb-1">Change Password</h1> */}
        <p className="text-xs text-gray-500 mb-2 text-center">Enter a new password below. Ensure it meets our security requirements and is easy for you to remember.</p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="currentPassword" className="text-sm font-semibold text-tms-admin-dash">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                className="w-full px-4 py-3 text-sm border border-[#e0e0e0] rounded-lg outline-none text-black bg-white placeholder:text-[#999999] focus:border-[#10b981]"
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? (
                  <AiOutlineEyeInvisible className="w-5 h-5" />
                ) : (
                  <AiOutlineEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-col gap-2 w-full sm:w-1/2">
              <label htmlFor="newPassword" className="text-sm font-semibold text-tms-admin-dash">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  className="w-full px-4 py-3 text-sm border border-[#e0e0e0] rounded-lg outline-none text-black bg-white placeholder:text-[#999999] focus:border-[#10b981]"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <AiOutlineEyeInvisible className="w-5 h-5" />
                  ) : (
                    <AiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-1/2">
              <label htmlFor="newPasswordConfirmation" className="text-sm font-semibold text-tms-admin-dash">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="newPasswordConfirmation"
                  className="w-full px-4 py-3 text-sm border border-[#e0e0e0] rounded-lg outline-none text-black bg-white placeholder:text-[#999999] focus:border-[#10b981]"
                  placeholder="Confirm new password"
                  value={newPasswordConfirmation}
                  onChange={e => setNewPasswordConfirmation(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible className="w-5 h-5" />
                  ) : (
                    <AiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            width="100%"
            height="48px"
            className="mt-2 text-base font-semibold text-white bg-tms-lightGreen py-2 border-none rounded-lg cursor-pointer transition-colors hover:bg-[#059669] active:bg-[#047857] disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: brandColor }}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
        {/* <p className="text-xs text-gray-400 mt-2 text-center">Developed by Platforms Innovations LTD ©2025</p> */}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
