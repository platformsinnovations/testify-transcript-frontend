'use client';

import { useState, useEffect } from 'react';
import StudentSidebar from '@/components/student/StudentSidebar';
import StudentNavbar from '@/components/student/StudentNavbar';

export default function StudentLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (isMobileView) {
        // ALWAYS COLLAPSE ON MOBILE
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-white">
      {isMobile && (
        <button
          onClick={handleSidebarToggle}
          className="fixed top-4 left-4 z-50 rounded-lg bg-tms-lightGreen p-2 text-white"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      )}

      <div
        className={`fixed top-0 bottom-0 left-0 z-40 h-screen bg-white transition-all duration-300 
          ${isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : ''} 
          ${isMobile ? 'w-64' : (isSidebarCollapsed ? 'w-14' : 'w-64')} 
          ${isMobile ? 'block' : 'md:block'}`}
        style={{
          boxShadow: isMobile && isSidebarOpen ? '0 0 0 9999px rgba(0,0,0,0.3)' : undefined,
        }}
      >
        <StudentSidebar 
          onCollapse={setIsSidebarCollapsed}
          isMobileOpen={isSidebarOpen}
          onMobileClose={setIsSidebarOpen}
        />
      </div>

      <div className={`flex flex-col min-h-screen transition-all duration-300 
        ${!isMobile && (isSidebarCollapsed ? 'md:pl-14' : 'md:pl-64')}`}
      >
        <div className="sticky top-0 z-30 bg-[#EEF8F3]">
          <StudentNavbar />
        </div>
        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}