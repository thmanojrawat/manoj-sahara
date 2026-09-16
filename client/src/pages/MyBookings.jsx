import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/data";
import toast from "react-hot-toast";

/**
 * MyBookings – displays the logged‑in user's site‑visit bookings.
 * Fetches from /api/crm/bookings?userId=... endpoint (handled by backend).
 * Shows property thumbnail, title, location, scheduled time, and status badge.
 */
const MyBookings = () => {
  const { user, axios, getToken, navigate } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const token = await getToken();
      const { data } = await axios.get(`/api/crm/bookings?userId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setBookings(data.data || []);
      } else {
        setError(data.message || "Failed to load bookings");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const statusBadge = (status) => {
    const map = {
      pending: { label: "Pending", className: "bg-amber-100 text-amber-800" },
      confirmed: { label: "Confirmed", className: "bg-green-100 text-green-800" },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800" },
      completed: { label: "Completed", className: "bg-blue-100 text-blue-800" },
    }[status] || { label: status, className: "bg-gray-100 text-gray-800" };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${map.className}`}> {map.label} </span>
    );
  };

  if (!user) {
    return (
      <div className="bg-gradient-to-r from-[#fffbee] to-white py-28 min-h-screen text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Please sign in to view your bookings</h2>
        <button
          onClick={() => navigate("/login")}
          className="btn-dark px-6 py-2 rounded-lg"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-[#fffbee] to-white py-28 min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-gray-300 rounded mb-4" />
          <div className="h-4 w-64 bg-gray-300 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-[#fffbee] to-white py-28 min-h-screen text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Unable to load bookings</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button onClick={fetchBookings} className="btn-dark px-5 py-2 rounded-lg">Retry</button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-gradient-to-r from-[#fffbee] to-white py-28 min-h-screen text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">No bookings yet</h3>
        <p className="text-gray-600 mb-6">Explore listings and request a free site visit.</p>
        <button onClick={() => navigate("/listing")} className="btn-dark px-6 py-2 rounded-lg">
          Browse Listings
        </button>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-r from-[#fffbee] to-white py-12 min-h-screen">
      <div className="max-padd-container">
        <h2 className="h3 text-gray-900 mb-6">My Site‑Visit Bookings</h2>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((b) => (
            <div key={b._id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={b.property?.publicImages?.[0] || assets.placeholderImg}
                  alt={b.property?.title || "Property"}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2">{statusBadge(b.status)}</div>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-semibold text-lg text-gray-800 line-clamp-1">
                  {b.property?.title || "Property"}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {b.property?.locality}, {b.property?.city}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Visit:</strong> {b.preferredVisitTime || "Not set"}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Booking #:</strong> {b.bookingNumber || b._id}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyBookings;