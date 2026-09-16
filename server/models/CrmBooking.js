import mongoose from "mongoose";

/**
 * CrmBooking
 * Real Estate reservation / booking model.
 * Replaces legacy hotel-style Booking (check-in/check-out/guests).
 */

const crmBookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      unique: true,
      trim: true,
    },

    userId: {
      type: String,
      default: null,
      index: true,
    },

    bookingType: {
      type: String,
      enum: ["site_visit", "reservation"],
      default: "site_visit",
    },

    preferredVisitTime: {
      type: String,
      default: null,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      default: null,
    },

    clientName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },

    clientPhone: {
      type: String,
      required: [true, "Customer phone is required"],
      trim: true,
    },

    clientEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CrmProperty",
      default: null,
    },

    propertyName: {
      type: String,
      default: null,
    },

    unitNumber: {
      type: String,
      default: "Unit 1",
    },

    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      default: null,
    },

    broker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Broker",
      default: null,
    },

    brokerName: {
      type: String,
      default: null,
    },

    bookingDate: {
      type: Date,
      default: Date.now,
    },

    amount: {
      type: Number,
      default: 0,
    },

    totalAgreementValue: {
      type: Number,
      default: 0,
    },

    bookingAmountPaid: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Partial", "Refunded"],
      default: "Pending",
    },

    paymentMethod: {
      type: String,
      default: "Cheque / NEFT",
    },

    notes: {
      type: String,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

crmBookingSchema.index({ clientPhone: 1 });
crmBookingSchema.index({ status: 1 });
crmBookingSchema.index({ property: 1 });
crmBookingSchema.index({ listing: 1 });
crmBookingSchema.index({ broker: 1 });

const CrmBooking = mongoose.model("CrmBooking", crmBookingSchema);

export default CrmBooking;
