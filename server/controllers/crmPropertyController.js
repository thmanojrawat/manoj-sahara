import mongoose from "mongoose";
import CrmProperty from "../models/CrmProperty.js";
import Vendor from "../models/Vendor.js";
import Broker from "../models/Broker.js";

/** Normalize a CrmProperty doc or lean object for CRM Frontend */
const normalize = (doc) => {
  const obj = doc && typeof doc.toObject === "function" ? doc.toObject({ virtuals: false }) : { ...doc };
  if (obj._id) {
    obj.id = obj._id.toString();
    delete obj._id;
  }
  delete obj.__v;

  // Compatibility fields for CRM UI
  obj.type = obj.propertyType || "Apartment";
  obj.areaSqFt = obj.area || 0;
  obj.ownerId = obj.vendor?._id ? obj.vendor._id.toString() : (obj.vendor?.toString() || "");
  obj.ownerName = obj.vendor?.name || obj.ownerName || "Private Owner";
  obj.brokerId = obj.broker?._id ? obj.broker._id.toString() : (obj.broker?.toString() || "");
  obj.brokerName = obj.broker?.name || obj.brokerName || "Assigned Agent";
  obj.listingStatus = obj.published ? "Published" : "Draft";
  obj.status = obj.status === "available" ? "Active" : (obj.status ? obj.status.charAt(0).toUpperCase() + obj.status.slice(1) : "Active");
  obj.code = obj.code || `PROP-KOL-${obj.id.slice(-4).toUpperCase()}`;
  obj.category = obj.category || (obj.propertyType === "Commercial" || obj.propertyType === "Office" ? "Commercial" : "Residential");
  obj.purpose = obj.priceType === "rent" ? "Rent" : "Sale";
  obj.availability = obj.availability || "Ready to Move";
  obj.floor = obj.floor || 4;
  obj.totalFloors = obj.totalFloors || 18;
  obj.viewsCount = obj.viewsCount || 120;
  obj.inquiryCount = obj.inquiryCount || 12;

  // Format images as array of strings
  if (Array.isArray(obj.images)) {
    obj.images = obj.images.map((img) => (typeof img === "string" ? img : img?.url || ""));
  } else {
    obj.images = ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"];
  }

  return obj;
};

// GET /api/crm/properties
export const getProperties = async (req, res) => {
  try {
    const { city, locality, propertyType, status, minPrice, maxPrice, bedrooms, published } = req.query;

    const filter = { status: { $ne: "archived" } };

    if (city) filter.city = new RegExp(city, "i");
    if (locality) filter.locality = new RegExp(locality, "i");
    if (propertyType && propertyType !== "ALL") filter.propertyType = propertyType;
    if (status && status !== "ALL") {
      const normalizedStatus = status.toLowerCase() === "active" ? "available" : status.toLowerCase();
      filter.status = normalizedStatus;
    }
    if (bedrooms) filter.bedrooms = Number(bedrooms);
    if (published !== undefined) filter.published = published === "true";

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const properties = await CrmProperty.find(filter)
      .populate("vendor", "name companyName phone email")
      .populate("broker", "name phone email companyName")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: properties.map(normalize) });
  } catch (err) {
    console.error("[CRM Property] getProperties error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch properties" });
  }
};

// GET /api/crm/properties/:id
export const getPropertyById = async (req, res) => {
  try {
    const property = await CrmProperty.findById(req.params.id)
      .populate("vendor", "name companyName phone email")
      .populate("broker", "name phone email companyName")
      .lean();

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.json({ success: true, data: normalize(property) });
  } catch (err) {
    console.error("[CRM Property] getPropertyById error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch property" });
  }
};

