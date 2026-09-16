import Booking from "../models/Booking.js";
import Property from "../models/Property.js";
import Agency from "../models/Agency.js";
import CrmBooking from "../models/CrmBooking.js";
import transporter from "../config/nodemailer.js";
import Stripe from "stripe";

// --------------------------------------------------
// Check property availability
// --------------------------------------------------
const checkAvailability = async ({
  checkInDate,
  checkOutDate,
  property,
}) => {
  try {
    const bookings = await Booking.find({
      property,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
      status: { $ne: "cancelled" },
    });

    return bookings.length === 0;
  } catch (error) {
    console.log("Availability Error:", error.message);
    return false;
  }
};

// --------------------------------------------------
// Check Booking Availability
// POST /api/bookings/check-availability
// --------------------------------------------------
export const checkBookingAvailability = async (req, res) => {
  try {
    const { property, checkInDate, checkOutDate } = req.body;

    if (!property || !checkInDate || !checkOutDate) {
      return res.json({
        success: false,
        message: "Property and booking dates are required",
      });
    }

    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      property,
    });

    res.json({
      success: true,
      isAvailable,
    });
  } catch (error) {
    console.log("Check Availability Error:", error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// --------------------------------------------------
// Create Booking
// POST /api/bookings/book
// --------------------------------------------------
export const bookingCreate = async (req, res) => {
  try {
    const {
      property,
      checkInDate,
      checkOutDate,
      guests,
      paymentMethod,
    } = req.body;

    // Make sure user is authenticated
    if (!req.user) {
      return res.json({
        success: false,
        message: "Not Authorized",
      });
    }

    // Validate data
    if (!property || !checkInDate || !checkOutDate || !guests) {
      return res.json({
        success: false,
        message: "Please provide all booking details",
      });
    }

    // --------------------------------------------------
    // Check property
    // --------------------------------------------------
    const propertyData = await Property.findById(property).populate("agency");

    if (!propertyData) {
      return res.json({
        success: false,
        message: "Property not found",
      });
    }

    // Check agency
    if (!propertyData.agency) {
      return res.json({
        success: false,
        message: "Agency not found for this property",
      });
    }

    // --------------------------------------------------
    // Check availability again before creating booking
    // --------------------------------------------------
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      property,
    });

    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Property is not available for these dates",
      });
    }

    // --------------------------------------------------
    // Calculate number of nights
    // --------------------------------------------------
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(
      timeDiff / (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) {
      return res.json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    // --------------------------------------------------
    // Calculate total price
    // --------------------------------------------------
    const totalPrice = propertyData.price.rent * nights;

    // --------------------------------------------------
    // Create booking
    // --------------------------------------------------
    const booking = await Booking.create({
      user: req.user._id,
      property: propertyData._id,
      agency: propertyData.agency._id,
      guests: Number(guests),
      checkInDate,
      checkOutDate,
      totalPrice,
      paymentMethod: paymentMethod || "Pay at Check-in",
    });

    console.log("Booking Created:", booking._id);

    // ==================================================
    // SEND EMAIL TO AGENCY OWNER
    // ==================================================

    const agencyEmail = propertyData.agency.email;

    if (agencyEmail) {
      const agencyMailOptions = {
        from: process.env.SENDER_EMAIL,
        to: agencyEmail,

        subject: `New Property Booking - ${propertyData.title}`,

        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

            <h2 style="color: #222;">
              New Property Booking
            </h2>

            <p>
              Hello ${propertyData.agency.name},
            </p>

            <p>
              A customer has successfully booked your property.
            </p>

            <hr />

            <h3>Booking Details</h3>

            <p>
              <strong>Booking ID:</strong>
              ${booking._id}
            </p>

            <p>
              <strong>Property:</strong>
              ${propertyData.title}
            </p>

            <p>
              <strong>Location:</strong>
              ${propertyData.address}, ${propertyData.city}
            </p>

            <p>
              <strong>Customer:</strong>
              ${req.user.email}
            </p>

            <p>
              <strong>Guests:</strong>
              ${guests}
            </p>

            <p>
              <strong>Check-in:</strong>
              ${checkIn.toDateString()}
            </p>

            <p>
              <strong>Check-out:</strong>
              ${checkOut.toDateString()}
            </p>

            <p>
              <strong>Nights:</strong>
              ${nights}
            </p>

            <p>
              <strong>Total Amount:</strong>
              ${process.env.CURRENCY || "$"}${totalPrice}
            </p>

            <p>
              <strong>Payment Method:</strong>
              ${paymentMethod || "Pay at Check-in"}
            </p>

            <hr />

            <p>
              Please check your Sahara agency dashboard for the booking.
            </p>

            <p>
              Regards,<br />
              Sahara Team
            </p>

          </div>
        `,
      };

      try {
        await transporter.sendMail(agencyMailOptions);

        console.log(
          "Booking email sent successfully to agency:",
          agencyEmail
        );
      } catch (emailError) {
        console.log(
          "Agency email failed:",
          emailError.message
        );
      }
    } else {
      console.log("Agency email not found");
    }

    // ==================================================
    // SEND CONFIRMATION EMAIL TO CUSTOMER
    // ==================================================

    if (req.user.email) {
      const customerMailOptions = {
        from: process.env.SENDER_EMAIL,
        to: req.user.email,

        subject: `Booking Confirmation - ${propertyData.title}`,

        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

            <h2>Booking Confirmation</h2>

            <p>
              Thank you for booking with Sahara.
            </p>

            <hr />

            <h3>Booking Details</h3>

            <p>
              <strong>Booking ID:</strong>
              ${booking._id}
            </p>

            <p>
              <strong>Property:</strong>
              ${propertyData.title}
            </p>

            <p>
              <strong>Agency:</strong>
              ${propertyData.agency.name}
            </p>

            <p>
              <strong>Location:</strong>
              ${propertyData.address}, ${propertyData.city}
            </p>

            <p>
              <strong>Check-in:</strong>
              ${checkIn.toDateString()}
            </p>

            <p>
              <strong>Check-out:</strong>
              ${checkOut.toDateString()}
            </p>

            <p>
              <strong>Guests:</strong>
              ${guests}
            </p>

            <p>
              <strong>Total Amount:</strong>
              ${process.env.CURRENCY || "$"}${totalPrice}
            </p>

            <p>
              <strong>Payment:</strong>
              ${paymentMethod || "Pay at Check-in"}
            </p>

            <hr />

            <p>
              Your booking has been successfully created.
            </p>

            <p>
              Regards,<br />
              Sahara Team
            </p>

          </div>
        `,
      };

      try {
        await transporter.sendMail(customerMailOptions);

        console.log(
          "Confirmation email sent to customer:",
          req.user.email
        );
      } catch (emailError) {
        console.log(
          "Customer email failed:",
          emailError.message
        );
      }
    }

    // --------------------------------------------------
    // Booking successful
    // --------------------------------------------------
    res.json({
      success: true,
      message: "Booking Created",
      booking,
    });

  } catch (error) {
    console.log("BOOKING CREATE ERROR:", error);

    res.json({
      success: false,
      message: error.message || "Failed to create Booking",
    });
  }
};

