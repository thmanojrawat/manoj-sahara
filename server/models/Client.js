import mongoose from "mongoose";

/**
 * Client
 * Buyer, renter, or prospect tracked in the CRM.
 * Separate from Vendor (owner) and Broker (agent).
 * Clients are NOT property owners.
 */

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
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

    address: {
      type: String,
      trim: true,
      default: null,
    },

    // What the client is looking for
    requirementNotes: {
      type: String,
      default: null,
    },

    budget: {
      min: { type: Number, min: 0, default: null },
      max: { type: Number, min: 0, default: null },
    },

    interestedIn: {
      type: String,
      enum: ["buy", "rent", "invest", "other", null],
      default: null,
    },

    source: {
      type: String,
      enum: [
        "website",
        "referral",
        "walk-in",
        "portal",
        "social-media",
        "phone",
        "email",
        "other",
        null,
      ],
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "converted", "lost"],
      default: "active",
    },

    notes: {
      type: String,
      default: null,
    },

    // CRM staff managing this client
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null,
    },
  },
  { timestamps: true }
);

clientSchema.index({ name: 1 });
clientSchema.index({ phone: 1 });
clientSchema.index({ email: 1 });
clientSchema.index({ status: 1 });
clientSchema.index({ city: 1 });

const Client = mongoose.model("Client", clientSchema);

export default Client;