// POST /api/crm/properties
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      propertyType,
      type,
      price,
      priceType,
      purpose,
      area,
      areaSqFt,
      areaUnit,
      bedrooms,
      bathrooms,
      parking,
      city,
      locality,
      address,
      landmark,
      pincode,
      furnishing,
      amenities,
      images,
      vendor,
      ownerId,
      broker,
      brokerId,
      status,
      published,
      listingStatus,
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    // Resolve and validate Vendor ObjectId
    const resolvedVendorId = vendor || ownerId;
    if (!resolvedVendorId || !mongoose.Types.ObjectId.isValid(resolvedVendorId)) {
      return res.status(400).json({
        success: false,
        message: "A valid MongoDB Vendor ObjectId is required for property owner",
      });
    }

    const vendorExists = await Vendor.findById(resolvedVendorId);
    if (!vendorExists) {
      return res.status(404).json({ success: false, message: "Vendor not found in database" });
    }

    // Resolve Broker ObjectId if provided
    let resolvedBrokerId = broker || brokerId || null;
    if (resolvedBrokerId) {
      if (!mongoose.Types.ObjectId.isValid(resolvedBrokerId)) {
        return res.status(400).json({
          success: false,
          message: "Provided Broker ID is not a valid MongoDB ObjectId",
        });
      }
      const brokerExists = await Broker.findById(resolvedBrokerId);
      if (!brokerExists) {
        resolvedBrokerId = null;
      }
    }

    // Resolve images
    let formattedImages = [];
    if (Array.isArray(images) && images.length > 0) {
      formattedImages = images.map((img) =>
        typeof img === "string" ? { url: img, isPrimary: false } : img
      );
      formattedImages[0].isPrimary = true;
    } else {
      formattedImages = [
        {
          url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
          isPrimary: true,
        },
      ];
    }

    const newProperty = await CrmProperty.create({
      title,
      description: description || `${title} located in ${locality || city || "Kolkata"}`,
      propertyType: propertyType || type || "Apartment",
      status: status?.toLowerCase() === "active" ? "available" : (status?.toLowerCase() || "available"),
      city: city || "Kolkata",
      locality: locality || null,
      address: address || null,
      landmark: landmark || null,
      pincode: pincode || null,
      price: price ? Number(price) : null,
      priceType: priceType || (purpose?.toLowerCase() === "rent" ? "rent" : "sale"),
      area: areaSqFt ? Number(areaSqFt) : null,
      areaUnit: areaUnit || "sqft",
      bedrooms: bedrooms ? Number(bedrooms) : null,
      bathrooms: bathrooms ? Number(bathrooms) : null,
      parking: parking ? Number(parking) : null,
      furnishing: furnishing || null,
      amenities: Array.isArray(amenities) ? amenities : [],
      images: formattedImages,
      vendor: resolvedVendorId,
      broker: resolvedBrokerId,
      published: published !== undefined ? published : (listingStatus === "Published"),
    });

    const populated = await CrmProperty.findById(newProperty._id)
      .populate("vendor", "name companyName phone email")
      .populate("broker", "name phone email companyName")
      .lean();

    res.status(201).json({ success: true, data: normalize(populated) });
  } catch (err) {
    console.error("[CRM Property] createProperty error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to create property" });
  }
};

// PUT /api/crm/properties/:id
export const updateProperty = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.type && !updates.propertyType) updates.propertyType = updates.type;
    if (updates.areaSqFt && !updates.area) updates.area = Number(updates.areaSqFt);
    if (updates.ownerId) updates.vendor = updates.ownerId;
    if (updates.brokerId) updates.broker = updates.brokerId;
    if (updates.listingStatus) updates.published = updates.listingStatus === "Published";
    if (updates.status) {
      updates.status = updates.status.toLowerCase() === "active" ? "available" : updates.status.toLowerCase();
    }

    if (updates.images && Array.isArray(updates.images)) {
      updates.images = updates.images.map((img) =>
        typeof img === "string" ? { url: img, isPrimary: false } : img
      );
    }

    const updated = await CrmProperty.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate("vendor", "name companyName phone email")
      .populate("broker", "name phone email companyName")
      .lean();

    if (!updated) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.json({ success: true, data: normalize(updated) });
  } catch (err) {
    console.error("[CRM Property] updateProperty error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to update property" });
  }
};

// DELETE /api/crm/properties/:id (soft delete/archive)
export const deleteProperty = async (req, res) => {
  try {
    const property = await CrmProperty.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "archived", published: false } },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.json({ success: true, message: "Property archived", id: req.params.id });
  } catch (err) {
    console.error("[CRM Property] deleteProperty error:", err);
    res.status(500).json({ success: false, message: "Failed to delete property" });
  }
};
