import Client from "../models/Client.js";
import AdminUser from "../models/AdminUser.js";

/** Normalize Client doc for CRM Clients table */
const normalize = (doc) => {
  const obj = doc && typeof doc.toObject === "function" ? doc.toObject({ virtuals: false }) : { ...doc };
  if (obj._id) {
    obj.id = obj._id.toString();
    delete obj._id;
  }
  delete obj.__v;

  obj.budget = typeof obj.budget === "object" && obj.budget !== null ? (obj.budget.max || 0) : (obj.budget || 0);
  obj.requirement = obj.requirement || obj.requirementNotes || "Property Acquisition";
  obj.preferredLocations = obj.preferredLocations || [obj.locality || obj.city || "New Town"].filter(Boolean);
  obj.assignedBrokerName = obj.assignedTo?.name || obj.assignedBrokerName || "Assigned Agent";
  obj.assignedBrokerId = obj.assignedTo?._id ? obj.assignedTo._id.toString() : (obj.assignedBrokerId || "");
  obj.status = obj.status ? obj.status.charAt(0).toUpperCase() + obj.status.slice(1).toLowerCase() : "Active";
  obj.totalPaid = obj.totalPaid || 0;
  obj.totalBookings = obj.totalBookings || 0;
  obj.totalDeals = obj.totalDeals || 0;
  obj.lastInteraction = obj.updatedAt ? new Date(obj.updatedAt).toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB");
  obj.nextFollowUp = obj.nextFollowUp || "Scheduled";

  return obj;
};

// GET /api/crm/clients
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find({ status: { $ne: "lost" } })
      .populate("assignedTo", "name phone email")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: clients.map(normalize) });
  } catch (err) {
    console.error("[CRM Client] getClients error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch clients" });
  }
};

// GET /api/crm/clients/:id
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate("assignedTo", "name phone email")
      .lean();

    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    res.json({ success: true, data: normalize(client) });
  } catch (err) {
    console.error("[CRM Client] getClientById error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch client" });
  }
};

// POST /api/crm/clients
export const createClient = async (req, res) => {
  try {
    const { name, phone, email, requirement, budget, preferredLocation, city, locality, address, status, notes } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: "Name and phone are required" });
    }

    const client = await Client.create({
      name,
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : null,
      city: city || "Kolkata",
      locality: locality || preferredLocation || null,
      address: address || null,
      requirementNotes: requirement || null,
      budget: { min: 0, max: budget ? Number(budget) : null },
      status: status ? status.toLowerCase() : "active",
      notes: notes || null,
    });

    res.status(201).json({ success: true, data: normalize(client) });
  } catch (err) {
    console.error("[CRM Client] createClient error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to create client" });
  }
};

// PUT /api/crm/clients/:id
export const updateClient = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.requirement) updates.requirementNotes = updates.requirement;
    if (updates.budget !== undefined) {
      updates.budget = { min: 0, max: Number(updates.budget) };
    }
    if (updates.status) updates.status = updates.status.toLowerCase();

    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate("assignedTo", "name phone email")
      .lean();

    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    res.json({ success: true, data: normalize(client) });
  } catch (err) {
    console.error("[CRM Client] updateClient error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to update client" });
  }
};

// DELETE /api/crm/clients/:id
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "inactive" } },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    res.json({ success: true, message: "Client marked inactive", id: req.params.id });
  } catch (err) {
    console.error("[CRM Client] deleteClient error:", err);
    res.status(500).json({ success: false, message: "Failed to delete client" });
  }
};
