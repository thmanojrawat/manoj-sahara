import User from "../models/User.js";
import { clerkClient } from "@clerk/express";

export const authUser = async (req, res, next) => {
  try {
    const authData = typeof req.auth === "function" ? req.auth() : req.auth;
    const userId = authData?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Please sign in.",
      });
    }

    let user = await User.findById(userId);

    if (!user) {
      // Auto-sync user from Clerk if webhook was missed
      try {
        const clerkUser = await clerkClient.users.getUser(userId);
        if (clerkUser) {
          const primaryEmail = clerkUser.emailAddresses?.[0]?.emailAddress || `${userId}@user.clerk`;
          const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || "Customer";
          user = await User.create({
            _id: userId,
            email: primaryEmail,
            username: fullName,
            image: clerkUser.imageUrl || "",
            role: "user",
          });
        }
      } catch (clerkErr) {
        console.warn("[Auth Middleware] Clerk user auto-sync notice:", clerkErr.message);
        // Create basic placeholder so authenticated request can proceed
        user = await User.create({
          _id: userId,
          email: `${userId}@user.clerk`,
          username: "Customer",
          image: "",
          role: "user",
        }).catch(() => User.findById(userId));
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User identity could not be verified",
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.log("AUTH ERROR:", error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export default authUser;