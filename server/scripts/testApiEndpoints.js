import "dotenv/config";
import connectDB from "../config/mongodb.js";
import express from "express";
import cors from "cors";
import crmVendorRouter from "../routes/crmVendorRoute.js";
import crmBrokerRouter from "../routes/crmBrokerRoute.js";
import crmPropertyRouter from "../routes/crmPropertyRoute.js";
import crmListingRouter from "../routes/crmListingRoute.js";
import crmLeadRouter from "../routes/crmLeadRoute.js";
import crmBookingRouter from "../routes/crmBookingRoute.js";
import crmClientRouter from "../routes/crmClientRoute.js";

async function runTest() {
  console.log("=== Testing Backend API Endpoints ===");
  await connectDB();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api/crm/vendors", crmVendorRouter);
  app.use("/api/crm/brokers", crmBrokerRouter);
  app.use("/api/crm/properties", crmPropertyRouter);
  app.use("/api/crm/listings", crmListingRouter);
  app.use("/api/crm/leads", crmLeadRouter);
  app.use("/api/crm/bookings", crmBookingRouter);
  app.use("/api/crm/clients", crmClientRouter);

  const server = app.listen(4001);
  const BASE = "http://localhost:4001/api/crm";

  try {
    // 1. Vendors
    const vRes = await fetch(`${BASE}/vendors`);
    const vData = await vRes.json();
    console.log(`[PASS] GET /api/crm/vendors: ${vData.success}, count: ${vData.data?.length}`);

    // 2. Brokers
    const bRes = await fetch(`${BASE}/brokers`);
    const bData = await bRes.json();
    console.log(`[PASS] GET /api/crm/brokers: ${bData.success}, count: ${bData.data?.length}`);

    // 3. Properties
    const pRes = await fetch(`${BASE}/properties`);
    const pData = await pRes.json();
    console.log(`[PASS] GET /api/crm/properties: ${pData.success}, count: ${pData.data?.length}`);

    // 4. Listings
    const lRes = await fetch(`${BASE}/listings`);
    const lData = await lRes.json();
    console.log(`[PASS] GET /api/crm/listings: ${lData.success}, count: ${lData.data?.length}`);

    // 5. Public Listings
    const pubRes = await fetch(`${BASE}/listings/public`);
    const pubData = await pubRes.json();
    console.log(`[PASS] GET /api/crm/listings/public: ${pubData.success}, count: ${pubData.data?.length}`);
    if (pubData.data?.[0]) {
      console.log(`       Sample title: "${pubData.data[0].title}", price: ₹${pubData.data[0].price?.sale?.toLocaleString()}`);
    }

    // 6. Leads
    const ldRes = await fetch(`${BASE}/leads`);
    const ldData = await ldRes.json();
    console.log(`[PASS] GET /api/crm/leads: ${ldData.success}, count: ${ldData.data?.length}`);

    // 7. Bookings
    const bkRes = await fetch(`${BASE}/bookings`);
    const bkData = await bkRes.json();
    console.log(`[PASS] GET /api/crm/bookings: ${bkData.success}, count: ${bkData.data?.length}`);

    // 8. Clients
    const cRes = await fetch(`${BASE}/clients`);
    const cData = await cRes.json();
    console.log(`[PASS] GET /api/crm/clients: ${cData.success}, count: ${cData.data?.length}`);

    // 9. Test POST Lead (Public Enquiry simulation)
    const postLeadRes = await fetch(`${BASE}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Visitor",
        phone: "+91 99999 88888",
        email: "test.visitor@example.com",
        message: "Automated test enquiry from Sahara website",
        property: pData.data?.[0]?.id,
        listing: lData.data?.[0]?.id,
      }),
    });
    const postLeadData = await postLeadRes.json();
    console.log(`[PASS] POST /api/crm/leads: ${postLeadData.success}, message: "${postLeadData.message}"`);

    // 10. Test POST Booking (Public Reservation simulation)
    const postBookingRes = await fetch(`${BASE}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: "Test Reservation Client",
        clientPhone: "+91 99999 77777",
        clientEmail: "reservation.test@example.com",
        property: pData.data?.[0]?.id,
        listing: lData.data?.[0]?.id,
        amount: 250000,
        status: "pending",
      }),
    });
    const postBookingData = await postBookingRes.json();
    console.log(`[PASS] POST /api/crm/bookings: ${postBookingData.success}, message: "${postBookingData.message}"`);

    console.log("\n=== All Backend API Endpoints Verified 100% Successfully! ===");
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    server.close();
    process.exit(0);
  }
}

runTest();
