import mongoose from "mongoose";
import Listing from "../models/Listing.js";
import CrmProperty from "../models/CrmProperty.js";

/** Normalize listing for CRM Admin */
const normalizeAdmin = (doc) => {
  const obj = doc && typeof doc.toObject === "function" ? doc.toObject({ virtuals: false }) : { ...doc };
  if (obj._id) {
    obj.id = obj._id.toString();
    delete obj._id;
  }
  delete obj.__v;
  return obj;
};

/** Format listing doc into customer client format (compatible with Item.jsx, Listing.jsx, PropertyDetails.jsx) */
const formatForPublicClient = (listing) => {
  const prop = listing.property || {};
  const broker = prop.broker || {};

  const images =
    listing.publicImages && listing.publicImages.length > 0
      ? listing.publicImages.map((img) => (typeof img === "string" ? img : img?.url || ""))
      : prop.images && prop.images.length > 0
      ? prop.images.map((img) => (typeof img === "string" ? img : img?.url || ""))
      : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"];

  const salePrice = listing.listedPrice || prop.price || 5000000;
  const rentPrice = prop.priceType === "rent" ? (listing.listedPrice || prop.price || 25000) : Math.round(salePrice * 0.003);

  return {
    _id: listing._id.toString(),
    id: listing._id.toString(),
    slug: listing.slug,
    title: listing.title || prop.title || "Sahara Premium Property",
    description: listing.description || prop.description || "Luxury real estate property in Kolkata.",
    propertyType: prop.propertyType || "Apartment",
    price: {
      sale: salePrice,
      rent: rentPrice,
    },
    facilities: {
      bedrooms: prop.bedrooms || 3,
      bathrooms: prop.bathrooms || 2,
      garages: prop.parking || 1,
    },
    area: prop.area || 1200,
    address: [prop.address, prop.locality, prop.city].filter(Boolean).join(", ") || `${prop.locality || "New Town"}, Kolkata`,
    city: prop.city || "Kolkata",
    country: "India",
    locality: prop.locality || "",
    amenities: prop.amenities && prop.amenities.length > 0 ? prop.amenities : ["24x7 Security & CCTV", "Covered Car Parking", "Power Backup"],
    images,
    featured: listing.featured || false,
    listingType: listing.listingType || "sale",
    broker: broker ? {
      _id: broker._id ? broker._id.toString() : "",
      name: broker.name || "Assigned Consultant",
      phone: broker.phone || "+91 98300 12345",
      email: broker.email || "contact@sahara.com",
    } : null,
    // Backwards compatibility for legacy Agency UI in client Item & PropertyDetails
    agency: {
      name: broker?.companyName || "Sahara Realty Network Kolkata",
      contact: broker?.phone || "+91 98300 12345",
      email: broker?.email || "sales@sahara-realty.in",
      owner: {
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80",
        email: broker?.email || "sales@sahara-realty.in",
      },
    },
    rawProperty: prop,
    rawListing: listing,
  };
};

// GET /api/crm/listings (Admin)
export const getListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate({
        path: "property",
        populate: [
          { path: "vendor", select: "name companyName phone email" },
          { path: "broker", select: "name phone email companyName" },
        ],
      })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: listings.map(normalizeAdmin) });
  } catch (err) {
    console.error("[CRM Listing] getListings error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch listings" });
  }
};

// GET /api/crm/listings/:id (Admin)
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate({
        path: "property",
        populate: [
          { path: "vendor", select: "name companyName phone email" },
          { path: "broker", select: "name phone email companyName" },
        ],
      })
      .lean();

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    res.json({ success: true, data: normalizeAdmin(listing) });
  } catch (err) {
    console.error("[CRM Listing] getListingById error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch listing" });
  }
};

