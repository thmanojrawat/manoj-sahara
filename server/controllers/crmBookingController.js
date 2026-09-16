import mongoose from "mongoose";
import CrmBooking from "../models/CrmBooking.js";
import Client from "../models/Client.js";
import CrmProperty from "../models/CrmProperty.js";

/** Normalize booking doc for CRM Bookings table */
const normalize = (doc) => {
  const obj =
    doc && typeof doc.toObject === "function"
      ? doc.toObject({ virtuals: false })
      : { ...doc };

  if (obj._id) {
    obj.id = obj._id.toString();
    delete obj._id;
  }

  delete obj.__v;

  // Preserve customer/site-visit fields
  obj.userId = obj.userId || null;
  obj.bookingType = obj.bookingType || "site_visit";
  obj.preferredVisitTime = obj.preferredVisitTime || "";

  obj.bookingNumber =
    obj.bookingNumber ||
    `BOK-2026-${obj.id ? obj.id.slice(-4).toUpperCase() : "0000"}`;

  obj.unitNumber = obj.unitNumber || "Unit A-101";

  obj.propertyName =
    obj.propertyName ||
    obj.property?.title ||
    "Sahara Residence";

  obj.brokerName =
    obj.brokerName ||
    obj.broker?.name ||
    "Assigned Agent";

  obj.totalAgreementValue =
    obj.totalAgreementValue ||
    obj.property?.price ||
    (obj.amount ? obj.amount * 10 : 0);

  obj.bookingAmountPaid =
    obj.bookingAmountPaid !== undefined &&
    obj.bookingAmountPaid !== null
      ? obj.bookingAmountPaid
      : obj.amount !== undefined
        ? obj.amount
        : 0;

  obj.bookingStatus = obj.status
    ? obj.status.charAt(0).toUpperCase() +
      obj.status.slice(1).toLowerCase()
    : "Pending";

  obj.paymentStatus = obj.paymentStatus || "Pending";

  obj.bookingDate = obj.bookingDate
    ? new Date(obj.bookingDate).toLocaleDateString("en-GB")
    : new Date(obj.createdAt || Date.now()).toLocaleDateString("en-GB");

  return obj;
};

