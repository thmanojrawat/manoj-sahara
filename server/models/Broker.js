import mongoose from "mongoose";

/**
 * Broker / Agent
 * Sales-side person who handles properties, leads and deals.
 * Separate from Vendor (owner) and Client (buyer/renter).
 */

const brokerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Broker name is required"],
      trim: true,
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

    companyName: {
      type: String,
      trim: true,
      default: null,
    },

    // Areas/property types the broker specializes in
    specialization: {
      type: [String],
      default: [],
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

    // Years of experience
    experience: {
      type: Number,
      min: [0, "Experience cannot be negative"],
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
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

brokerSchema.index({ name: 1 });
brokerSchema.index({ phone: 1 });
brokerSchema.index({ email: 1 });
brokerSchema.index({ status: 1 });
brokerSchema.index({ city: 1 });

const Broker = mongoose.model("Broker", brokerSchema);

export default Broker;
