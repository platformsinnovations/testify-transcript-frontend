"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth, ROLES } from "@/contexts/AuthContext";
import {
  RiDashboardLine,
  RiUserLine,
  RiFileList3Line,
  RiFileTransferLine,
  RiLockPasswordLine,
} from "react-icons/ri";
import { LuSchool } from "react-icons/lu";
import { MdOutlineAnalytics, MdSettings, MdLogout, MdRefresh } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import Image from "next/image";

const AdminSidebar = ({ onCollapse, isMobileOpen, onMobileClose }) => {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const sidebarRef = useRef(null);
  const [logoError, setLogoError] = useState(false);

  // GET URL FOR SCHOOL LOGO OR DEFAULT
  const getLogoUrl = () => {
    console.log('Current user data:', user);
    console.log('School data:', user?.school);
    
    if (!user?.school?.logoUrl || logoError) {
      console.log('Using default logo - no school logo URL or error occurred');
      return '/universityTranscript/testifyIconLogin.svg';
    }

    try {
      // GOOGLE DRIVE URL HANDLING
      if (user.school.logoUrl.includes('drive.google.com')) {
        const fileId = user.school.logoUrl.match(/\/file\/d\/([^/]+)/)?.[1];
        if (fileId) {
          const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
          console.log('Converted Google Drive URL:', directUrl);
          return directUrl;
        }
      }

      console.log('Using school logo URL:', user.school.logoUrl);
      return user.school.logoUrl;
    } catch (error) {
      console.error('Error processing logo URL:', error);
      return '/universityTranscript/testifyIconLogin.svg';
    }
  };

  // EFFECT TO RESET LOGO ERROR STATE WHEN USER/SCHOOL CHANGES
  useEffect(() => {
    setLogoError(false);
  }, [user?.school?.logoUrl]);

  useEffect(() => {
    if (typeof onCollapse === "function") onCollapse(isCollapsed);
  }, [isCollapsed, onCollapse]);

  // CLOSE MOBILE SIDEBAR WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        if (typeof onMobileClose === "function") onMobileClose(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen, onMobileClose]);

  const handleItemClick = () => {
    if (isMobileOpen && typeof onMobileClose === "function") onMobileClose(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  // GET BRAND COLOR FROM USER'S SCHOOL OR USE DEFAULT
  const getBrandColor = () => {
    return user?.school?.brandColor || '#04BF68'; // DEFAULT GREEN
  };

  const brandColor = getBrandColor();

  const sidebarItems = [
    { title: "Dashboard", path: "/admin/dashboard", icon: <RiDashboardLine className="text-xl" /> },
    ...(user?.role === ROLES.SUPER_ADMIN ? [
      { title: "Schools", path: "/admin/schools", icon: <LuSchool className="text-xl" /> }
    ] : []),
    { title: "Student Records", path: "/admin/student-records", icon: <RiUserLine className="text-xl" /> },
    // { title: "Transcript Requests", path: "/admin/request-transcript", icon: <RiFileList3Line className="text-xl" /> },
    { title: "Transcript Upload", path: "/admin/transcript-upload", icon: <RiFileTransferLine className="text-xl" /> },
    { title: "Analytics", path: "/admin/analytics", icon: <MdOutlineAnalytics className="text-xl" /> },
    { title: "User Management", path: "/admin/user-management", icon: <BsPeople className="text-xl" /> },
    { title: "Settings", path: "/admin/settings", icon: <MdSettings className="text-xl" /> },
  ];

  return (
    <aside ref={sidebarRef} className="h-full bg-white overflow-y-auto">
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="flex items-center justify-between px-4 py-1">
            {!isCollapsed && (
              <div className="flex items-center justify-center mx-auto">
                <div className="relative w-24 h-24"> 
                  <Image
                    key={user?.school?.logoUrl} // Force reload when URL changes
                    src={getLogoUrl()}
                    alt={user?.school?.name || 'Logo'}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      console.warn('Failed to load school logo:', e);
                      console.warn('School:', user?.school?.name);
                      console.warn('Logo URL:', user?.school?.logoUrl);
                      setLogoError(true);
                    }}
                    onLoad={(e) => {
                      console.log('Logo loaded successfully:', e.target.src);
                      setLogoError(false);
                    }}
                    priority={true}
                    sizes="96px"
                  />
                </div>
              </div>
            )}

            <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden md:block text-gray-500 hover:text-[--brand-color]" style={{ '--brand-color': brandColor }}>
              {isCollapsed ? <HiOutlineChevronRight className="text-xl" /> : <HiOutlineChevronLeft className="text-xl" />}
            </button>
          </div>

          <nav className="space-y-1 p-4">
            {sidebarItems.map((item) => {
              if (item.title === "User Management") {
                return (
                  <div key={item.path}>
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === "user-management" ? null : "user-management")}
                      className={`flex items-center w-full rounded-lg ${isCollapsed ? "justify-center px-4 py-3" : "px-4 py-3"} text-sm font-medium text-gray-700 hover:text-white`}
                      style={{ '--hover-bg': brandColor }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = brandColor}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div className={isCollapsed ? "" : "mr-3"}>{item.icon}</div>
                      {!isCollapsed && <span>{item.title}</span>}
                    </button>

                    {openDropdown === "user-management" && (
                      <div className={`${isCollapsed ? 'items-center ml-0' : 'ml-8'} flex flex-col gap-1`}>
                        <Link href="/admin/user-management/change-password" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                          <RiLockPasswordLine className="text-xl" />
                          {!isCollapsed && <span>Change Password</span>}
                        </Link>
                        <Link href="/admin/user-management/reset-password" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                          <MdRefresh className="text-xl" />
                          {!isCollapsed && <span>Reset Password</span>}
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => {
                    handleItemClick();
                    setOpenDropdown(null);
                  }}
                  className={`flex items-center rounded-lg ${isCollapsed ? "justify-center px-4 py-3" : "px-4 py-3"} text-sm font-medium text-gray-700`}
                  style={{
                    backgroundColor: pathname === item.path ? brandColor : 'transparent',
                    color: pathname === item.path ? 'white' : '#374151'
                  }}
                  onMouseEnter={(e) => {
                    if (pathname !== item.path) {
                      e.currentTarget.style.backgroundColor = brandColor;
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== item.path) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#374151';
                    }
                  }}
                >
                  <div className={isCollapsed ? "" : "mr-3"}>{item.icon}</div>
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4">
          <button 
            onClick={handleLogout} 
            className={`flex w-full items-center justify-center rounded-lg text-white ${isCollapsed ? "px-4 py-3" : "px-4 py-2"} hover:opacity-90`}
            style={{ backgroundColor: brandColor }}
          >
            <MdLogout className="text-xl" />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
