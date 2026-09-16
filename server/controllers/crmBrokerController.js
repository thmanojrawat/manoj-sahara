import Broker from "../models/Broker.js";

/** Normalize a Mongoose doc or lean object → plain object with id instead of _id */
const normalize = (doc) => {
  const obj = doc && typeof doc.toObject === "function" ? doc.toObject({ virtuals: false }) : { ...doc };
  if (obj._id) {
    obj.id = obj._id.toString();
    delete obj._id;
  }
  delete obj.__v;

  // Compatibility fields for CRM Brokers UI
  obj.specializedAreas =
    obj.specializedAreas ||
    (Array.isArray(obj.specialization) && obj.specialization.length > 0
      ? obj.specialization
      : [obj.locality || "New Town", "Kolkata"].filter(Boolean));
  obj.role = obj.role || "Real Estate Consultant";
  obj.type = obj.type || "Channel Partner";
  obj.avatar =
    obj.avatar ||
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80";
  obj.revenueGenerated = obj.revenueGenerated || 0;
  obj.dealsClosed = obj.dealsClosed || 0;
  obj.commissionEarned = obj.commissionEarned || 0;
  obj.commissionPending = obj.commissionPending || 0;
  obj.siteVisitsConducted = obj.siteVisitsConducted || 0;
  obj.commissionRate = obj.commissionRate || 2.0;
  obj.rating = obj.rating || 4.8;
  obj.status = obj.status
    ? obj.status.charAt(0).toUpperCase() + obj.status.slice(1).toLowerCase()
    : "Active";

  return obj;
};

// GET /api/crm/brokers
export const getBrokers = async (req, res) => {
  try {
    const brokers = await Broker.find({ isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: brokers.map(normalize) });
  } catch (err) {
    console.error("[CRM Broker] getBrokers error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch brokers" });
  }
};

// GET /api/crm/brokers/:id
export const getBrokerById = async (req, res) => {
  try {
    const broker = await Broker.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true },
    }).lean();

    if (!broker) {
      return res.status(404).json({ success: false, message: "Broker not found" });
    }

    res.json({ success: true, data: normalize(broker) });
  } catch (err) {
    console.error("[CRM Broker] getBrokerById error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch broker" });
  }
};

// POST /api/crm/brokers
export const createBroker = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      companyName,
      specialization,
      specializedAreas,
      city,
      locality,
      experience,
      status,
      notes,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: "Name and phone are required" });
    }

    const resolvedSpecialization =
      specialization || specializedAreas || [locality || "Kolkata"];

    const broker = await Broker.create({
      name,
      phone,
      email: email || null,
      companyName: companyName || null,
      specialization: Array.isArray(resolvedSpecialization) ? resolvedSpecialization : [resolvedSpecialization],
      city: city || "Kolkata",
      locality: locality || null,
      experience: experience ? Number(experience) : 0,
      status: status ? status.toLowerCase() : "active",
      notes: notes || null,
      isDeleted: false,
    });

    res.status(201).json({ success: true, data: normalize(broker) });
  } catch (err) {
    console.error("[CRM Broker] createBroker error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to create broker" });
  }
};

// PUT /api/crm/brokers/:id
export const updateBroker = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.specializedAreas && !updates.specialization) {
      updates.specialization = updates.specializedAreas;
    }
    if (updates.status) {
      updates.status = updates.status.toLowerCase();
    }

    const broker = await Broker.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!broker) {
      return res.status(404).json({ success: false, message: "Broker not found" });
    }

    res.json({ success: true, data: normalize(broker) });
  } catch (err) {
    console.error("[CRM Broker] updateBroker error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to update broker" });
  }
};

// DELETE /api/crm/brokers/:id (soft delete)
export const deleteBroker = async (req, res) => {
  try {
    const broker = await Broker.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!broker) {
      return res.status(404).json({ success: false, message: "Broker not found" });
    }

    res.json({ success: true, message: "Broker soft-deleted", id: req.params.id });
  } catch (err) {
    console.error("[CRM Broker] deleteBroker error:", err);
    res.status(500).json({ success: false, message: "Failed to delete broker" });
  }
};