// --------------------------------------------------
// Get Current User Bookings
// GET /api/bookings/user
// --------------------------------------------------
export const getUserBookings = async (req, res) => {
  try {
    const authData = typeof req.auth === "function" ? req.auth() : req.auth;
    const userId = req.user?._id || authData?.userId;
    const userEmail = req.user?.email;

    const queryConditions = [];
    if (userId) {
      queryConditions.push({ userId });
    }
    if (userEmail) {
      queryConditions.push({ clientEmail: userEmail.toLowerCase() });
    }

    let crmBookings = [];
    if (queryConditions.length > 0) {
      crmBookings = await CrmBooking.find({
        isDeleted: { $ne: true },
        $or: queryConditions,
      })
        .populate("property", "title propertyType price locality city images address")
        .populate("listing", "title slug listedPrice publicImages")
        .populate("broker", "name phone email companyName")
        .sort({ createdAt: -1 })
        .lean();
    }

    // Format for customer client
    const formattedCrmBookings = crmBookings.map((b) => {
      let images = [];
      if (Array.isArray(b.listing?.publicImages) && b.listing.publicImages.length > 0) {
        images = b.listing.publicImages.map((img) => (typeof img === "string" ? img : img?.url || ""));
      } else if (Array.isArray(b.property?.images) && b.property.images.length > 0) {
        images = b.property.images.map((img) => (typeof img === "string" ? img : img?.url || ""));
      } else {
        images = ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"];
      }

      const propTitle = b.propertyName || b.listing?.title || b.property?.title || "Sahara Residence";
      const propLocality = b.property?.locality || "Kolkata";
      const propCity = b.property?.city || "Kolkata";
      const propAddress = b.property?.address || `${propLocality}, ${propCity}`;

      return {
        _id: b._id.toString(),
        id: b._id.toString(),
        bookingNumber: b.bookingNumber || `BOK-2026-${b._id.toString().slice(-4).toUpperCase()}`,
        bookingType: b.bookingType || "site_visit",
        property: {
          _id: b.property?._id?.toString() || b.property?.toString() || "",
          title: propTitle,
          address: propAddress,
          locality: propLocality,
          city: propCity,
          images,
        },
        clientName: b.clientName,
        clientEmail: b.clientEmail,
        clientPhone: b.clientPhone,
        bookingDate: b.bookingDate,
        preferredVisitTime: b.preferredVisitTime || "11:00 AM",
        status: b.status || "pending",
        paymentStatus: b.paymentStatus || "Pending",
        amount: b.amount || 0,
        notes: b.notes,
        createdAt: b.createdAt,
      };
    });

    res.json({
      success: true,
      bookings: formattedCrmBookings,
    });
  } catch (error) {
    console.error("Get User Bookings Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get Bookings",
    });
  }
};

