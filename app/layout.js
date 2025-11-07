'use client';

import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext';

// FIGMA SPECIFIED FONT
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={plusJakarta.className}>
      <body className="bg-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}