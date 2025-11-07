"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { RiDashboardLine, RiFileList3Line } from "react-icons/ri";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdSettings, MdLogout } from "react-icons/md";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineMenuAlt2,
} from "react-icons/hi";
import Image from "next/image";

const StudentSidebar = ({ onCollapse, isMobileOpen, onMobileClose }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef(null);

  // HANDLE CLICKS OUTSIDE SIDEBAR TO CLOSE ON MOBILE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        if (typeof onMobileClose === "function") onMobileClose(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen, onMobileClose]);

  // NOTIFY PARENT OF COLLAPSE STATE CHANGES (ONLY ON DESKTOP)
  useEffect(() => {
    if (!isMobileOpen && typeof onCollapse === "function") {
      onCollapse(isCollapsed);
    }
  }, [isCollapsed, onCollapse, isMobileOpen]);

  // HANDLE CLICKS ON NAVIGATION ITEMS AND CLOSE MOBILE SIDEBAR
  const handleItemClick = () => {
    if (isMobileOpen && typeof onMobileClose === "function") {
      onMobileClose(false);
    }
  };

  const { logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    if (isMobileOpen && typeof onMobileClose === "function") {
      onMobileClose(false);
    }
  };

  // Small sub-component to render the logged-in user's basic info
  const UserProfileSummary = () => {
    const { user } = useAuth();

    if (!user) {
      return (
        <div className="px-4 pb-4">
          <div className="rounded-md bg-white p-3 shadow-sm">
            <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-3 w-36 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      );
    }

    return (
      <div className="px-4 pb-4">
        <div className="rounded-md bg-white p-3 shadow-sm">
          <div className="text-sm font-semibold text-gray-800 truncate">{user.name}</div>
          <div className="text-xs text-gray-500 truncate">{user.matricNumber}</div>
          <div className="mt-2 text-xs text-gray-600 truncate">{user.email}</div>
        </div>
      </div>
    );
  };

  const sidebarItems = [
    {
      title: "Dashboard",
      path: "/student/dashboard",
      icon: <RiDashboardLine className="text-xl" />,
    },
    {
      title: "My Transcript",
      path: "/student/my-transcript",
      icon: <RiFileList3Line className="text-xl" />,
    },
    {
      title: "Notifications",
      path: "/student/notifications",
      icon: <IoNotificationsOutline className="text-xl" />,
    },
    {
      title: "Settings",
      path: "/student/settings",
      icon: <MdSettings className="text-xl" />,
    },
  ];

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";
  const translateClass = isMobileOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <>
      <button
        onClick={() => onMobileClose(true)}
        className="fixed left-4 top-4 z-50 block rounded-lg bg-tms-lightGreen p-2 text-white md:hidden"
      >
        <HiOutlineMenuAlt2 className="text-2xl" />
      </button>

      <aside
        ref={sidebarRef}
        className={`fixed left-0 top-0 z-40 h-screen transform bg-[#EEF8F3] transition-all duration-300 ${sidebarWidth} ${translateClass} md:relative md:translate-x-0`}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col">
            <div className="flex items-center justify-between p-4">
              {!isCollapsed && (
                <div className="flex items-center justify-center mx-auto">
                  <Image
                    src="/universityTranscript/testifyIconLogin.svg"
                    alt="Federal Ministry of Education Logo"
                    width={64}
                    height={64}
                    className="object-contain h-16 w-16"
                  />
                </div>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden text-gray-500 hover:text-tms-lightGreen md:block"
              >
                {isCollapsed ? (
                  <HiOutlineChevronRight className="text-xl" />
                ) : (
                  <HiOutlineChevronLeft className="text-xl" />
                )}
              </button>
            </div>
            {!isCollapsed && <UserProfileSummary />}
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={handleItemClick}
                  className={`flex items-center rounded-lg mx-4 ${
                    isCollapsed ? "justify-center p-3" : "px-4 py-2"
                  } text-sm font-medium ${
                    pathname === item.path
                      ? "bg-tms-lightGreen text-white"
                      : "text-gray-700 hover:bg-tms-lightGreen hover:text-white"
                  }`}
                >
                  <div className={isCollapsed ? "" : "mr-3"}>
                    {item.icon}
                  </div>
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4">
            <button
              onClick={handleLogout}
              className={`flex w-full items-center justify-center rounded-lg bg-tms-lightGreen ${
                isCollapsed ? "p-3" : "px-4 py-2"
              } text-white hover:opacity-90`}
            >
              <MdLogout className="text-xl" />
              {!isCollapsed && <span className="ml-2">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default StudentSidebar;
