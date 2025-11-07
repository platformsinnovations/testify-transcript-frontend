'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout({ children }) {
  const { user } = useAuth();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  
  // GET BRAND COLOR FROM USER'S SCHOOL OR USE DEFAULT
  const getBrandColor = () => {
    return user?.school?.brandColor || '#04BF68'; // Default color
  };

  const brandColor = getBrandColor();


  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (!isMobileView) {
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

  // mobile state is passed to AdminNavbar so the hamburger can be rendered there

  return (
    <div className="min-h-screen bg-[#EEF8F3]">
      

      <div
        className={`fixed top-0 bottom-0 left-0 z-40 h-screen bg-white transition-all duration-300 
          ${isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : ''} 
          ${isMobile ? 'w-64' : (isSidebarCollapsed ? 'w-14' : 'w-64')} 
          ${isMobile ? 'block' : 'md:block'}`}
        style={{
          boxShadow: isSidebarOpen ? '0 0 0 9999px rgba(0,0,0,0.3)' : undefined,
        }}
      >
        <AdminSidebar 
          onCollapse={setIsSidebarCollapsed}
          isMobileOpen={isSidebarOpen}
          onMobileClose={setIsSidebarOpen}
        />
      </div>

      <div className={`flex flex-col min-h-screen transition-all duration-300 
        ${!isMobile && (isSidebarCollapsed ? 'md:pl-14' : 'md:pl-64')}`}
      >
        <div className="sticky top-0 z-30 bg-[#EEF8F3]">
          <AdminNavbar onMobileToggle={handleSidebarToggle} isSidebarOpen={isSidebarOpen} isMobile={isMobile} />
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