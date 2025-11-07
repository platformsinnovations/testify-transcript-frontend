'use client';
import React from 'react';
import Image from 'next/image';

function LandingSection2() {
  return (
    <section className="bg-white w-full max-w-[1083px] mx-auto flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col space-y-8 sm:space-y-12 lg:space-y-16">
          {/* BOTTOM SECTION WITH IMAGE AND TESTIMONIAL */}
          <div className="bg-tms-landing-4 rounded-2xl sm:rounded-3xl lg:rounded-4xl shadow-2xl relative w-full overflow-visible">
            <div className="flex flex-col lg:flex-row justify-between px-4 sm:px-8 lg:px-16 py-8 sm:py-12 relative">

              {/* IMAGE SECTION — head outside, feet/waist touching bottom */}
              <div className="order-1 lg:order-1 lg:absolute lg:-left-12 lg:bottom-0 lg:-translate-y w-full lg:w-1/2 h-[300px] lg:h-[500px] mt-8 lg:mt-0 flex items-end">
                <Image
                  src="/universityTranscript/student.svg"
                  alt="Student graduate"
                  width={374}
                  height={500}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>

              {/* TEXT CONTENT */}
              <div className="order-1 lg:order-2 lg:ml-auto lg:max-w-[50%] z-10">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-tms-text mb-4 sm:mb-6 lg:mb-8">
                  What Universities & Students Say
                </h3>
                <blockquote className="text-tms-admin text-base sm:text-lg mb-4 sm:mb-6 max-w-[494px]">
                  “Testify has completely transformed how we process transcripts. <br />Requests that used to take weeks are now done in days, with zero fraud cases.”
                </blockquote>
                <div className="text-[#039F57]">
                  <p className="font-semibold text-base sm:text-lg">Registrar, Federal University</p>
                  <p>of Technology Akure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingSection2;



