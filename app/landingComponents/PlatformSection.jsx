export default function PlatformSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* HEADER */}
        <div className="text-center mb-16">
          <p className="text-tms-lightGreen font-semibold text-sm uppercase tracking-wide mb-4">
            REQUEST AND VERIFY
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-tms-text leading-tight mb-6">
            A Robust, Secure, and Verified Testimonial Platform
          </h2>
          <p className="text-tms-gray-20 text-lg leading-relaxed max-w-4xl mx-auto">
            a centralized, secure platform for issuance, verification, and management of secondary school testimonials for schools, students, and verifiers
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* SECURE AND VERIFIED TESTIMONIALS */}
          <div className="bg-white border-2 border-tms-gray-50 rounded-2xl p-8 hover:border-tms-lightGreen transition-all duration-300 hover:shadow-lg">
            <div className="w-16 h-16 bg-tms-lightGreen/10 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-tms-lightGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-tms-text mb-4">Secure and Verified Testimonials</h3>
            <p className="text-tms-gray-20 leading-relaxed">
              Ensure the authenticity of testimonials with blockchain, reducing fraud and saving time.
            </p>
          </div>

          {/* USER-SPECIFIC ACCESS */}
          <div className="bg-white border-2 border-tms-gray-50 rounded-2xl p-8 hover:border-tms-lightGreen transition-all duration-300 hover:shadow-lg">
            <div className="w-16 h-16 bg-tms-yellow/10 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-tms-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-tms-text mb-4">User - Specific Access</h3>
            <p className="text-tms-gray-20 leading-relaxed">
              Tailored access for ministries, administrators, ex-students, and verifiers.
            </p>
          </div>

          {/* EFFICIENT VERIFICATION */}
          <div className="bg-white border-2 border-tms-gray-50 rounded-2xl p-8 hover:border-tms-lightGreen transition-all duration-300 hover:shadow-lg">
            <div className="w-16 h-16 bg-tms-darkGreen/10 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-tms-darkGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-tms-text mb-4">Efficient Verification</h3>
            <p className="text-tms-gray-20 leading-relaxed">
              Quickly verify testimonials with a simple online tool, reducing fraud and saving time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}