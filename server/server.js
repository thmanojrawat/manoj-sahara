import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import { clerkMiddleware } from "@clerk/express";

import clerkWebhooks from "./controllers/clerkWebhooks.js";
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

import userRouter from "./routes/userRoute.js";
import agencyRouter from "./routes/agencyRoute.js";
import propertyRouter from "./routes/propertyRoute.js";
import bookingRouter from "./routes/bookingRoute.js";

import crmVendorRouter from "./routes/crmVendorRoute.js";
import crmBrokerRouter from "./routes/crmBrokerRoute.js";
import crmPropertyRouter from "./routes/crmPropertyRoute.js";
import crmListingRouter from "./routes/crmListingRoute.js";
import crmLeadRouter from "./routes/crmLeadRoute.js";
import crmBookingRouter from "./routes/crmBookingRoute.js";
import crmClientRouter from "./routes/crmClientRoute.js";

import feedbackRouter from "./routes/feedbackRoute.js";

const app = express();

/* =========================
   CORS
========================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://100.115.190.13:5173",
  "http://100.115.190.13:5174",
  "http://100.115.190.13:5175",
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

/* =========================
   TEST API
========================= */

app.get("/", (req, res) => {
  res.status(200).send("API successfully connected");
});

/* =========================
   STRIPE WEBHOOK
   Must be before express.json()
========================= */

app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

/* =========================
   JSON BODY PARSER
========================= */

app.use(express.json());

/* =========================
   CLERK MIDDLEWARE
========================= */

app.use(clerkMiddleware());

/* =========================
   CLERK WEBHOOK
========================= */

app.use("/api/clerk", clerkWebhooks);

/* =========================
   CLIENT APIs
========================= */

app.use("/api/user", userRouter);
app.use("/api/agencies", agencyRouter);
app.use("/api/properties", propertyRouter);
app.use("/api/bookings", bookingRouter);

/* =========================
   CRM APIs
========================= */

app.use("/api/crm/vendors", crmVendorRouter);
app.use("/api/crm/brokers", crmBrokerRouter);
app.use("/api/crm/properties", crmPropertyRouter);
app.use("/api/crm/listings", crmListingRouter);
app.use("/api/crm/leads", crmLeadRouter);
app.use("/api/crm/bookings", crmBookingRouter);
app.use("/api/crm/clients", crmClientRouter);

/* =========================
   FEEDBACK
========================= */

app.use("/api/feedback", feedbackRouter);

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

/* =========================
   DATABASE
========================= */

try {
  await connectDB();
  console.log("Database initialization completed");
} catch (error) {
  console.error("Database initialization failed:", error.message);
}

/* =========================
   CLOUDINARY
========================= */

try {
  await connectCloudinary();
  console.log("Cloudinary initialization completed");
} catch (error) {
  console.error("Cloudinary initialization failed:", error.message);
}

/* =========================
   LOCAL DEVELOPMENT
========================= */

if (process.env.VERCEL !== "1") {
  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

/* =========================
   VERCEL
========================= */

export default app;