export default function TestimonialSection() {
  return (
    <section className="py-16 md:py-24 bg-tms-bg-main">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* TESTIMONIAL CARD */}
          <div className="relative">
            <div className="bg-linear-to-br from-tms-yellow to-orange-400 rounded-2xl p-8 lg:p-12 relative overflow-hidden">
              {/* BG DECORATION */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              
              <div className="relative z-10">
                {/* PROFILE IMAGE PLACEHOLDER */}
                <div className="w-20 h-20 bg-gray-800 rounded-xl mb-6 flex items-center justify-center">
                  <div className="text-white text-2xl">👩</div>
                </div>
                
                {/* TESTIMONIAL CONTENT */}
                <div className="bg-white rounded-xl p-6 mb-6">
                  <h4 className="font-bold text-tms-text text-lg mb-3">"Very Fast"</h4>
                  <p className="text-tms-gray-20 leading-relaxed mb-4">
                    I printed my testimonial in minutes, and every school I applied to verified it instantly.
                  </p>
                  
                  {/* RATING */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-tms-yellow fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-tms-text">Chiamaka, Owo High School, Owo</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button className="w-8 h-8 bg-tms-lightGreen rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div>
            <p className="text-tms-lightGreen font-semibold text-sm uppercase tracking-wide mb-4">
              WHAT PEOPLE SAY
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-tms-text leading-tight mb-6">
              Trusted Across Schools, Ministries, and Verification Agencies
            </h2>
            <p className="text-tms-gray-20 text-lg leading-relaxed mb-8">
              SafeTMS powers secure testimonial management for education institutions, alumni, and official verifiers
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="bg-tms-lightGreen text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all">
                Verify Testimonial
              </button>
              <button className="border-2 border-tms-lightGreen text-tms-lightGreen px-8 py-3 rounded-lg font-semibold hover:bg-tms-lightGreen hover:text-white transition-all">
                Browse Features
              </button>
            </div>

            {/* PARTNER LOGOS */}
            <div className="flex items-center space-x-8 opacity-60">
              <div className="text-tms-text font-bold text-lg">OMEGA MILLION</div>
              <div className="text-tms-text font-bold text-lg">Harvest</div>
              <div className="text-tms-text font-bold text-lg">EdgeKart</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}