"use client";
import React from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { Shield, FileCheck, LayoutDashboard, UserCheck } from "lucide-react";

const AddValue = () => {
  const handleLearnMore = async (e) => {
    e.preventDefault();
    try {
      if (onLearnMore) {
        await onLearnMore();
      }
      router.push("/auth/sign-in");
    } catch (err) {
      console.error("School login failed", err);
    } finally {
      closeMobileMenu();
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Fast & Secure Processing",
      description:
        "Submit transcript requests and get them processed quickly with bank-level security",
    },
    {
      icon: FileCheck,
      title: "Seamless Verification",
      description:
        " Employers and institutions can verify authenticity with just one click or a QR scan.",
    },
    {
      icon: LayoutDashboard,
      title: "University Dashboard",
      description:
        "Manage transcript requests, track payments, and generate official records easily.",
    },
    {
      icon: UserCheck,
      title: "Easy Student Access",
      description:
        "Students can log in, request, and track transcript status anytime, anywhere.",
    },
  ];

  return (
    <div className="relative mx-auto px-4 sm:px-6 lg:px-8 max-w-[960px] py-8 sm:py-12 lg:py-16">
      {/* LEFT DECORATIVE GEAR - Hidden on mobile */}
      <div className="hidden md:block absolute -left-8 lg:-left-24 top-1/2 -translate-y-1/2">
        <Image
          src="/universityTranscript/gearLeft.svg"
          alt=""
          width={90}
          height={90}
          className="opacity-30 w-16 lg:w-[90px] h-16 lg:h-[90px]"
        />
      </div>

      {/* MAIN CONTENT CARD */}
      <div className="relative bg-tms-landing-3 shadow-lg border rounded-2xl sm:rounded-4xl p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 items-start md:items-center">
          {/* LEFT SECTION */}
          <div className="col-span-1 md:col-span-2 space-y-4 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-tms-text">
              We add value to every transcript journey
            </h2>
            <Button
              onClick={handleLearnMore}
              loadingText="Loading..."
              className="w-full md:w-auto"
            >
              Learn More
            </Button>
          </div>

          {/* RIGHT SECTION - Features grid */}
          <div className="col-span-1 md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="space-y-2">
                    <div className="bg-tms-lightGreen p-2 rounded-lg w-fit mb-2">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-[#013F4C] text-lg sm:text-xl">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-tms-gray-20 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddValue;