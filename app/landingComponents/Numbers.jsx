"use client";
import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const Numbers = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  const stats = [
    {
      number: 15,
      suffix: "+",
      label: "Years of experience",
    },
    {
      number: 150,
      suffix: "k +",
      label: "Transcript Processed",
    },
    {
      number: 300,
      suffix: "k +",
      label: "Credential Issued to students",
    },
  ];

  return (
    <div className="w-full mb-8 sm:mb-12 lg:mb-16">
      <div className="px-4 sm:px-6 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between gap-8 lg:gap-12">
          {/* LEFT SECTION */}
          <div className="text-center lg:text-left lg:shrink-0 lg:max-w-sm">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#012615]">
              Our numbers tell more about us
            </h2>
          </div>

          {/* STATS SECTION */}
          <div ref={ref} className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 w-full lg:w-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#013F4C] mb-2 sm:mb-1" style={{ minHeight: "48px" }}>
                  {inView ? (
                    <CountUp
                      start={0}
                      end={stat.number}
                      duration={2.5}
                      suffix={stat.suffix}
                    />
                  ) : (
                    <span>0{stat.suffix}</span>
                  )}
                </div>
                <div className="text-sm sm:text-base text-tms-gray-5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Numbers;