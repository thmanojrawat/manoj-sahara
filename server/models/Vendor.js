import mongoose from "mongoose";

/**
 * Vendor
 * Property owner / supplier.
 * Completely separate from Client and Broker.
 * One Vendor can own multiple Properties.
 */

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vendor name is required"],
      trim: true,
    },

    companyName: {
      type: String,
      trim: true,
      default: null,
    },

    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },

    address: {
      type: String,
      trim: true,
      default: null,
    },

    city: {
      type: String,
      trim: true,
      default: null,
    },

    locality: {
      type: String,
      trim: true,
      default: null,
    },

    notes: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // CRM staff member managing this vendor relationship
    relationshipManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null,
    },
  },
  { timestamps: true }
);

vendorSchema.index({ name: 1 });
vendorSchema.index({ phone: 1 });
vendorSchema.index({ email: 1 });
vendorSchema.index({ status: 1 });
vendorSchema.index({ city: 1 });

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
