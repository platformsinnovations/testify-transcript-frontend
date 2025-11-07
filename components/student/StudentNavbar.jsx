'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiSearch, FiBell, FiUser } from 'react-icons/fi';
import { HiChevronDown } from 'react-icons/hi';
import { RiFileList3Line } from 'react-icons/ri';
import { useAuth } from '@/contexts/AuthContext';

const StudentNavbar = () => {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // GET CURRENT PAGE NAME FROM PATHNAME
  const getCurrentPageName = () => {
    const path = pathname.split('/').pop();
    return path.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <nav className="sticky top-0 z-30 w-full bg-white">
      <div className="py-6">
        <div className="flex h-16 items-center justify-between border-b-2 bg-white px-8 mt-2">
          {/* LEFT SIDE - Current Page */}
          <h1 className="text-xl font-semibold text-gray-800">
            {getCurrentPageName()}
          </h1>

          {/* RIGHT SIDE - Icons and User Menu */}
          <div className="flex items-center space-x-4">
            {/* VIEW TRANSCRIPT BUTTON */}
            <Link
              href="/student/my-transcript"
              className="hidden items-center space-x-2 rounded-lg bg-tms-landing-3 px-4 py-2 text-sm font-medium text-tms-lightGreen hover:opacity-90 md:flex"
            >
              <RiFileList3Line className="h-5 w-5" />
              <span>View Transcript</span>
            </Link>

            {/* SEARCH */}
            <button className="text-gray-500 hover:text-tms-lightGreen">
              <FiSearch className="h-5 w-5" />
            </button>

            {/* NOTIFICATIONS */}
            <button className="relative text-gray-500 hover:text-tms-lightGreen">
              <FiBell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                2
              </span>
            </button>

            {/* USER MENU */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 rounded-lg px-2 py-1 hover:bg-gray-100"
              >
                <FiUser className="h-5 w-5 text-gray-500" />
                <span className="hidden text-sm text-gray-700 md:block">
                  {user?.role || 'Student'}
                </span>
                <HiChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${
                  isUserMenuOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {/* DROPDOWN MENU */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-100 bg-white py-1 shadow-lg">
                  <Link
                    href="/student/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/student/my-transcript"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 md:hidden"
                  >
                    View Transcript
                  </Link>
                  <Link
                    href="/student/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;