// POST /api/crm/listings (Admin)
export const createListing = async (req, res) => {
  try {
    const { property, title, description, listingType, status, published, featured, slug, listedPrice, publicImages } = req.body;

    if (!property || !mongoose.Types.ObjectId.isValid(property)) {
      return res.status(400).json({ success: false, message: "Valid property ObjectId is required" });
    }

    const crmProp = await CrmProperty.findById(property);
    if (!crmProp) {
      return res.status(404).json({ success: false, message: "CrmProperty not found" });
    }

    const resolvedTitle = title || crmProp.title;
    const resolvedSlug = (
      slug ||
      `${resolvedTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`
    ).trim();

    let formattedImages = [];
    if (Array.isArray(publicImages) && publicImages.length > 0) {
      formattedImages = publicImages.map((img) =>
        typeof img === "string" ? { url: img, isPrimary: false } : img
      );
    } else if (crmProp.images && crmProp.images.length > 0) {
      formattedImages = crmProp.images;
    }

    const newListing = await Listing.create({
      property,
      title: resolvedTitle,
      description: description || crmProp.description,
      listingType: listingType || (crmProp.priceType === "rent" ? "rent" : "sale"),
      status: status || "active",
      published: published !== undefined ? published : true,
      featured: featured || false,
      slug: resolvedSlug,
      listedPrice: listedPrice ? Number(listedPrice) : crmProp.price,
      publicImages: formattedImages,
      publishedAt: published ? new Date() : null,
    });

    const populated = await Listing.findById(newListing._id)
      .populate({
        path: "property",
        populate: [
          { path: "vendor", select: "name companyName phone email" },
          { path: "broker", select: "name phone email companyName" },
        ],
      })
      .lean();

    res.status(201).json({ success: true, data: normalizeAdmin(populated) });
  } catch (err) {
    console.error("[CRM Listing] createListing error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to create listing" });
  }
};

// PUT /api/crm/listings/:id (Admin)
export const updateListing = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.published && !updates.publishedAt) {
      updates.publishedAt = new Date();
    }

    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate({
        path: "property",
        populate: [
          { path: "vendor", select: "name companyName phone email" },
          { path: "broker", select: "name phone email companyName" },
        ],
      })
      .lean();

    if (!updated) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    res.json({ success: true, data: normalizeAdmin(updated) });
  } catch (err) {
    console.error("[CRM Listing] updateListing error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to update listing" });
  }
};

// DELETE /api/crm/listings/:id (Admin soft delete/archive)
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "archived", published: false } },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    res.json({ success: true, message: "Listing archived", id: req.params.id });
  } catch (err) {
    console.error("[CRM Listing] deleteListing error:", err);
    res.status(500).json({ success: false, message: "Failed to delete listing" });
  }
};

// GET /api/crm/listings/public (Public client)
export const getPublicListings = async (req, res) => {
  try {
    const { city, locality, propertyType, minPrice, maxPrice, bedrooms, intent } = req.query;

    const query = {
      published: true,
      status: "active",
    };

    if (intent && ["sale", "rent"].includes(intent.toLowerCase())) {
      query.listingType = intent.toLowerCase();
    }

    const listings = await Listing.find(query)
      .populate({
        path: "property",
        populate: [
          { path: "vendor", select: "name companyName phone email" },
          { path: "broker", select: "name phone email companyName" },
        ],
      })
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    // Filter by property-level attributes
    const filtered = listings.filter((l) => {
      const p = l.property;
      if (!p) return false;
      if (city && !new RegExp(city, "i").test(p.city || "")) return false;
      if (locality && !new RegExp(locality, "i").test(p.locality || "")) return false;
      if (propertyType && propertyType !== "ALL" && p.propertyType !== propertyType) return false;
      if (bedrooms && p.bedrooms !== Number(bedrooms)) return false;

      const price = l.listedPrice || p.price || 0;
      if (minPrice && price < Number(minPrice)) return false;
      if (maxPrice && price > Number(maxPrice)) return false;

      return true;
    });

    const formatted = filtered.map(formatForPublicClient);

    res.json({ success: true, data: formatted, properties: formatted });
  } catch (err) {
    console.error("[CRM Listing Public] error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch public listings" });
  }
};

// GET /api/crm/listings/public/:id (Public single listing by ID or Slug)
export const getPublicListingById = async (req, res) => {
  try {
    const { id } = req.params;
    let listing = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      listing = await Listing.findById(id)
        .populate({
          path: "property",
          populate: [
            { path: "vendor", select: "name companyName phone email" },
            { path: "broker", select: "name phone email companyName" },
          ],
        })
        .lean();
    }

    if (!listing) {
      listing = await Listing.findOne({ slug: id })
        .populate({
          path: "property",
          populate: [
            { path: "vendor", select: "name companyName phone email" },
            { path: "broker", select: "name phone email companyName" },
          ],
        })
        .lean();
    }

    if (!listing) {
      // Also fallback to find by Property ObjectId if passed
      if (mongoose.Types.ObjectId.isValid(id)) {
        listing = await Listing.findOne({ property: id })
          .populate({
            path: "property",
            populate: [
              { path: "vendor", select: "name companyName phone email" },
              { path: "broker", select: "name phone email companyName" },
            ],
          })
          .lean();
      }
    }

    if (!listing) {
      return res.status(404).json({ success: false, message: "Property listing not found" });
    }

    const formatted = formatForPublicClient(listing);
    res.json({ success: true, data: formatted, property: formatted });
  } catch (err) {
    console.error("[CRM Listing Public Single] error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch property details" });
  }
};
