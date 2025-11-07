import React from 'react'

const LanddingSection2 = () => {
  return (
    <section className="w-full py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-[#004225]">
              We make transcript management simple
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="text-2xl font-bold text-[#004225]">01.</span>
                <div>
                  <h3 className="font-semibold mb-2 text-lg">Digitized Transcript Records</h3>
                  <p className="text-gray-600">
                    Universities upload records and generate official transcripts seamlessly - no manual processing
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-2xl font-bold text-[#004225]">02.</span>
                <div>
                  <h3 className="font-semibold mb-2 text-lg">Instant Verification System</h3>
                  <p className="text-gray-600">
                    Real-time instant verification for authenticity, keeping employers and verification bodies confident
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="relative">
              <div className="bg-[#E6F5ED] rounded-lg p-8">
                <h3 className="text-2xl font-bold text-[#004225] mb-6">
                  What Universities & Students Say
                </h3>
                <blockquote className="text-gray-700 mb-4">
                  "Testify has completely transformed how we process transcripts. Tasks that used to take weeks are now done in days, with zero fraud cases."
                </blockquote>
                <div className="text-[#004225]">
                  <p className="font-semibold">Registrar, Federal University</p>
                  <p>of Technology Akure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LanddingSection2