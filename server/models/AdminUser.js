import mongoose from "mongoose";

/**
 * AdminUser
 * CRM staff accounts used for authentication and authorization.
 * Password is stored ONLY as a hash — never plain text.
 */

const ADMIN_ROLES = [
  "Super Admin",
  "Admin",
  "Sales Manager",
  "Agent",
  "Broker",
  "Accountant",
  "Property Manager",
  "Viewer",
];

const adminUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    // Hashed password — NEVER store plain text
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
      select: false, // excluded from query results by default
    },

    role: {
      type: String,
      enum: ADMIN_ROLES,
      default: "Agent",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },

    avatar: {
      type: String, // Cloudinary URL
      default: null,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// email is already indexed via unique: true
adminUserSchema.index({ role: 1 });
adminUserSchema.index({ status: 1 });

const AdminUser = mongoose.model("AdminUser", adminUserSchema);

export default AdminUser;
