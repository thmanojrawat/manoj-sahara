# SAHARA Enterprise Real Estate CRM & ERP

A proprietary, high-density internal Real Estate Management Platform for **SAHARA Infra-Realty Private Limited**, focused on the Kolkata metropolitan market (New Town, Salt Lake Sector V, Rajarhat, EM Bypass, Ballygunge, Alipore).

---

## Architecture Highlights

1. **Clean Frontend Isolation**: Built as a standalone React 19 + Vite 6 + Tailwind CSS v4 single-page application inside `admin/`. Zero changes made to `client/` or `server/`.
2. **API-Ready Service Layer**: All operations route through `src/services/*` (Axios base instance in `src/services/api.js`). Currently runs against reactive, relational local storage; toggles to `server/` via `VITE_BACKEND_URL` without UI rewrites.
3. **Kolkata Micro-Market Focus**: Localized currency in Indian denominations (`₹ Lac`, `₹ Cr`), `DD/MM/YYYY` dates, and authentic micro-markets (New Town Action Area I/II/III, Sector V IT Hub, etc.).
4. **Relational Data & Reactive State**:
   - `Lead` -> `Client` -> `Deal` -> `Booking` -> `Payment` -> `Commission`
   - Allotting a unit marks it as `Booked` in the inventory matrix; cancelling a booking returns it to `Available`.
   - Recording payments updates the booking ledger balance and changes payment status.
   - Recording site visits syncs with the company appointments calendar.
5. **System Governance**: Role-based access control (RBAC), audit activity trail, soft delete with Trash restoration, and dark/light mode toggle.
6. **Sahara AI Assistant**: Natural language query engine analyzing local inventory, broker leaderboards, overdue follow-ups, and pending payments.

---

## Quick Start Guide

### 1. Installation
```bash
cd admin
npm install
```

### 2. Development Server (Runs on port 5174)
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
```

---

## Route Directory

| Module | Route | Description |
| :--- | :--- | :--- |
| **Executive Dashboard** | `/` | Portfolio KPIs, Lead Funnel, Broker Leaderboard, Financial Milestones |
| **AI Assistant** | `/ai-assistant` | Natural language real-estate query assistant |
| **Properties** | `/properties` | Full CRUD, table/grid views, image galleries, status updates |
| **Leads** | `/leads` | Pipeline Kanban & table, lead qualification, Convert Lead -> Client |
| **Clients** | `/clients` | Client accounts, investment portfolios, linked bookings |
| **Brokers** | `/brokers` | Agent directory, Kolkata specializations, commission splits |
| **Follow-Ups** | `/follow-ups` | Today's, overdue, upcoming follow-ups with rescheduling |
| **Site Visits** | `/site-visits` | On-site inspections, escort agents, syncs with appointments |
| **Appointments** | `/appointments` | Legal consultations and showings calendar |
| **Projects** | `/projects` | Master developments, RERA registrations, absorption stats |
| **Buildings & Floors** | `/buildings-floors` | Physical towers, elevations, and typical floor plates |
| **Units Matrix** | `/units` | Available, Reserved, Booked, Sold, Blocked unit statuses |
| **Inventory Overview**| `/inventory` | Consolidated stock valuation and status distribution |
| **Deals Pipeline** | `/deals` | Sales negotiations across Kanban stages with probability |
| **Bookings** | `/bookings` | Unit allotments, token receipts, cancellation unit release |
| **Payments Ledger** | `/payments` | Financial ledger, receipt generation, overdue calculations |
| **Commissions** | `/commissions` | Broker payout tracking and dynamic commission calculations |
| **Tenancies** | `/tenancies` | Commercial/residential lease tracking, monthly rent, arrears |
| **Agreements** | `/agreements` | Registered legal deeds, lease contracts, and sale agreements |
| **Vendors** | `/vendors` | Asset owners and institutional landlords |
| **Locations** | `/locations` | Kolkata micro-market hierarchy & benchmark per-sq-ft rates |
| **Amenities** | `/amenities` | Standardized property amenity catalog |
| **Reports & BI** | `/reports` | Sales velocity, broker leaderboard, CSV export & print view |
| **Users** | `/users` | Staff directory and login tracking |
| **Roles & Permissions**| `/roles` | Enterprise RBAC matrix |
| **Notifications** | `/notifications` | Operational notification center |
| **Activity Logs** | `/activity-logs` | Tamper-evident system audit trail |
| **Trash** | `/trash` | Soft-deleted records with Restore and Permanent Purge |
| **Settings** | `/settings` | Corporate settings, RERA numbers, reset mock data |
| **My Account** | `/my-account` | User profile and color theme switcher |

---

## Connecting to the Existing Sahara Backend

When ready to connect to `server/`:
1. Set `VITE_ENABLE_MOCK_DATA="false"` in `admin/.env`.
2. Ensure `VITE_BACKEND_URL="http://localhost:4000/api"`.
3. In `server/server.js`, allow CORS for `http://localhost:5174` in addition to `5173`.
