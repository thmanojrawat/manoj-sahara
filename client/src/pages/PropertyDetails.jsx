import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import PropertyImages from "../components/PropertyImages";
import { assets, dummyProperties } from "../assets/data";
import toast from "react-hot-toast";

const PropertyDetails = () => {
  const {
    currency,
    properties,
    navigate,
    axios,
    getToken,
  } = useAppContext();

  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [isAvailable, setIsAvailable] = useState(false);

  // Use backend properties if available.
  // Otherwise use dummy properties.
  const allProperties =
    properties && properties.length > 0
      ? properties
      : dummyProperties;

  // Find the selected property
  useEffect(() => {
    const foundProperty = allProperties.find(
      (item) => String(item._id) === String(id)
    );

    if (foundProperty) {
      setProperty(foundProperty);
    } else {
      setProperty(null);
    }
  }, [allProperties, id]);

  // Check Availability
  const checkAvailability = async () => {
    try {
      if (!checkInDate || !checkOutDate) {
        toast.error("Please select check-in and check-out dates");
        return;
      }

      if (checkInDate >= checkOutDate) {
        toast.error("Check-out date must be after check-in date");
        return;
      }

      const { data } = await axios.post(
        "/api/bookings/check-availability",
        {
          property: id,
          checkInDate,
          checkOutDate,
        }
      );

      if (data.success) {
        if (data.isAvailable) {
          setIsAvailable(true);
          toast.success("Property is Available");
        } else {
          setIsAvailable(false);
          toast.error("Property is not Available");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Book Property
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (!isAvailable) {
        await checkAvailability();
        return;
      }

      const { data } = await axios.post(
        "/api/bookings/book",
        {
          property: id,
          checkInDate,
          checkOutDate,
          guests,
          paymentMethod: "Pay at Check-in",
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/my-bookings");
        window.scrollTo(0, 0);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Property not found
  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#fffbee] to-white pt-28">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Property Not Found
          </h2>

          <p className="text-gray-500 mb-5">
            We couldn't find the property you're looking for.
          </p>

          <button
            onClick={() => navigate("/listing")}
            className="btn-dark px-6 py-2 rounded-lg"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#fffbee] to-white py-16 pt-28">
      <div className="max-padd-container">

        {/* Property Images */}
        <PropertyImages property={property} />

        {/* Main Container */}
        <div className="flex flex-col xl:flex-row gap-8 mt-6">

          {/* LEFT SIDE */}
          <div className="p-4 flex-2 rounded-xl border border-slate-900/10">

            {/* Address */}
            <p className="flexStart gap-x-2">
              <img
                src={assets.pin}
                alt="location"
                width={19}
              />

              <span>{property.address}</span>
            </p>

            {/* Title + Price */}
            <div className="flex justify-between flex-col sm:flex-row sm:items-end mt-3">

              <h3 className="h3">
                {property.title}
              </h3>

              <div className="bold-18">
                {currency}
                {property.price.sale.toLocaleString()}{" "}
                |{" "}
                {currency}
                {property.price.rent.toLocaleString()}
                /night
              </div>

            </div>

            {/* Property Type + Rating */}
            <div className="flex justify-between items-start my-1">

              <h4 className="h4 text-secondary">
                {property.propertyType}
              </h4>

              <div className="flex items-baseline gap-2 text-secondary relative top-1.5">

                <h4 className="bold-18 relative bottom-0.5 text-black">
                  5.0
                </h4>

                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <img
                      key={index}
                      src={assets.star}
                      alt="star"
                      width={18}
                    />
                  ))}

              </div>
            </div>

            {/* Facilities */}
            <div className="flex gap-x-4 mt-3">

              <p className="flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]">
                <img
                  src={assets.bed}
                  alt="bedrooms"
                  width={19}
                />
                {property.facilities.bedrooms}
              </p>

              <p className="flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]">
                <img
                  src={assets.bath}
                  alt="bathrooms"
                  width={19}
                />
                {property.facilities.bathrooms}
              </p>

              <p className="flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]">
                <img
                  src={assets.car}
                  alt="garages"
                  width={19}
                />
                {property.facilities.garages}
              </p>

              <p className="flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]">
                <img
                  src={assets.ruler}
                  alt="area"
                  width={19}
                />
                400
              </p>

            </div>

            {/* Description */}
            <div className="mt-6">

              <h4 className="h4 mt-4 mb-1">
                Property Details
              </h4>

              <p className="mb-4">
                {property.description}
              </p>

            </div>

            {/* Amenities */}
            <h4 className="h4 mt-6 mb-2">
              Amenities
            </h4>

            <div className="flex flex-wrap gap-3">

              {property.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="p-3 py-1 rounded-lg bg-secondary/10 ring-1 ring-slate-900/10 text-sm"
                >
                  {amenity}
                </div>
              ))}

            </div>

            {/* BOOKING FORM */}
            <form
              onSubmit={onSubmitHandler}
              className="text-gray-500 bg-secondary/10 rounded-lg px-6 py-4 flex flex-col lg:flex-row gap-4 max-w-md lg:max-w-full ring-1 ring-slate-900/5 relative mt-10"
            >

              {/* Check In */}
              <div className="flex flex-col w-full">

                <div className="flex items-center gap-2">
                  <img
                    src={assets.calendar}
                    alt="calendar"
                    width={20}
                  />

                  <label htmlFor="checkInDate">
                    Check in
                  </label>
                </div>

                <input
                  onChange={(e) => {
                    setCheckInDate(e.target.value);
                    setIsAvailable(false);
                  }}
                  value={checkInDate}
                  min={new Date().toISOString().split("T")[0]}
                  id="checkInDate"
                  type="date"
                  className="rounded bg-secondary/10 border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
                />

              </div>

              {/* Check Out */}
              <div className="flex flex-col w-full">

                <div className="flex items-center gap-2">
                  <img
                    src={assets.calendar}
                    alt="calendar"
                    width={20}
                  />

                  <label htmlFor="checkOutDate">
                    Check out
                  </label>
                </div>

                <input
                  onChange={(e) => {
                    setCheckOutDate(e.target.value);
                    setIsAvailable(false);
                  }}
                  value={checkOutDate}
                  min={checkInDate || new Date().toISOString().split("T")[0]}
                  type="date"
                  id="checkOutDate"
                  disabled={!checkInDate}
                  className="rounded bg-secondary/10 border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
                />

              </div>

              {/* Guests */}
              <div className="flex flex-col w-full">

                <div className="flex items-center gap-2">
                  <img
                    src={assets.user}
                    alt="user"
                    width={20}
                  />

                  <label htmlFor="guests">
                    Guests
                  </label>
                </div>

                <input
                  onChange={(e) => setGuests(Number(e.target.value))}
                  value={guests}
                  id="guests"
                  type="number"
                  min={1}
                  max={5}
                  className="rounded bg-secondary/10 border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
                />

              </div>

              {/* Button */}
              <button
                type="submit"
                className="flexCenter gap-1 rounded-md btn-dark min-w-44"
              >
                <img
                  src={assets.search}
                  alt="search"
                  width={20}
                  className="invert"
                />

                <span>
                  {isAvailable
                    ? "Book Property"
                    : "Check Dates"}
                </span>
              </button>

            </form>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 max-w-sm">

            <div className="p-6 rounded-xl border border-slate-900/10">

              <h4 className="h4 mb-3">
                Contact Agent
              </h4>

              <form className="flex flex-col gap-4">

                <input
                  type="text"
                  placeholder="Your Name"
                  className="p-2 py-1 border border-gray-300 rounded-md text-sm"
                  required
                />

                <input
                  type="email"
                  placeholder="Your Email"
                  className="p-2 py-1 border border-gray-300 rounded-md text-sm"
                  required
                />

                <textarea
                  rows={4}
                  placeholder="Your Message"
                  className="p-2 py-1 border border-gray-300 rounded-md text-sm"
                  required
                />

                <button
                  type="submit"
                  className="btn-secondary rounded-lg py-1.5"
                >
                  Send Message
                </button>

              </form>

              {/* Agent */}
              <h4 className="h4 mb-3 mt-8">
                For Buying Contact
              </h4>

              <div className="text-sm w-80 divide-y divide-gray-500/30 border border-gray-500/30 rounded">

                <div className="flex items-start justify-between p-3">

                  <div>

                    <div className="flex items-center space-x-2">

                      <h5 className="h5">
                        {property.agency.name}
                      </h5>

                      <p className="bg-green-500/20 px-2 py-0.5 rounded-full text-xs text-green-600 border border-green-500/30">
                        Agency
                      </p>

                    </div>

                    <p>
                      Agency Office
                    </p>

                  </div>

                  <img
                    src={property.agency.owner.image}
                    alt="agent"
                    className="h-10 w-10 rounded-full"
                  />

                </div>

                <div className="flexStart gap-2 p-1.5">

                  <div className="bg-green-500/20 p-1 rounded-full border border-green-500/30">
                    <img
                      src={assets.phone}
                      alt="phone"
                      width={14}
                    />
                  </div>

                  <p>
                    {property.agency.contact}
                  </p>

                </div>

                <div className="flexStart gap-2 p-1.5">

                  <div className="bg-green-500/20 p-1 rounded-full border border-green-500/30">
                    <img
                      src={assets.mail}
                      alt="email"
                      width={14}
                    />
                  </div>

                  <p>
                    {property.agency.email}
                  </p>

                </div>

                <div className="flex items-center">

                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 w-full py-3 cursor-pointer"
                  >
                    <img
                      src={assets.mail}
                      alt="email"
                      width={19}
                    />
                    Send Email
                  </button>
                </div>

              </div>
              <a
                href={`tel:${property.agency.contact}`}
                className="mt-3 flex w-80 items-center justify-center gap-1.5 rounded-full bg-[#d99a35] px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#c88624]"
              >
                Call Now
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
                  <img src={assets.phone} alt="" className="h-3.5 w-3.5" />
                </span>
              </a>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
