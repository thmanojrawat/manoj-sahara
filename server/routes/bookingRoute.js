import express from "express";

import {
  bookingCreate,
  bookingStripePayment,
  checkBookingAvailability,
  getAgencyBookings,
  getUserBookings,
} from "../controllers/bookingController.js";

import { authUser } from "../middleware/authMiddleware.js";

const bookingRouter = express.Router();

// Check property availability
bookingRouter.post(
  "/check-availability",
  checkBookingAvailability
);

// Create booking
bookingRouter.post(
  "/book",
  authUser,
  bookingCreate
);

// Get user's bookings
bookingRouter.get(
  "/user",
  authUser,
  getUserBookings
);

// Get agency bookings
bookingRouter.get(
  "/agency",
  authUser,
  getAgencyBookings
);

// Stripe payment
bookingRouter.post(
  "/stripe",
  authUser,
  bookingStripePayment
);

export default bookingRouter;