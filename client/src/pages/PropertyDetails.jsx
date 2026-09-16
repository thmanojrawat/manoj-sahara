import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation, Link } from "react-router-dom";
import { useLocation, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/data";
import toast from "react-hot-toast";
import PropertyImages from "../components/PropertyImages";
import { useClerk } from "@clerk/clerk-react";
import LayoutWithHeaderOffset from "../components/LayoutWithHeaderOffset";
import {
  Bed,
  Bath,
  Car,
  Ruler,
  MapPin,
  Phone,
  Mail,
  Share2,
  CheckCircle2,
  Building2,
  CalendarClock,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

/**
 * PropertyDetails – displays a single listing with a full gallery, key stats,
 * amenities, description and a sticky booking/contact card. Booking data is
 * sent to the backend using the authenticated Clerk userId — this logic is
 * unchanged from the original component, only the layout/visuals changed.
 */

// Best-effort icon match for amenity names coming from the backend.
// Falls back to a plain checkmark for anything not in this list, so new
// amenities added later never break the UI.
const AMENITY_ICON_KEYWORDS = [
  { keys: ["lift", "elevator"], icon: Building2 },
  { keys: ["pool", "swimming"], icon: CheckCircle2 },
  { keys: ["gym", "fitness"], icon: CheckCircle2 },
  { keys: ["security", "guard", "cctv"], icon: ShieldCheck },
  { keys: ["parking", "garage"], icon: Car },
  { keys: ["power", "backup", "generator"], icon: CheckCircle2 },
  { keys: ["water", "harvest"], icon: CheckCircle2 },
  { keys: ["intercom"], icon: Phone },
  { keys: ["garden", "park"], icon: CheckCircle2 },
  { keys: ["club", "clubhouse"], icon: Building2 },
];

function amenityIcon(name = "") {
  const lower = name.toLowerCase();
  const match = AMENITY_ICON_KEYWORDS.find((a) => a.keys.some((k) => lower.includes(k)));
  return match ? match.icon : CheckCircle2;
}

const PropertyDetails = () => {
  const { navigate, properties, axios, getToken, user } = useAppContext();
  const location = useLocation();
  const { openSignIn } = useClerk();
  const [property, setProperty] = useState(null);
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [bookingStatus, setBookingStatus] = useState(null); // success / error
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  // Extract slug or id from URL path
  const slugOrId = location.pathname.split("/").pop();

  useEffect(() => {
    // Find property matching slug or _id
    const match = properties.find(
      (p) => p.slug === slugOrId || p._id === slugOrId
    );
    if (match) setProperty(match);
    else {
      // fallback: fetch single property from API if not in context
      const fetchProperty = async () => {
        try {
          const { data } = await axios.get(`/api/crm/listings/public?slug=${slugOrId}`);
          if (data.success && data.data && data.data.length) setProperty(data.data[0]);
          else setProperty(null);
        } catch (err) {
          console.error("Error fetching property", err);
          setProperty(null);
        }
      };
      fetchProperty();
    }
  }, [slugOrId, properties, axios]);

  const today = new Date().toISOString().split("T")[0];

  const handleBookVisit = async () => {
    if (!user) return openSignIn();
    if (!preferredDate) {
      toast.error("Please select a preferred date.");
      return;
    }
    if (!preferredTime) {
      toast.error("Please select a preferred time slot.");
      return;
    }
    try {
      const token = await getToken();
      const payload = {
        propertyId: property._id,
        clientEmail: user.email_addresses?.[0]?.email_address || user.primaryEmailAddress?.email_address,
        userId: user.id,
        bookingType: "site-visit",
        preferredVisitDate: preferredDate,
        preferredVisitTime: preferredTime,
      };
      const { data } = await axios.post("/api/crm/bookings", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setBookingStatus("success");
        toast.success("Your site‑visit request has been submitted!");
      } else {
        throw new Error(data.message || "Booking failed");
      }
    } catch (err) {
      console.error(err);
      setBookingStatus("error");
      toast.error(err.message || "Failed to submit request");
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: property?.title, url: shareUrl });
      } catch {
        /* user cancelled share sheet — no-op */
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard");
    }
  };

  if (!property) {
    return (
      <LayoutWithHeaderOffset>
        <div className="bg-gradient-to-r from-[#fffbee] to-white py-28 min-h-screen text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Property not found</h2>
          <p className="text-gray-600 mb-6">The property you are looking for may have been removed or the URL is incorrect.</p>
          <button onClick={() => navigate("/listing")} className="btn-dark px-6 py-2 rounded-lg">
            Browse Listings
          </button>
        </div>
      </LayoutWithHeaderOffset>
    );
  }

  const price = property.price?.sale ?? property.price?.rent ?? "N/A";
  const priceLabel = property.price?.sale ? "Sale Price" : property.price?.rent ? "Monthly Rent" : "Price";

  // Time slot options (hard-coded for demo)
  const timeSlots = [
    "09:00 AM - 10:00 AM",
    "11:00 AM - 12:00 PM",
    "02:00 PM - 03:00 PM",
    "04:00 PM - 05:00 PM",
  ];

  // Key stats row — only renders fields that actually exist on this listing.
  const stats = [
    property.facilities?.bedrooms && { icon: Bed, label: "Bedrooms", value: property.facilities.bedrooms },
    property.facilities?.bathrooms && { icon: Bath, label: "Bathrooms", value: property.facilities.bathrooms },
    property.facilities?.garages && { icon: Car, label: "Parking", value: property.facilities.garages },
    property.area && { icon: Ruler, label: "Area", value: `${property.area} sqft` },
  ].filter(Boolean);

  // Amenities: expects property.amenities to be an array of strings from the
  // backend. If your schema doesn't have this yet, swap the line below for a
  // hardcoded array, e.g. const amenities = ["Lift", "Security", "Parking"]
  const amenities = property.amenities || [];
  const visibleAmenities = showAllAmenities ? amenities : amenities.slice(0, 6);

  return (
    <LayoutWithHeaderOffset>
      <section className="bg-gradient-to-r from-[#fffbee] to-white py-10 min-h-screen">
        <div className="max-padd-container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-5">
            <Link to="/" className="hover:text-amber-600">Home</Link>
            <ChevronRight size={14} />
            <Link to="/listing" className="hover:text-amber-600">Properties</Link>
            <ChevronRight size={14} />
            <span className="text-gray-800 font-medium truncate max-w-[200px]">{property.title}</span>
          </nav>

          {/* Title + address + actions */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{property.title}</h1>
              <p className="flex items-center gap-1.5 text-gray-600 mt-1.5">
                <MapPin size={16} className="text-amber-600 shrink-0" />
                {property.address}, {property.locality}, {property.city}
              </p>
            </div>
            <button
              onClick={handleShare}
              className="btn-outline flex items-center gap-2 px-4 py-2 rounded-lg self-start shrink-0"
            >
              <Share2 size={16} /> Share
            </button>
          </div>

          {/* Gallery + sticky sidebar */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-[62%] rounded-xl overflow-hidden ring-1 ring-slate-900/5">
              <PropertyImages images={property.images || []} />
            </div>

            {/* Sticky booking / contact card */}
            <div className="w-full lg:w-[38%] lg:sticky lg:top-24 space-y-5">
              <div className="bg-white rounded-xl ring-1 ring-slate-900/5 p-5">
                <p className="text-sm text-gray-500">{priceLabel}</p>
                <p className="text-3xl font-bold text-amber-600 mt-0.5">
                  {price !== "N/A" ? `₹${Number(price).toLocaleString("en-IN")}` : "Contact for price"}
                  {property.price?.rent && !property.price?.sale && (
                    <span className="text-base font-medium text-gray-500">/mo</span>
                  )}
                </p>

                {stats.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-slate-900/10">
                    {stats.map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-2.5">
                        <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                          <Icon size={18} />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 leading-tight">{value}</p>
                          <p className="text-xs text-gray-500 leading-tight">{label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Book Site Visit CTA */}
              <div className="border border-amber-200 bg-amber-50 p-5 rounded-xl">
                <h3 className="flex items-center gap-2 text-lg font-semibold mb-2 text-amber-800">
                  <CalendarClock size={20} /> Book a Site Visit (Free)
                </h3>
                <p className="text-sm text-amber-700 mb-3">
                  Pick a date and time and our agent will contact you to confirm the visit.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="date"
                    value={preferredDate}
                    min={today}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full p-2.5 border border-amber-300 rounded-lg text-sm bg-white outline-none"
                  />
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full p-2.5 border border-amber-300 rounded-lg text-sm bg-white outline-none"
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleBookVisit}
                  disabled={!preferredDate || !preferredTime}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Request Site Visit
                </button>
                {bookingStatus === "success" && (
                  <p className="mt-2 text-green-600 text-sm">Your request was submitted successfully.</p>
                )}
              </div>

              {/* Contact / Enquiry */}
<div className="flex gap-3">
  <a
    href={
      property.broker?.email
        ? `mailto:${property.broker.email}`
        : undefined
    }
    className="flex-1 flex items-center justify-center gap-2 bg-white border border-amber-300 text-amber-700 font-semibold px-4 py-3 rounded-xl hover:bg-amber-50 hover:border-amber-400 transition-colors text-sm"
  >
    <Mail size={16} />
    Contact Agent
  </a>

  <button
    onClick={() => toast("Enquiry flow not implemented in demo.")}
    className="flex-1 flex items-center justify-center gap-2 bg-amber-600 text-white font-semibold px-4 py-3 rounded-xl hover:bg-amber-700 transition-colors text-sm"
  >
    <Phone size={16} />
    Enquiry
  </button>
</div>
            </div>
          </div>

          {/* Below-the-fold detail sections */}
          <div className="flex flex-col lg:flex-row gap-8 mt-10">
            <div className="w-full lg:w-[62%] space-y-8">
              {/* Description */}
              {property.description && (
                <div className="bg-white rounded-xl ring-1 ring-slate-900/5 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Description : </h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
                </div>
              )}

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="bg-white rounded-xl ring-1 ring-slate-900/5 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {visibleAmenities.map((name) => {
                      const Icon = amenityIcon(name);
                      return (
                        <div key={name} className="flex items-center gap-2.5 text-sm text-gray-700">
                          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                            <Icon size={16} />
                          </span>
                          {name}
                        </div>
                      );
                    })}
                  </div>
                  {amenities.length > 6 && (
                    <button
                      onClick={() => setShowAllAmenities((v) => !v)}
                      className="mt-4 text-sm font-medium text-amber-600 hover:text-amber-700"
                    >
                      {showAllAmenities ? "Show less" : `View all amenities (${amenities.length})`}
                    </button>
                  )}
                </div>
              )}

              {/* Location */}
              <div className="bg-white rounded-xl ring-1 ring-slate-900/5 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Location</h2>
                <p className="flex items-center gap-1.5 text-gray-600 mb-4">
                  <MapPin size={16} className="text-amber-600 shrink-0" />
                  {property.address}, {property.locality}, {property.city}
                </p>
                <div className="h-56 rounded-lg bg-slate-100 flex items-center justify-center text-gray-400 text-sm">
                  Map placeholder — plug in Google Maps / Mapbox with the property's lat/lng here
                </div>
              </div>
            </div>

            {/* Right column filler on desktop so the sticky card above has room to breathe when content is short */}
            <div className="hidden lg:block lg:w-[38%]" />
          </div>
        </div>
      </section>
    </LayoutWithHeaderOffset>
  );
};

export default PropertyDetails;