// GET /api/crm/bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await CrmBooking.find({
      isDeleted: { $ne: true },
    })
      .populate(
        "property",
        "title propertyType price locality city"
      )
      .populate(
        "listing",
        "title slug listedPrice"
      )
      .populate(
        "broker",
        "name phone email companyName"
      )
      .populate(
        "client",
        "name phone email"
      )
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: bookings.map(normalize),
    });
  } catch (err) {
    console.error("[CRM Booking] getBookings error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

// GET /api/crm/bookings/:id
export const getBookingById = async (req, res) => {
  try {
    const booking = await CrmBooking.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true },
    })
      .populate(
        "property",
        "title propertyType price locality city"
      )
      .populate(
        "listing",
        "title slug listedPrice"
      )
      .populate(
        "broker",
        "name phone email companyName"
      )
      .populate(
        "client",
        "name phone email"
      )
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      data: normalize(booking),
    });
  } catch (err) {
    console.error(
      "[CRM Booking] getBookingById error:",
      err
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
};

// POST /api/crm/bookings
// Works for public customer booking and CRM admin
export const createBooking = async (req, res) => {
  try {
    const {
      name,
      clientName,
      phone,
      clientPhone,
      email,
      clientEmail,
      property,
      propertyId,
      propertyName,
      unitNumber,
      listing,
      listingId,
      broker,
      brokerId,
      brokerName,
      bookingDate,
      amount,
      bookingAmountPaid,
      totalAgreementValue,
      status,
      bookingStatus,
      paymentStatus,
      paymentMethod,
      notes,
    } = req.body;

    const resolvedName = clientName || name;
    const resolvedPhone = clientPhone || phone;
    const resolvedEmail =
      clientEmail || email || null;

    if (!resolvedName || !resolvedPhone) {
      return res.status(400).json({
        success: false,
        message:
          "Customer name and phone are required",
      });
    }

    const resolvedPropertyId =
      property ||
      propertyId ||
      (mongoose.Types.ObjectId.isValid(
        req.body.property
      )
        ? req.body.property
        : null);

    const resolvedListingId =
      listing ||
      listingId ||
      (mongoose.Types.ObjectId.isValid(
        req.body.listing
      )
        ? req.body.listing
        : null);

    const resolvedBrokerId =
      broker ||
      brokerId ||
      (mongoose.Types.ObjectId.isValid(
        req.body.broker
      )
        ? req.body.broker
        : null);

    // Get property information if property exists
    let resolvedPropName = propertyName;
    let propPrice = 0;

    if (
      resolvedPropertyId &&
      mongoose.Types.ObjectId.isValid(
        resolvedPropertyId
      )
    ) {
      const propDoc =
        await CrmProperty.findById(
          resolvedPropertyId
        ).lean();

      if (propDoc) {
        resolvedPropName =
          resolvedPropName || propDoc.title;

        propPrice = propDoc.price || 0;
      }
    }

    const count =
      await CrmBooking.countDocuments();

    const bookingNumber =
      req.body.bookingNumber ||
      `BOK-2026-${String(count + 1).padStart(
        3,
        "0"
      )}`;

    // Upsert Client
    let clientId = null;

    try {
      const existingClient =
        await Client.findOne({
          $or: [
            {
              phone: resolvedPhone
                .trim(),
            },
            ...(resolvedEmail
              ? [
                  {
                    email:
                      resolvedEmail
                        .trim()
                        .toLowerCase(),
                  },
                ]
              : []),
          ],
        });

      if (existingClient) {
        clientId = existingClient._id;
      } else {
        const newClient =
          await Client.create({
            name: resolvedName,
            phone: resolvedPhone.trim(),
            email: resolvedEmail
              ? resolvedEmail
                  .trim()
                  .toLowerCase()
              : null,
            source: "website",
            requirementNotes: `Booked ${
              resolvedPropName || "Property"
            }`,
            budget: {
              min: 0,
              max:
                totalAgreementValue ||
                propPrice ||
                10000000,
            },
            status: "active",
            notes: `Created from Booking ${bookingNumber}`,
          });

        clientId = newClient._id;
      }
    } catch (clientErr) {
      console.error(
        "[CRM Booking] Client upsert notice:",
        clientErr.message
      );
    }

    // Clerk authenticated user
    const authData =
      typeof req.auth === "function"
        ? req.auth()
        : req.auth;

    const resolvedUserId =
      req.body.userId ||
      authData?.userId ||
      null;

    // Site visit information
    const preferredVisitTime =
      req.body.preferredVisitTime ||
      "11:00 AM";

    const bookingType =
      req.body.bookingType ||
      "site_visit";

    const booking = await CrmBooking.create({
      bookingNumber,

      userId: resolvedUserId,

      bookingType,

      preferredVisitTime,

      client: clientId,

      clientName: resolvedName,

      clientPhone: resolvedPhone,

      clientEmail: resolvedEmail,

      property:
        resolvedPropertyId &&
        mongoose.Types.ObjectId.isValid(
          resolvedPropertyId
        )
          ? resolvedPropertyId
          : null,

      propertyName:
        resolvedPropName ||
        "Sahara Residence",

      unitNumber:
        unitNumber || "Site Visit",

      listing:
        resolvedListingId &&
        mongoose.Types.ObjectId.isValid(
          resolvedListingId
        )
          ? resolvedListingId
          : null,

      broker:
        resolvedBrokerId &&
        mongoose.Types.ObjectId.isValid(
          resolvedBrokerId
        )
          ? resolvedBrokerId
          : null,

      brokerName:
        brokerName || "Assigned Agent",

      bookingDate: bookingDate
        ? new Date(bookingDate)
        : new Date(),

      amount:
        amount !== undefined &&
        amount !== null
          ? Number(amount)
          : bookingAmountPaid !== undefined &&
              bookingAmountPaid !== null
            ? Number(bookingAmountPaid)
            : 0,

      totalAgreementValue:
        totalAgreementValue
          ? Number(totalAgreementValue)
          : propPrice || 0,

      bookingAmountPaid:
        bookingAmountPaid !== undefined &&
        bookingAmountPaid !== null
          ? Number(bookingAmountPaid)
          : amount !== undefined &&
              amount !== null
            ? Number(amount)
            : 0,

      status: (
        status ||
        bookingStatus ||
        "pending"
      ).toLowerCase(),

      paymentStatus:
        paymentStatus || "Pending",

      paymentMethod:
        paymentMethod ||
        "Site Visit Request",

      notes:
        notes ||
        `Site visit scheduled for ${new Date(
          bookingDate || Date.now()
        ).toLocaleDateString(
          "en-GB"
        )} at ${preferredVisitTime}`,

      isDeleted: false,
    });

    const populated =
      await CrmBooking.findById(
        booking._id
      )
        .populate(
          "property",
          "title propertyType price locality city"
        )
        .populate(
          "listing",
          "title slug listedPrice"
        )
        .populate(
          "broker",
          "name phone email companyName"
        )
        .populate(
          "client",
          "name phone email"
        )
        .lean();

    res.status(201).json({
      success: true,
      data: normalize(populated),
      message: `Booking ${bookingNumber} created successfully!`,
    });
  } catch (err) {
    console.error(
      "[CRM Booking] createBooking error:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to create booking",
    });
  }
};

// PUT /api/crm/bookings/:id
export const updateBooking = async (req, res) => {
  try {
    const updates = {
      ...req.body,
    };

    if (updates.bookingStatus) {
      updates.status =
        updates.bookingStatus.toLowerCase();
    }

    const booking =
      await CrmBooking.findOneAndUpdate(
        {
          _id: req.params.id,
          isDeleted: { $ne: true },
        },
        {
          $set: updates,
        },
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "property",
          "title propertyType price locality city"
        )
        .populate(
          "listing",
          "title slug listedPrice"
        )
        .populate(
          "broker",
          "name phone email companyName"
        )
        .populate(
          "client",
          "name phone email"
        )
        .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      data: normalize(booking),
    });
  } catch (err) {
    console.error(
      "[CRM Booking] updateBooking error:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to update booking",
    });
  }
};

// DELETE /api/crm/bookings/:id
// Soft delete
export const deleteBooking = async (req, res) => {
  try {
    const booking =
      await CrmBooking.findOneAndUpdate(
        {
          _id: req.params.id,
          isDeleted: { $ne: true },
        },
        {
          $set: {
            isDeleted: true,
            status: "cancelled",
          },
        },
        {
          new: true,
        }
      );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      message:
        "Booking cancelled and soft-deleted",
      id: req.params.id,
    });
  } catch (err) {
    console.error(
      "[CRM Booking] deleteBooking error:",
      err
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete booking",
    });
  }
};