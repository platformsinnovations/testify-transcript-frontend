"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { FaLock } from "react-icons/fa6";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

const Navbar = ({
  onSchoolLogin,
  logoText = "Safe TMS",
  logoIcon: LogoIcon = FaLock,
  navItems = [
    { label: "Home", href: "#home" },
    {
      label: "Products",
      href: "#",
      dropdownItems: [
        { 
          label: "Testimonial for Basic Education",
          description: "Verified Testimonials for first-leaving schools",
          href: "https://testify.ng/",
          icon: "/universityTranscript/capOnly.svg",
          bgColor: "#10B981"
        },
        { 
          label: "Transcript for Universities",
          description: "Easy and fast Transcript for graduates",
          href: "https://testify.ng/",
          icon: "/universityTranscript/certificateSolid.svg",
          bgColor: "#3B82F6"
        },
        { 
          label: "E-Identity Verification",
          description: "Education identity verification",
          href: "https://testify.ng/",
          icon: "/universityTranscript/userIcon.svg",
          bgColor: "#F59E0B"
        },
      ],
    },
    { label: "Contact Us", href: "#contact-us" },
    { label: "FAQ", href: "#faq" },
  ],
  className = "",
}) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleMenuItemClick = () => {
    closeMobileMenu();
  };

  const handleSchoolLogin = async (e) => {
    e.preventDefault();
    try {
      if (onSchoolLogin) {
        await onSchoolLogin();
      }
      router.push('/auth/sign-in');
    } catch (err) {
      console.error('School login failed', err);
    } finally {
      closeMobileMenu();
    }
  };

  // SMOOTH SCROLLING FUNCTION
  const handleScroll = (e, href) => {
    e.preventDefault();
    closeMobileMenu();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest("nav")) {
        closeMobileMenu();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between py-4 md:py-6 bg-tms-darkGreen backdrop-blur-md z-50 ${className}`}
    >
      <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between px-4 sm:px-6 lg:px-16">
        {/* LOGO - clickable to scroll to top */}
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

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => item.dropdownItems && setActiveDropdown(index)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="relative">
                <a
                  href={item.href}
                  onClick={(e) => {
                    if (!item.dropdownItems) {
                      handleScroll(e, item.href);
                    } else {
                      e.preventDefault();
                    }
                  }}
                  className="text-white text-base font-medium leading-none tracking-normal hover:border-b-2 transition-colors inline-flex items-center"
                >
                  {item.label}
                  {item.dropdownItems && (
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </a>
                {/* GAP FILLER TO PREVENT DROPDOWN FROM CLOSING */}
                <div className="absolute h-2 w-full"/>
              </div>
              {item.dropdownItems && activeDropdown === index && (
                <div className="absolute left-0 mt-0 w-[340px] bg-white rounded-tr-xl rounded-bl-xl rounded-br-xl shadow-2xl py-3 z-10 border border-gray-100">
                  {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                    <a
                      key={dropdownIndex}
                      href={dropdownItem.href}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: dropdownItem.bgColor }}
                      >
                        <Image
                          src={dropdownItem.icon}
                          alt={dropdownItem.label}
                          width={20}
                          height={20}
                          className="w-8 h-8"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">
                          {dropdownItem.label}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {dropdownItem.description}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            onClick={handleSchoolLogin}
            loadingText="Loading..."
            className="hidden md:inline-flex"
          >
            {/* SCHOOL LOGIN */}
            Login
          </Button>


          {/* MOBILE HAMBURGER MENU */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-tms-darkGreen border-t border-white/10 md:hidden">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <div key={index}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      if (!item.dropdownItems) {
                        handleScroll(e, item.href);
                        handleMenuItemClick();
                      } else {
                        e.preventDefault();
                        setActiveDropdown(activeDropdown === index ? null : index);
                      }
                    }}
                    className="text-white hover:text-yellow-400 transition-colors py-2 flex items-center justify-between"
                  >
                    {item.label}
                    {item.dropdownItems && (
                      <svg
                        className={`w-4 h-4 transform transition-transform ${
                          activeDropdown === index ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </a>
                  {item.dropdownItems && activeDropdown === index && (
                    <div className="pl-4 mt-2 space-y-2">
                      {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                        <a
                          key={dropdownIndex}
                          href={dropdownItem.href}
                          className="block text-white hover:text-yellow-400 transition-colors py-2"
                          onClick={handleMenuItemClick}
                        >
                          {dropdownItem.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Button
                onClick={handleSchoolLogin}
                loadingText="Logging in..."
                className="w-full"
              >
                School Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
