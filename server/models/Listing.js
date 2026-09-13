import mongoose from "mongoose";

/**
 * Listing
 * Public advertisement / listing of a CrmProperty.
 * A Property must exist before a Listing can be created.
 *
 * Flow: Vendor -> CrmProperty -> Listing -> Customer Website
 */

const listingSchema = new mongoose.Schema(
  {
    // The underlying property this listing advertises
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CrmProperty",
      required: [true, "Property reference is required"],
    },

    title: {
      type: String,
      required: [true, "Listing title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Listing description is required"],
      trim: true,
    },

    listingType: {
      type: String,
      required: [true, "Listing type is required"],
      enum: ["sale", "rent", "new-launch", "commercial", "plot-land"],
    },

    status: {
      type: String,
      enum: ["draft", "active", "paused", "expired", "sold", "archived"],
      default: "draft",
    },

    // Controls visibility on the customer-facing website
    published: {
      type: Boolean,
      default: false,
    },

    // Promoted / featured listing on the website
    featured: {
      type: Boolean,
      default: false,
    },

    // URL-friendly unique slug for public pages e.g. "3bhk-villa-banjara-hills"
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Public-facing images (curated subset of property images)
    publicImages: [
      {
        url: { type: String, required: true }, // Cloudinary URL
        publicId: { type: String },
        caption: { type: String, default: null },
        isPrimary: { type: Boolean, default: false },
      },
    ],

    // Advertised price (may differ from internal property price)
    listedPrice: {
      type: Number,
      min: [0, "Listed price cannot be negative"],
      default: null,
    },

    // Set when the listing goes live
    publishedAt: {
      type: Date,
      default: null,
    },

    // CRM staff who created this listing
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null,
    },
  },
  { timestamps: true }
);

// slug is already indexed via unique: true
listingSchema.index({ property: 1 });
listingSchema.index({ status: 1 });
listingSchema.index({ published: 1 });
listingSchema.index({ featured: 1 });
listingSchema.index({ listingType: 1 });
listingSchema.index({ published: 1, featured: 1, status: 1 }); // compound for website queries

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
