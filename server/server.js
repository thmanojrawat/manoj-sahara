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

await connectDB();
await connectCloudinary();

const app = express();

/* CORS */
app.use(
  cors({
    origin: "http://localhost:5173",
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

/* API routes */
app.use("/api/user", userRouter);
app.use("/api/agencies", agencyRouter);
app.use("/api/properties", propertyRouter);
app.use("/api/bookings", bookingRouter);

/* Test API */
app.get("/", (req, res) => {
  res.send("API successfully connected");
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});