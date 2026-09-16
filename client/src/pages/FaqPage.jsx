import React, { useState } from "react";
import LayoutWithHeaderOffset from "../components/LayoutWithHeaderOffset";

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "How do I book a site visit?",
      a: "Select a property, choose a convenient time slot on the property details page and click ‘Request Site Visit’. No token deposit is required.",
    },
    {
      q: "Can I buy and rent the same property?",
      a: "Yes. Choose the appropriate purpose (Buy or Rent) in the search bar. Each listing shows the applicable pricing and property details.",
    },
    {
      q: "What documents are needed for booking?",
      a: "Only a valid email address is required to request a site visit. For purchase or rental agreements, our agents will guide you through the required paperwork.",
    },
    {
      q: "How can I cancel a site-visit request?",
      a: "Visit the ‘My Bookings’ page and click the cancel button on the relevant booking, if the booking status allows cancellation.",
    },
    {
      q: "Is there any payment required before a site visit?",
      a: "No. Site visits are completely free. There is no token deposit or payment required before visiting a property.",
    },
    {
      q: "How do I create an account / log in?",
      a: "Click the Login button in the header and sign in with your Clerk account. Once logged in, you can view and manage your bookings.",
    },
    {
      q: "What if I have a question that is not listed here?",
      a: "Use the ‘Contact Us’ page or the feedback form to get in touch with our support team.",
    },
  ];

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <LayoutWithHeaderOffset>
      <section className="min-h-screen bg-gradient-to-r from-[#fffbee] to-white py-12">
        <div className="max-padd-container">
          <h1 className="h2 mb-8 text-center text-gray-900">
            Frequently Asked Questions
          </h1>

          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((item, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between px-4 py-4 text-left transition-colors hover:bg-gray-50"
                  aria-expanded={openIndex === idx}
                >
                  <span className="font-medium text-gray-800">
                    {item.q}
                  </span>

                  <span className="ml-4 text-lg text-gray-600">
                    {openIndex === idx ? "−" : "+"}
                  </span>
                </button>

                {openIndex === idx && (
                  <div className="border-t border-gray-100 bg-white px-4 py-4 leading-6 text-gray-600">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </LayoutWithHeaderOffset>
  );
};

export default FaqPage;