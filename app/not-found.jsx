"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg text-center">
     
        <div className="flex justify-center mb-8">
          <Image 
            src="/universityTranscript/testifyIconLogin.svg" 
            alt="Federal Ministry of Education Logo" 
            width={120}
            height={120}
            className="object-contain h-30 w-30"
          />
        </div>

        
        <div className="mb-8">
          <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Page Not Found
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Sorry, the page you are looking for could not be found. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

 
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link 
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white transition-colors duration-200 border border-tms-lightGreen rounded-lg bg-tms-lightGreen hover:bg-white hover:text-tms-lightGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:w-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-tms-lightGreen transition-colors duration-200 bg-white border border-tms-lightGreen rounded-lg hover:bg-tms-lightGreen hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:w-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
        </div>

        
        <div className="pt-8 mt-12 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Transcript Management System &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}