import express from "express";
import {
  getBrokers,
  getBrokerById,
  createBroker,
  updateBroker,
  deleteBroker,
} from "../controllers/crmBrokerController.js";

const router = express.Router();

router.get("/", getBrokers);
router.get("/:id", getBrokerById);
router.post("/", createBroker);
router.put("/:id", updateBroker);
router.delete("/:id", deleteBroker);

export default router;
