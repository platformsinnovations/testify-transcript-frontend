'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiSearch, FiBell, FiUser } from 'react-icons/fi';
import { HiChevronDown } from 'react-icons/hi';
import { useAuth, ROLES } from "@/contexts/AuthContext";

const AdminNavbar = ({ onMobileToggle, isSidebarOpen, isMobile }) => {
  const { logout, user } = useAuth();
  const brandColor = user?.school?.brandColor || '#04BF68';
  const [isSearchHover, setIsSearchHover] = useState(false);
  const [isNotifHover, setIsNotifHover] = useState(false);
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
    <nav className="sticky top-0 z-30 w-full bg-[#EEF8F3]">
      <div className="p-6">
        <div className="flex h-16 items-center justify-between bg-white mt-2 px-4 rounded-2xl">
          {/* LEFT SIDE - Mobile hamburger + Current Page */}
          <div className="flex items-center">
            {isMobile && (
              <button
                onClick={() => onMobileToggle && onMobileToggle()}
                className="md:hidden mr-3 rounded-lg p-2 text-white"
                style={{ backgroundColor: user?.school?.brandColor || '#04BF68' }}
                aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                </svg>
              </button>
            )}

            {/* CURRENT PAGE TITLE */}
            <h1 className="text-sm md:text-xl font-semibold text-gray-800">
              {getCurrentPageName()}
            </h1>
          </div>

          {/* RIGHT SIDE - Icons and User Menu */}
          <div className="flex items-center space-x-4">
            {/* SEARCH */}
            <button
              className="text-gray-500"
              onMouseEnter={() => setIsSearchHover(true)}
              onMouseLeave={() => setIsSearchHover(false)}
              onFocus={() => setIsSearchHover(true)}
              onBlur={() => setIsSearchHover(false)}
              style={{ color: isSearchHover ? brandColor : undefined }}
            >
              <FiSearch className="h-5 w-5" />
            </button>

            {/* NOTIFICATIONS */}
            <button
              className="relative text-gray-500"
              onMouseEnter={() => setIsNotifHover(true)}
              onMouseLeave={() => setIsNotifHover(false)}
              onFocus={() => setIsNotifHover(true)}
              onBlur={() => setIsNotifHover(false)}
              style={{ color: isNotifHover ? brandColor : undefined }}
            >
              <FiBell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                3
              </span>
            </button>

            {/* USER MENU */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 rounded-lg px-2 py-1 hover:bg-gray-100"
              >
                <FiUser className="h-5 w-5 text-gray-500" />
                <span className="hidden text-sm text-gray-700 md:block capitalize">
                  {user?.role ? user.role.replace('-', ' ') : 'User'}
                </span>
                <HiChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${
                  isUserMenuOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {/* DROPDOWN MENU */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-100 bg-white py-1 shadow-lg">
                  <Link
                    href="/admin/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/admin/settings"
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

export default AdminNavbar;