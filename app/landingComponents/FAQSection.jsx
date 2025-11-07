import Button from "@/components/ui/Button";
import { useState } from "react";

export default function FAQSection({ id }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleGetStarted = async (e) => {
    e.preventDefault();
    try {
      if (onGetStarted) {
        await onGetStarted();
      }
      router.push("/auth/sign-in");
    } catch (err) {
      console.error("School login failed", err);
    } finally {
      closeMobileMenu();
    }
  };

  const faqs = [
    {
      question: "How do I request for my transcript",
      answer:
        "You can request your transcript by logging into the student portal with your credentials and following the simple verification process.",
    },
    {
      question: "How do I request for my transcript",
      answer:
        "You can request your transcript by logging into the student portal with your credentials and following the simple verification process.",
    },
    {
      question: "What information should I include in my transcript request?",
      answer:
        "Include your full name, graduation year, student ID, and any specific requirements from the requesting institution.",
    },
    {
      question: "How long does it take to receive my transcript?",
      answer:
        "Most transcripts are processed within 24-48 hours after verification of your details and payment confirmation.",
    },
  ];

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id={id} className="py-16 md:pb-24 bg-gray-50">
      {/* CTA Banner */}
      <div className="flex flex-col justify-center items-center text-center bg-transparent md:rounded-2xl p-8 md:p-12 mb-16 relative md:mx-auto overflow-hidden">
        <div className="mb-6 md:mb-0">
          <h3 className="text-2xl md:text-3xl font-bold text-tms-darkGreen leading-tight">
            Start with Testify Today. <br /> Simplify Transcript <br />{" "}
            Management
          </h3>
        </div>
        <p className="text-gray-500 text-sm my-4">
          Join the growing network of universities using Testify to <br />{" "}
          manage, verify, and deliver trusted transcripts globally.
        </p>
        <div className="flex flex-row mt-2 gap-2 sm:gap-4">
          <Button
            onClick={handleGetStarted}
            loadingText="Loading..."
            className="hidden md:inline-flex"
          >
            Get Started
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20">
        {/* FAQ Section */}
        <div className="text-center mb-12">
          <p className="text-teal-600 font-semibold text-sm uppercase tracking-wide mb-4">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Frequently asked questions
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <div className="w-8 h-8 bg-teal-800 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200">
                  {expandedIndex === index ? (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  )}
                </div>
              </button>

              {/* ANSWER SECTION WITH SMOOTH ANIMATION */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  expandedIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <div className="px-6 pb-5 pt-2">
                  <p className="text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
