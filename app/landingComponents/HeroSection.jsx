"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { FaLock } from "react-icons/fa6";
import { SiVerizon } from "react-icons/si";
import { BsQrCode } from "react-icons/bs";
import { useRouter } from "next/navigation";
import LandingNav from "./LandingNav";
import Button from "@/components/ui/Button";

export default function LandingPage({ id }) {
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const router = useRouter();

  const handleVerifyTranscriptButton = async (e) => {
    if (e) e.preventDefault();
    try {
      setVerifyLoading(true);
      await router.push("/auth/sign-in");
    } catch (err) {
      console.error("Verification failed", err);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleRequestTranscriptButton = async (e) => {
    if (e) e.preventDefault();
    try {
      setDownloadLoading(true);
      await router.push("/auth/student-register");
    } catch (err) {
      console.error("Request failed", err);
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div id={id} className="min-h-screen bg-white relative overflow-hidden">
      {/* BG SVG - Desktop */}
      <div className="absolute inset-0 w-full h-full hidden md:block">
        <Image
          src="/landing/landingBg.svg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* BG SVG - Mobile */}
      <div className="absolute inset-0 w-full h-full block md:hidden">
        <Image
          src="/landing/landingBgMobile.svg"
          alt="Background Mobile"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* NAVBAR */}
      <LandingNav logoText="Testify" logoIcon={FaLock} />

      {/* CONTENT CONTAINER */}
      <div className="max-w-[1200px] mx-auto relative z-10 px-4 sm:px-6 lg:px-16 py-4">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between pt-[76px] md:pt-24 pb-12 md:pb-16 lg:pb-24">
          {/* LEFT CONTENT */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0 lg:mb-0 px-0 md:px-4 text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Get Verified Transcripts Online with Ease
            </h1>
            <p className="text-sm md:text-base text-white/90 mb-6 md:mb-8 px-0 md:px-4 max-w-[600px] mx-auto lg:mx-0">
              Simplify the process of requesting, generating, and verifying
              university transcripts — securely, efficiently, and all in one
              place.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
              <Button
                onClick={handleRequestTranscriptButton}
                loadingText="Loading..."
                className="inline-flex justify-center"
                width="184px"
                height="52px"
              >
                Request Transcript
              </Button>

              <Button
                onClick={handleVerifyTranscriptButton}
                loadingText="Loading..."
                className="inline-flex justify-center"
                width="184px"
                height="52px"
                backgroundColor="#fff"
                textColor="#013F4C"
              >
                Verify Transcript
              </Button>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end lg:pr-8 mb-0 lg:mb-16">
            <div className="w-[280px] h-[260px] md:w-[430px] md:h-[390px] relative lg:translate-x-5">
              <Image
                src="/universityTranscript/heroImage.svg"
                alt="Graduate Student"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
