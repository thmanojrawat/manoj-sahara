import Vendor from '../models/Vendor.js';

/** Normalize a Mongoose doc or lean object → plain object with id instead of _id */
const normalize = (doc) => {
  const obj = doc && typeof doc.toObject === 'function' ? doc.toObject({ virtuals: false }) : { ...doc };
  if (obj._id) {
    obj.id = obj._id.toString();
    delete obj._id;
  }
  delete obj.__v;
  // Compatibility fields for CRM Vendors UI
  obj.company = obj.companyName || obj.company || '';
  obj.location = obj.location || [obj.locality, obj.city].filter(Boolean).join(', ') || obj.address || 'Kolkata';
  obj.propertyCount = obj.propertyCount || 0;
  obj.propertyValue = obj.propertyValue || 0;
  obj.agreementStatus = obj.agreementStatus || (obj.status === 'active' ? 'Active' : 'Inactive');
  if (obj.relationshipManager) {
    obj.relationshipManager = obj.relationshipManager.toString();
  }
  return obj;
};

// GET /api/crm/vendors
export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .lean();

    const normalized = vendors.map(normalize);

    res.json({ success: true, data: normalized });
  } catch (err) {
    console.error('[CRM Vendor] getVendors error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch vendors' });
  }
};

// GET /api/crm/vendors/:id
export const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true },
    });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    res.json({ success: true, data: normalize(vendor) });
  } catch (err) {
    console.error('[CRM Vendor] getVendorById error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch vendor' });
  }
};

// POST /api/crm/vendors
export const createVendor = async (req, res) => {
  try {
    const { name, companyName, company, phone, email, address, location, city, locality, notes, status } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required' });
    }

    const resolvedCompany = companyName || company || null;
    const resolvedAddress = address || location || null;
    const resolvedCity = city || (location && location.includes(',') ? location.split(',')[1].trim() : (city || 'Kolkata'));
    const resolvedLocality = locality || (location && location.includes(',') ? location.split(',')[0].trim() : (location || null));

    const vendor = await Vendor.create({
      name,
      companyName: resolvedCompany,
      phone,
      email: email || null,
      address: resolvedAddress,
      city: resolvedCity,
      locality: resolvedLocality,
      notes: notes || null,
      status: status || 'active',
    });

    res.status(201).json({ success: true, data: normalize(vendor) });
  } catch (err) {
    console.error('[CRM Vendor] createVendor error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to create vendor' });
  }
};

// PUT /api/crm/vendors/:id
export const updateVendor = async (req, res) => {
  try {
    const { name, companyName, company, phone, email, address, location, city, locality, notes, status } = req.body;

    const resolvedCompany = companyName !== undefined ? companyName : company;
    const resolvedAddress = address !== undefined ? address : location;

    const vendor = await Vendor.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      {
        $set: {
          ...(name !== undefined && { name }),
          ...(resolvedCompany !== undefined && { companyName: resolvedCompany }),
          ...(phone !== undefined && { phone }),
          ...(email !== undefined && { email }),
          ...(resolvedAddress !== undefined && { address: resolvedAddress }),
          ...(city !== undefined && { city }),
          ...(locality !== undefined && { locality }),
          ...(notes !== undefined && { notes }),
          ...(status !== undefined && { status }),
        },
      },
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    res.json({ success: true, data: normalize(vendor) });
  } catch (err) {
    console.error('[CRM Vendor] updateVendor error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to update vendor' });
  }
};

// DELETE /api/crm/vendors/:id  (soft-delete: marks isDeleted=true)
export const deleteVendor = async (req, res) => {
  try {
    // Soft-delete: we add an isDeleted flag rather than removing the document
    // This preserves referential integrity (Properties referencing this Vendor)
    const vendor = await Vendor.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    res.json({ success: true, message: 'Vendor soft-deleted', id: req.params.id });
  } catch (err) {
    console.error('[CRM Vendor] deleteVendor error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete vendor' });
  }
};
