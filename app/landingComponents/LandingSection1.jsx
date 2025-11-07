'use client';
import React from 'react';
import Image from 'next/image';

function LandingSection1() {
  return (
    <section className="bg-white w-3/5 mx-auto flex justify-center">
      {/* USE CONSISTENT HORIZONTAL PADDING AND CENTER CONTENT */}
      <div className="w-full max-w-[1083px] px-6 sm:px-8 lg:px-10 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col space-y-12 lg:space-y-16">
          {/* TOP SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-tms-darkGreen">
              We make transcript management simple
            </h2>
            <div className="flex gap-4 sm:gap-6 items-start">
              <span className="text-xl sm:text-2xl font-bold text-tms-darkGreen shrink-0">01.</span>
              <div>
                <h3 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg text-[#012615]">
                  Digitized Transcript Records
                </h3>
                <p className="text-gray-600 text-sm">
                  Universities upload results and generate <br /> official transcripts within minutes — no <br />paperwork needed.
                </p>
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            <div className="flex gap-4 sm:gap-6 items-start">
              <span className="text-xl sm:text-2xl font-bold text-tms-darkGreen shrink-0">03.</span>
              <div>
                <h3 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg text-[#012615]">
                  Unified Access for All
                </h3>
                <p className="text-gray-600 text-sm">
                  Students, universities, and verifiers connect seamlessly in one trusted ecosystem.
                </p>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6 items-start">
              <span className="text-xl sm:text-2xl font-bold text-tms-darkGreen shrink-0">02.</span>
              <div>
                <h3 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg text-[#012615]">
                  Instant Verification System
                </h3>
                <p className="text-gray-600 text-sm">
                  Each transcript is QR-secured for authenticity, helping employers and institutions verify confidently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingSection1;

