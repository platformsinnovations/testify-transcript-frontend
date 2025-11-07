import Image from "next/image";
import React from "react";
import { FaFacebook } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io5";
import { BsTwitterX } from "react-icons/bs";

const ContactUs = ({ id }) => {
  return (
    <div id={id} className="w-full">
      {/* TOP SECTION WITH BG IMAGE AND CONTENT */}
      <div className="relative h-80 sm:h-96 lg:h-[400px] overflow-hidden">
        {/* GREEN SLANTED BG */}
        <div className="absolute inset-0 bg-[#039F57] w-full rounded-t-3xl [clip-path:polygon(0_40%,100%_0,100%_100%,0_100%)]"></div>

        {/* CONTENT POSITIONED IN THE GREEN AREA */}
        <div className="absolute inset-0 flex items-center px-4 sm:px-8 lg:px-16">
          <div className="w-full max-w-6xl mx-auto mt-44 flex items-center justify-between">
            <h1 className="text-white text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight max-w-2xl">
              Want to ask any further questions or need urgent help?
            </h1>
            <button className="hidden sm:inline-flex items-center px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg text-base whitespace-nowrap ml-8">
              Contact Us now
            </button>
          </div>
        </div>

        {/* MOBILE BTN */}
        <div className="absolute bottom-4 left-4 right-4 sm:hidden">
          <button className="w-full inline-flex items-center justify-center px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg text-base">
            Contact Us now
          </button>
        </div>
      </div>

      {/* BOTTOM SECTION WITH DARK BG */}
      <div className="w-full bg-[#1a4a4f] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-16 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 w-full">
            {/* COLUMN 1 - Testify Brand & Contact */}
            <div className="lg:col-span-1 space-y-6">
              {/* LOGO */}
              <div className="flex items-center space-x-3 mb-4">
                <a
                  href="#home"
                  onClick={(e) => handleScroll(e, "#home")}
                  className="flex items-center space-x-2"
                >
                  <Image
                    src="/assets/testify.svg"
                    alt="Testify Logo"
                    width={16}
                    height={16}
                    className="w-16 h-16"
                    priority
                  />
                </a>
              </div>

              {/* TAGLINE */}
              <p className="text-gray-300 text-sm leading-relaxed">
                The Most reliable and efficient platform to access and verify
                transcript
              </p>
            </div>


            {/* COLUMN 2 - Navigation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Navigation</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* COLUMN 3 - Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Verify transcript
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Download transcript
                  </a>
                </li>
              </ul>
            </div>

            {/* COLUMN 4 - Support */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Support</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Live Chat
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Record Upload
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* CONTACT INFO */}
          <div className="flex flex-col md:flex-row justify-between md:items-center mt-6 md:mt-0">
            <div className="flex items-start space-x-3">
              <svg
                className="w-4 h-4 mt-1 text-teal-400 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="text-gray-300">Ind. Layout, Enugu, Nigeria</span>
            </div>

            <div className="flex items-start space-x-3">
              <svg
                className="w-4 h-4 mt-1 text-teal-400 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
              </svg>
              <span className="text-gray-300">+2348080808012</span>
            </div>

            <div className="flex items-start space-x-3">
              <svg
                className="w-4 h-4 mt-1 text-teal-400 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              <span className="text-gray-300">info@testify.com.ng</span>
            </div>

            {/* SOCIAL MEDIA ICONS */}
            <div className="flex justify-center space-x-4 mt-12 mb-8">
              <FaFacebook />
              <IoLogoLinkedin />
              <BsTwitterX />
            </div>
          </div>

          {/* FOOTER */}
          <div className="border-t border-white/20 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
              <p>
                &copy;2025 Testify transcript Management. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Security
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Terms
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