// --------------------------------------------------
// Get Agency Bookings
// GET /api/bookings/agency
// --------------------------------------------------
export const getAgencyBookings = async (req, res) => {
  try {
    const agency = await Agency.findOne({
      owner: req.auth().userId,
    });

    if (!agency) {
      return res.json({
        success: false,
        message: "No Agency found",
      });
    }

    const bookings = await Booking.find({
      agency: agency._id,
    })
      .populate("property agency user")
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;

    const totalRevenue = bookings.reduce(
      (acc, booking) =>
        acc + (booking.isPaid ? booking.totalPrice : 0),
      0
    );

    res.json({
      success: true,
      dashboardData: {
        totalBookings,
        totalRevenue,
        bookings,
      },
    });

  } catch (error) {
    console.log("Get Agency Bookings Error:", error.message);

    res.json({
      success: false,
      message: "Failed to get Agency Bookings",
    });
  }
};

// --------------------------------------------------
// Stripe Payment
// POST /api/bookings/stripe
// --------------------------------------------------
export const bookingStripePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.json({
        success: false,
        message: "Booking not found",
      });
    }

    const propertyData = await Property.findById(
      booking.property
    ).populate("agency");

    if (!propertyData) {
      return res.json({
        success: false,
        message: "Property not found",
      });
    }

    const totalPrice = booking.totalPrice;
    const { origin } = req.headers;

    const stripeInstance = new Stripe(
      process.env.STRIPE_SECRET_KEY
    );

    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: propertyData.agency.name,
          },
          unit_amount: totalPrice * 100,
        },
        quantity: 1,
      },
    ];

    const session =
      await stripeInstance.checkout.sessions.create({
        line_items,
        mode: "payment",

        success_url:
          `${origin}/processing/my-bookings`,

        cancel_url:
          `${origin}/my-bookings`,

        metadata: {
          bookingId: bookingId.toString(),
        },
      });

    res.json({
      success: true,
      url: session.url,
    });

  } catch (error) {
    console.log("Stripe Payment Error:", error.message);

    res.json({
      success: false,
      message: "Payment Failed",
    });
  }
};