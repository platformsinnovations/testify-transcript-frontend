import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const WhatPeopleSay = () => {
  const reviews = [
    {
      id: 1,
      title: "Very Fast",
      description:
        "I printed my testimonial in minutes, and every school I applied to verified it instantly.",
      author: "Chiamake, Owo High School, Owo",
      image:
        "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    },
    {
      id: 2,
      title: "Very Easy To Use",
      description:
        "Safe TMS is a centralised secure platform designed to streamline the issuance",
      author: "HR Consultant, Nigeria",
      image:
        "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    },
  ];

  const [currentReview, setCurrentReview] = useState(0);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToReview = (index) => {
    setCurrentReview(index);
  };

  return (
    <section className="min-h-screen bg-gray-">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center">
          {/* LEFT SIDE - Testimonial Card */}
          <div className="relative w-full">
            {/* ORANGE BACKGROUND CARD */}
            {/* <div className="relative bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-3xl p-8 shadow-2xl h-[390px] w-80"> */}
            <div className="relative rounded-3xl p-8 h-[390px] w-96">
              {/* BG IMAGEe */}
              <div
                className="absolute inset-0 bg-cove rounded-3xl bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/landing/whatPeopleSay.svg')" }}
              ></div>
            </div>

            {/* WHITE TESTIMONIAL CARD - Positioned to overlap on top */}
            <div className="absolute top-36 md:left-12 md:right-0 bg-white rounded-2xl p-6 shadow-lg transform transition-all duration-500 ease-in-out z-30 w-full md:w-[439px] h-56">
              <div className="space-y-4 h-full flex flex-col justify-center">
                <h3 className="text-xl font-bold text-gray-900">
                  "{reviews[currentReview].title}"
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {reviews[currentReview].description}
                </p>
                <p className="text-sm font-medium text-gray-500">
                  {reviews[currentReview].author}
                </p>
              </div>
              <div className="absolute bottom-8 -right-12 transform -translate-x-1/2 flex items-center justify-center space-x-3 z-20">
                <button
                  onClick={prevReview}
                  className={`w-8 h-8 rounded-lg backdrop-blur-sm border border-tms-lightGreen flex items-center justify-center transition-all duration-200 ${
                    currentReview === 0
                      ? "bg-tms-lightGreen text-white hover:bg-tms-lightGreen/90"
                      : "bg-white/20 text-tms-lightGreen hover:bg-white/30"
                  }`}
                >
                  <ChevronLeft />
                </button>

                <div className="flex space-x-2">
                  {reviews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToReview(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        currentReview === index
                          ? "bg-[#bbf3d9]"
                          : "bg-tms-lightGreen hover:bg-tms-lightGreen"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextReview}
                  className={`w-8 h-8 rounded-lg backdrop-blur-sm border border-tms-lightGreen flex items-center justify-center transition-all duration-200 ${
                    currentReview === reviews.length - 1
                      ? "bg-tms-lightGreen text-white hover:bg-tms-lightGreen/90"
                      : "bg-white/20 text-tms-lightGreen hover:bg-white/30"
                  }`}
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Content */}
          <div className="space-y-8">
            {/* HEADER */}
            <div className="space-y-6">
              <div className="inline-block">
                <span className="text-tms-lightGreen font-semibold text-sm tracking-wide uppercase bg-green-50 px-3 py-1 rounded-full">
                  WHAT PEOPLE SAY
                </span>
              </div>

              <h2 className="text-xl lg:text-3xl font-bold text-[#013F4C] leading-tight">
                Trusted Across Schools, Ministries, <br />
                and Verification Agencies
              </h2>

              <p className="text-lg text-tms-gray-20 leading-relaxed">
                Tesify powers secure testimonial management for education
                institutions, alumni, and official verifiers
              </p>
            </div>

            {/* ACTION BTN */}
            <div className="flex items-center justify-center md:items-start md:justify-start flex-col sm:flex-row gap-4">
              <button className="bg-tms-lightGreen hover:bg-tms-lightGreen/90 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                Verify Testimonial
              </button>
              <button className="border-2 border-tms-lightGreen text-tms-lightGreen hover:bg-tms-lightGreen/10 font-semibold px-8 py-3 rounded-xl transition-all duration-200">
                Browse Features
              </button>
            </div>

            {/* TRUST LOGOS */}
            <div className="pt-8">
              <div className="flex items-center justify-start space-x-8 opacity-60">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="font-bold text-sm">
                      <svg
                        width="27"
                        height="19"
                        viewBox="0 0 27 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.8063 16.25L26.89 14V18.5H15.6858V14.7346C17.9816 13.7412 19.6073 11.2685 19.6073 8.375C19.6073 4.60625 16.8488 1.65537 13.445 1.65537C10.0412 1.65537 7.28271 4.60512 7.28271 8.375C7.28271 11.2685 8.90844 13.7412 11.2042 14.7346V18.5H0V14L10.0838 16.25V15.6774C6.79869 14.5096 4.48167 11.6802 4.48167 8.375C4.48167 4.02575 8.495 0.5 13.445 0.5C18.395 0.5 22.4083 4.02575 22.4083 8.375C22.4083 11.6802 20.0913 14.5085 16.8063 15.6774V16.25Z"
                          fill="#025158"
                        />
                      </svg>
                    </span>
                  </div>
                  <span className="text-tms-darkGreen font-semibold">
                    Omega Million
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <span className=" font-bold text-sm">
                      <svg
                        width="39"
                        height="32"
                        viewBox="0 0 39 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M31.4541 1.26758C31.1956 1.01456 30.8044 1.01456 30.5459 1.26758C29.6109 2.18253 27.7839 4.12257 26.1914 6.70996C24.5979 9.2991 23.25 12.5194 23.25 16C23.25 19.4806 24.5979 22.7009 26.1914 25.29C27.7839 27.8774 29.6109 29.8175 30.5459 30.7324C30.8044 30.9854 31.1956 30.9854 31.4541 30.7324C32.3891 29.8175 34.2161 27.8774 35.8086 25.29C37.4021 22.7009 38.75 19.4806 38.75 16C38.75 12.5194 37.4021 9.2991 35.8086 6.70996C34.2161 4.12257 32.3891 2.18253 31.4541 1.26758Z"
                          fill="#025158"
                          stroke="#0D5C36"
                          strokeWidth="0.5"
                        />
                        <path
                          d="M32.0476 14.4844C32.0931 14.6221 32.1959 14.7333 32.3298 14.7891L35.238 16L32.3298 17.2109C32.1959 17.2667 32.0931 17.3779 32.0476 17.5156L30.9998 20.7002L29.9529 17.5156C29.9074 17.3777 29.8037 17.2667 29.6697 17.2109L26.7615 16L29.6697 14.7891C29.8037 14.7333 29.9074 14.6223 29.9529 14.4844L30.9998 11.2998L32.0476 14.4844Z"
                          fill="#025158"
                          stroke="#0D5C36"
                          strokeWidth="0.5"
                        />
                        <path
                          d="M31 6.5L34 4"
                          stroke="#0D5C36"
                          strokeWidth="0.5"
                        />
                        <path
                          d="M31 8.5L35 5.5"
                          stroke="#0D5C36"
                          strokeWidth="0.5"
                        />
                        <path
                          d="M31 10.5L36 7"
                          stroke="#0D5C36"
                          strokeWidth="0.5"
                        />
                        <path
                          d="M31 25.5L28 28"
                          stroke="#0D5C36"
                          strokeWidth="0.5"
                        />
                        <path
                          d="M31 23.5L27 26.5"
                          stroke="#0D5C36"
                          strokeWidth="0.5"
                        />
                        <path
                          d="M31 21.5L26 25"
                          stroke="#0D5C36"
                          strokeWidth="0.5"
                        />
                        <path
                          d="M1 1V11.5"
                          stroke="#0D5C36"
                          strokeWidth="0.5"
                        />
                        <path
                          d="M1 20.5V31"
                          stroke="#0D5C36"
                          strokeWidth="0.5"
                        />
                      </svg>
                    </span>
                  </div>
                  <span className="text-tms-darkGreen">Harvest</span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <span className=" font-bold text-sm">
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 26 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="3.81768"
                          y="15.6"
                          width="12.9856"
                          height="12.9856"
                          transform="rotate(-45 3.81768 15.6)"
                          fill="#025158"
                          stroke="#5D3CBB"
                          strokeWidth="1.72226"
                        />
                        <rect
                          x="3.81768"
                          y="10.4"
                          width="12.9856"
                          height="12.9856"
                          transform="rotate(-45 3.81768 10.4)"
                          fill="#025158"
                          stroke="#5D3CBB"
                          strokeWidth="1.72226"
                        />
                      </svg>
                    </span>
                  </div>
                  <span className="text-tms-darkGreen font-semibold">EdgeKart</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatPeopleSay;
