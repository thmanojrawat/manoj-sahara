import mongoose from "mongoose";

/**
 * Lead
 * Inquiries and prospect leads for CRM.
 * Created from customer website "Enquire Now" / "Contact Agent" or added manually in CRM.
 */

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
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

    source: {
      type: String,
      default: "Website Inquiry",
    },

    message: {
      type: String,
      default: null,
    },

    requirement: {
      type: String,
      default: null,
    },

    budget: {
      type: Number,
      default: null,
    },

    propertyType: {
      type: String,
      default: null,
    },

    preferredLocation: {
      type: String,
      default: null,
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CrmProperty",
      default: null,
    },

    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Qualified",
        "Site Visit",
        "Negotiation",
        "Converted",
        "Lost",
      ],
      default: "New",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "High",
    },

    assignedBroker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Broker",
      default: null,
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

leadSchema.index({ name: 1 });
leadSchema.index({ phone: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ property: 1 });
leadSchema.index({ assignedBroker: 1 });

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
