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

await connectDB();
await connectCloudinary();

const app = express();

// /* CORS — allow client website and admin CRM dev server */
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173", // client website
//       "http://localhost:5174", // admin CRM (primary)
//       "http://localhost:5175", // admin CRM (fallback when 5174 in use)
//     ],
//     credentials: true,
//   })
// );
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://100.115.190.13:5173",
  "http://100.115.190.13:5174",
  "http://100.115.190.13:5175",
];
// Add production client URL from env if provided
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
/*
  Stripe webhook
  IMPORTANT:
  This must come before express.json()
*/
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

/* JSON body parser */
app.use(express.json());

/* Clerk middleware */
app.use(clerkMiddleware());

/* Clerk webhook */
app.use("/api/clerk", clerkWebhooks);

/* API routes — existing client website */
app.use("/api/user", userRouter);
app.use("/api/agencies", agencyRouter);
app.use("/api/properties", propertyRouter);
app.use("/api/bookings", bookingRouter);

/* CRM API routes */
app.use("/api/crm/vendors", crmVendorRouter);
app.use("/api/crm/brokers", crmBrokerRouter);
app.use("/api/crm/properties", crmPropertyRouter);
app.use("/api/crm/listings", crmListingRouter);
app.use("/api/crm/leads", crmLeadRouter);
app.use("/api/crm/bookings", crmBookingRouter);
app.use("/api/crm/clients", crmClientRouter);
app.use("/api/feedback", feedbackRouter);

/* Test API */
app.get("/", (req, res) => {
  res.send("API successfully connected");
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});