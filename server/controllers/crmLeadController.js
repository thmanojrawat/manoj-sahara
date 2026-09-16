import mongoose from "mongoose";
import Lead from "../models/Lead.js";
import Client from "../models/Client.js";

/** Normalize lead doc for CRM Leads table */
const normalize = (doc) => {
  const obj = doc && typeof doc.toObject === "function" ? doc.toObject({ virtuals: false }) : { ...doc };
  if (obj._id) {
    obj.id = obj._id.toString();
    delete obj._id;
  }
  delete obj.__v;

  obj.requirement = obj.requirement || obj.message || "Property Enquiry";
  obj.budget = obj.budget || 0;
  obj.preferredLocation = obj.preferredLocation || (obj.property?.locality || "New Town");
  obj.propertyType = obj.propertyType || (obj.property?.propertyType || "Apartment");
  obj.assignedBrokerName = obj.assignedBroker?.name || "Assigned Agent";
  obj.assignedBrokerId = obj.assignedBroker?._id ? obj.assignedBroker._id.toString() : (obj.assignedBroker?.toString() || "");
  obj.createdDate = obj.createdAt ? new Date(obj.createdAt).toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB");
  obj.lastContact = obj.updatedAt ? new Date(obj.updatedAt).toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB");
  obj.nextFollowUp = obj.nextFollowUp || "Scheduled";
  obj.priority = obj.priority || "High";
  obj.status = obj.status || "New";

  return obj;
};

// GET /api/crm/leads
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ isDeleted: { $ne: true } })
      .populate("property", "title propertyType price locality city")
      .populate("listing", "title slug listedPrice")
      .populate("assignedBroker", "name phone email companyName")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: leads.map(normalize) });
  } catch (err) {
    console.error("[CRM Lead] getLeads error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch leads" });
  }
};

// GET /api/crm/leads/:id
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true },
    })
      .populate("property", "title propertyType price locality city")
      .populate("listing", "title slug listedPrice")
      .populate("assignedBroker", "name phone email companyName")
      .lean();

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.json({ success: true, data: normalize(lead) });
  } catch (err) {
    console.error("[CRM Lead] getLeadById error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch lead" });
  }
};

// POST /api/crm/leads (Works for both public enquiry and CRM admin)
export const createLead = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      source,
      message,
      requirement,
      budget,
      propertyType,
      preferredLocation,
      property,
      listing,
      assignedBroker,
      assignedBrokerId,
      priority,
      status,
      notes,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: "Name and phone are required" });
    }

    const resolvedBrokerId =
      assignedBroker ||
      assignedBrokerId ||
      (mongoose.Types.ObjectId.isValid(req.body.broker) ? req.body.broker : null);

    const resolvedPropertyId =
      property && mongoose.Types.ObjectId.isValid(property) ? property : null;
    const resolvedListingId =
      listing && mongoose.Types.ObjectId.isValid(listing) ? listing : null;

    // Create the Lead record
    const lead = await Lead.create({
      name,
      phone,
      email: email || null,
      source: source || "Website Inquiry",
      message: message || null,
      requirement: requirement || message || "Property Inquiry from Website",
      budget: budget ? Number(budget) : null,
      propertyType: propertyType || null,
      preferredLocation: preferredLocation || null,
      property: resolvedPropertyId,
      listing: resolvedListingId,
      assignedBroker: resolvedBrokerId,
      priority: priority || "High",
      status: status || "New",
      notes: notes || null,
      isDeleted: false,
    });

    // Step 9: Upsert Client in MongoDB if phone or email provided
    try {
      const existingClient = await Client.findOne({
        $or: [
          { phone: phone.trim() },
          ...(email ? [{ email: email.trim().toLowerCase() }] : []),
        ],
      });

      if (!existingClient) {
        await Client.create({
          name,
          phone: phone.trim(),
          email: email ? email.trim().toLowerCase() : null,
          source: "website",
          requirementNotes: requirement || message || "Inquired via website",
          budget: { min: 0, max: budget ? Number(budget) : null },
          interestedIn: "buy",
          status: "active",
          notes: `Created from inquiry Lead ${lead._id}`,
        });
      } else {
        // Update client notes
        existingClient.requirementNotes =
          requirement || message || existingClient.requirementNotes;
        await existingClient.save();
      }
    } catch (clientErr) {
      console.error("[CRM Lead] Client upsert notice:", clientErr.message);
    }

    const populated = await Lead.findById(lead._id)
      .populate("property", "title propertyType price locality city")
      .populate("listing", "title slug listedPrice")
      .populate("assignedBroker", "name phone email companyName")
      .lean();

    res.status(201).json({ success: true, data: normalize(populated), message: "Enquiry submitted successfully" });
  } catch (err) {
    console.error("[CRM Lead] createLead error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to create lead" });
  }
};

// PUT /api/crm/leads/:id
export const updateLead = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.assignedBrokerId) updates.assignedBroker = updates.assignedBrokerId;

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate("property", "title propertyType price locality city")
      .populate("listing", "title slug listedPrice")
      .populate("assignedBroker", "name phone email companyName")
      .lean();

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.json({ success: true, data: normalize(lead) });
  } catch (err) {
    console.error("[CRM Lead] updateLead error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to update lead" });
  }
};

// DELETE /api/crm/leads/:id (soft delete)
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.json({ success: true, message: "Lead soft-deleted", id: req.params.id });
  } catch (err) {
    console.error("[CRM Lead] deleteLead error:", err);
    res.status(500).json({ success: false, message: "Failed to delete lead" });
  }
};
