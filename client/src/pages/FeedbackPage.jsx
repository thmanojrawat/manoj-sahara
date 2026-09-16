import React, { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import LayoutWithHeaderOffset from "../components/LayoutWithHeaderOffset";

const FeedbackPage = () => {
  const { user } = useUser();

  const [form, setForm] = useState({
    name: user?.fullName || "",
    email: user?.emailAddresses?.[0]?.emailAddress || "",
    rating: "5",
    category: "General",
    message: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: null,
    error: null,
  });

  const categories = [
    "General",
    "Feature Request",
    "Bug Report",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    if (!form.name.trim()) {
      return "Name is required";
    }

    if (!form.email.trim()) {
      return "Email is required";
    }

    if (!form.message.trim()) {
      return "Message is required";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setStatus({
        loading: false,
        success: null,
        error: validationError,
      });

      return;
    }

    setStatus({
      loading: true,
      success: null,
      error: null,
    });

    try {
      const backend =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

      const apiBase = backend.endsWith("/api")
        ? backend
        : `${backend}/api`;

      await axios.post(`${apiBase}/feedback`, form);

      setStatus({
        loading: false,
        success: "Feedback submitted successfully!",
        error: null,
      });

      setForm({
        name: user?.fullName || "",
        email: user?.emailAddresses?.[0]?.emailAddress || "",
        rating: "5",
        category: "General",
        message: "",
      });
    } catch (error) {
      setStatus({
        loading: false,
        success: null,
        error:
          error.response?.data?.message ||
          "Unable to submit feedback. Please try again.",
      });
    }
  };

  return (
    <LayoutWithHeaderOffset>
      <section className="min-h-screen bg-gradient-to-r from-[#fffbee] to-white py-12">
        <div className="max-padd-container">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="h2 mb-3 text-gray-900">
                We value your feedback
              </h1>

              <p className="text-gray-600">
                Help us improve your SAHARA real-estate experience.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-xl bg-white p-6 shadow-md md:p-8"
            >
              {status.error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {status.error}
                </div>
              )}

              {status.success && (
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
                  {status.success}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-3 outline-none transition focus:border-[#fdc700] focus:ring-1 focus:ring-[#fdc700]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-3 outline-none transition focus:border-[#fdc700] focus:ring-1 focus:ring-[#fdc700]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rating
                  </label>

                  <select
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 outline-none transition focus:border-[#fdc700] focus:ring-1 focus:ring-[#fdc700]"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>
                        {value} ★
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 outline-none transition focus:border-[#fdc700] focus:ring-1 focus:ring-[#fdc700]"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>

                <textarea
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us what you think..."
                  className="mt-1 block w-full resize-none rounded-md border border-gray-300 p-3 outline-none transition focus:border-[#fdc700] focus:ring-1 focus:ring-[#fdc700]"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={status.loading}
                  className="rounded-md bg-[#fdc700] px-6 py-3 font-semibold text-gray-900 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status.loading ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </LayoutWithHeaderOffset>
  );
};

export default FeedbackPage;