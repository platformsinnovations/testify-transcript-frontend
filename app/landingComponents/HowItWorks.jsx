import Image from "next/image";
import React from "react";
import { BsQrCode } from "react-icons/bs";

const HowItWorks = ({ id }) => {
  return (
    <div id={id} className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <p className="text-teal-600 text-sm font-medium uppercase tracking-wide mb-2">
            YOUR TESTIMONIALS, SIMPLIFIED
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            From <span className="text-teal-600">download to verification</span>,
          </h2>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Testify ensures speed & accuracy
          </h2>
        </div>

        {/* THREE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mx-4 md:mx-auto md:gap-8">
          {/* CARD 1 - Record Upload */}
          <div className="bg-tms-landing-3 rounded-2xl p-8 text-center relative">
            <div className="mb-6 flex justify-center">
              <div className="bg-[#FFFFFFB8] rounded-lg p-4 shadow-sm w-56 h-56 relative">
                <div className="flex items-center justify-between mx-3 mb-3">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center">
                    <Image
                      src="/landing/landingStudent2.svg"
                      alt="Graduate Student"
                      width={16}
                      height={16}
                      className="w-12 h-12"
                      priority
                    />
                  </div>
                  <div className="flex flex-col justify-end items-end">
                    <div className="w-24 h-2 bg-orange-400 rounded mb-1"></div>
                    <div className="w-12 h-2 bg-tms-landing-blue rounded"></div>
                  </div>
                </div>
                <div className="text-xs text-tms-text font-bold mb-2">2024/2025</div>
                <div className="w-20 h-2 bg-green-500 rounded mb-3"></div>
                <div className="w-10 h-2 bg-tms-landing-blue rounded mb-3"></div>
                <div className="flex items-center justify-center text-lg text-tms-text font-bold">
                  <div className="w-4 h-4 bg-green-500 rounded-sm mr-2 flex items-center justify-center">
                    <span className="text-white text-xs">📄</span>
                  </div>
                  Student Records
                </div>
              </div>
            </div>
            {/* BOTTOM SECTION */}
            <div className="absolute top-56 left-0 bg-white rounded-b-xl px-6 py-8 shadow-lg w-full">
              <h3 className="text-xl font-bold text-[#013F4C] mb-3">Record Upload</h3>
              <p className="text-tms-gray-20 text-sm leading-relaxed">
                Schools submit student records and grades from the First
                School Leaving Certificate Exam.
              </p>
            </div>
          </div>

          {/* CARD 2 - QR-Enabled Testimonial */}
          <div className="bg-tms-landing-4 rounded-2xl p-8 text-center relative">
            <div className="mb-6 flex justify-center">
              <div className="bg-white rounded-lg p-6 shadow-sm w-56 h-56 flex items-center justify-center">
                {/* QR CODE REPRESENTATION */}
                {/* <div className="grid grid-cols-8 gap-1"> */}
                <div className="flex flex-col items-center justify-center mb-4">
                  <div className="flex mb-3 flex-col justify-end items-end">
                    <div className="w-28 h-2 bg-orange-400 rounded mb-1"></div>
                    <div className="w-28 h-2 bg-tms-lightGreen rounded"></div>
                  </div>
                  <BsQrCode className="w-28 h-28" />
                  {/* {Array.from({ length: 64 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 ${
                        Math.random() > 0.5 ? "bg-gray-900" : "bg-white"
                      }`}
                    ></div>
                  ))} */}
                </div>
              </div>
            </div>
            {/* BOTTOM SECTION */}
            <div className="absolute top-56 left-0 bg-white rounded-b-xl px-6 py-8 shadow-lg w-full">
              <h3 className="text-xl font-bold text-[#013F4C] mb-3">
                QR-Enabled Testimonial
              </h3>
              <p className="text-tms-gray-20 text-sm leading-relaxed">
                We generate your testimonial with a secure QR code linked to your
                official result.
              </p>
            </div>
          </div>

          {/* CARD 3 - Student Access */}
          <div className="bg-tms-landing-5 rounded-2xl p-8 text-center relative">
            <div className="mb-6 flex justify-center">
              <div className="bg-white rounded-lg p-4 shadow-sm w-56 h-56 relative">
                <div className="flex flex-col items-start gap-3 mb-3">
                  
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#FDB52A] rounded-full"></div>
                    <div className="w-2 h-2 bg-tms-darkGreen rounded-full"></div>
                    <div className="w-2 h-2 bg-tms-lightGreen rounded-full"></div>
                  </div>
                  <span className="text-xs font-semibold text-[#013F4C]">Welcome Alex</span>
                </div>
                <div className="flex items-center space-x-6 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center">
                    <Image
                      src="/landing/landingStudent3.svg"
                      alt="Graduate Student"
                      width={16}
                      height={16}
                      className="w-12 h-12"
                      priority
                    />
                  </div>
                  </div>
                  <div className="bg-[#039F57] text-white w-1/2 px-2 py-1 rounded text-xs">
                    Download Testimonial
                  </div>
                </div>
                <div className="flex text-xs font-bold text-[#013F4C] mb-2">2024/2025</div>
                <div className="w-20 h-2 bg-tms-lightGreen rounded mb-2"></div>
                <div className="w-16 h-2 bg-tms-landing-blue rounded mb-2"></div>
                <div className="w-24 h-2 bg-[#FDB52A] rounded"></div>
              </div>
            </div>
            {/* BOTTOM SECTION */}
            <div className="absolute top-56 left-0 bg-white rounded-b-xl px-6 py-8 shadow-lg w-full">
              <h3 className="text-xl font-bold text-[#013F4C] mb-3">
                Student Access
              </h3>
              <p className="text-tms-gray-20 text-sm leading-relaxed">
                Students log in, verify their details, and print their testimonial
                anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
