import mongoose from "mongoose";

/**
 * CrmProperty
 * Core property inventory entity for the new CRM architecture.
 *
 * Naming: "CrmProperty" to avoid collision with the legacy Property model
 * that exists for the customer website. Both models co-exist during migration.
 *
 * Architecture:
 *   Vendor (owner) ──> CrmProperty <── Broker (handles/sells)
 *                           |
 *                        Listing ──> Customer Website
 */

const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Plot",
  "Land",
  "Commercial",
  "Office",
  "Shop",
  "Warehouse",
  "House",
  "Other",
];

const PROPERTY_STATUSES = [
  "draft",
  "available",
  "reserved",
  "sold",
  "rented",
  "unavailable",
  "archived",
];

const crmPropertySchema = new mongoose.Schema(
  {
    // ── Basic ──────────────────────────────────────────────────────────
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    propertyType: {
      type: String,
      required: [true, "Property type is required"],
      enum: PROPERTY_TYPES,
    },

    status: {
      type: String,
      enum: PROPERTY_STATUSES,
      default: "draft",
    },

    // ── Location ───────────────────────────────────────────────────────
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
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

    landmark: {
      type: String,
      trim: true,
      default: null,
    },

    pincode: {
      type: String,
      trim: true,
      default: null,
    },

    // ── Pricing ────────────────────────────────────────────────────────
    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
      default: null,
    },

    priceType: {
      type: String,
      enum: ["sale", "rent", "negotiable"],
      default: "sale",
    },

    // ── Area ───────────────────────────────────────────────────────────
    area: {
      type: Number,
      min: [0, "Area cannot be negative"],
      default: null,
    },

    areaUnit: {
      type: String,
      enum: ["sqft", "sqm", "sqyd", "acres", "marla", "kanal", "cent"],
      default: "sqft",
    },

    // ── Property Details ───────────────────────────────────────────────
    bedrooms: {
      type: Number,
      min: [0, "Bedrooms cannot be negative"],
      default: null,
    },

    bathrooms: {
      type: Number,
      min: [0, "Bathrooms cannot be negative"],
      default: null,
    },

    parking: {
      type: Number,
      min: [0, "Parking cannot be negative"],
      default: null,
    },

    furnishing: {
      type: String,
      enum: ["unfurnished", "semi-furnished", "fully-furnished", null],
      default: null,
    },

    amenities: {
      type: [String],
      default: [],
    },

    // ── Media ──────────────────────────────────────────────────────────
    images: [
      {
        url: { type: String, required: true }, // Cloudinary URL
        publicId: { type: String },            // Cloudinary public_id for deletion
        caption: { type: String, default: null },
        isPrimary: { type: Boolean, default: false },
      },
    ],

    // ── Relationships ──────────────────────────────────────────────────

    // Vendor is the property owner — required
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Vendor (owner) is required"],
    },

    // Broker/Agent who handles the property
    broker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Broker",
      default: null,
    },

    // Optional: link to a future Project model (not created in this phase)
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    // CRM staff who added this property record
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null,
    },

    // ── Publishing ─────────────────────────────────────────────────────
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes for common search and filter operations
crmPropertySchema.index({ city: 1 });
crmPropertySchema.index({ locality: 1 });
crmPropertySchema.index({ propertyType: 1 });
crmPropertySchema.index({ status: 1 });
crmPropertySchema.index({ published: 1 });
crmPropertySchema.index({ vendor: 1 });
crmPropertySchema.index({ broker: 1 });
crmPropertySchema.index({ price: 1 });
crmPropertySchema.index({ city: 1, propertyType: 1, status: 1 }); // compound

const CrmProperty = mongoose.model("CrmProperty", crmPropertySchema);

export default CrmProperty;
