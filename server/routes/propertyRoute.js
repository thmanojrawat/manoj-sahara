import express from "express";
import { upload } from "../middleware/multer.js";
import { authUser } from "../middleware/authMiddleware.js";

import {
  createNewProperty,
  getAllAvailableProperties,
  getOwnerProperties,
  togglePropertyAvailability,
} from "../controllers/propertyController.js";

const propertyRouter = express.Router();

// Create property
propertyRouter.post(
  "/",
  upload.array("images", 4),
  authUser,
  createNewProperty
);

// Get all available properties
propertyRouter.get("/", getAllAvailableProperties);

// Get logged-in owner's properties
propertyRouter.get("/owner", authUser, getOwnerProperties);

// Toggle property availability
propertyRouter.post(
  "/toggle-availability",
  authUser,
  togglePropertyAvailability
);

export default propertyRouter;