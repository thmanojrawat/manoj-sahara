import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Login from '../pages/Login/Login.jsx';

// Pages
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import AiAssistant from '../pages/AiAssistant/AiAssistant.jsx';
import Properties from '../pages/Properties/Properties.jsx';
import Leads from '../pages/Leads/Leads.jsx';
import Clients from '../pages/Clients/Clients.jsx';
import Brokers from '../pages/Brokers/Brokers.jsx';
import FollowUps from '../pages/FollowUps/FollowUps.jsx';
import SiteVisits from '../pages/SiteVisits/SiteVisits.jsx';
import Appointments from '../pages/Appointments/Appointments.jsx';
import Projects from '../pages/Inventory/Projects.jsx';
import BuildingsFloors from '../pages/Inventory/BuildingsFloors.jsx';
import Units from '../pages/Inventory/Units.jsx';
import InventoryOverview from '../pages/Inventory/InventoryOverview.jsx';
import Deals from '../pages/Sales/Deals.jsx';
import Bookings from '../pages/Sales/Bookings.jsx';
import Payments from '../pages/Sales/Payments.jsx';
import Commissions from '../pages/Sales/Commissions.jsx';
import Tenancies from '../pages/Rentals/Tenancies.jsx';
import Agreements from '../pages/Rentals/Agreements.jsx';
import Vendors from '../pages/Vendors/Vendors.jsx';
import Locations from '../pages/Catalog/Locations.jsx';
import Amenities from '../pages/Catalog/Amenities.jsx';
import Reports from '../pages/Analytics/Reports.jsx';
import Users from '../pages/System/Users.jsx';
import Roles from '../pages/System/Roles.jsx';
import Notifications from '../pages/System/Notifications.jsx';
import ActivityLogs from '../pages/System/ActivityLogs.jsx';
import Trash from '../pages/System/Trash.jsx';
import Settings from '../pages/System/Settings.jsx';
import MyAccount from '../pages/System/MyAccount.jsx';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public route — accessible without authentication */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes — redirect to /login if not authenticated */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="ai-assistant" element={<AiAssistant />} />

          {/* CRM */}
          <Route path="properties" element={<Properties />} />
          <Route path="leads" element={<Leads />} />
          <Route path="clients" element={<Clients />} />
          <Route path="brokers" element={<Brokers />} />
          <Route path="follow-ups" element={<FollowUps />} />
          <Route path="site-visits" element={<SiteVisits />} />
          <Route path="appointments" element={<Appointments />} />

          {/* Inventory */}
          <Route path="projects" element={<Projects />} />
          <Route path="buildings-floors" element={<BuildingsFloors />} />
          <Route path="units" element={<Units />} />
          <Route path="inventory" element={<InventoryOverview />} />

          {/* Sales */}
          <Route path="deals" element={<Deals />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="payments" element={<Payments />} />
          <Route path="commissions" element={<Commissions />} />

          {/* Rentals */}
          <Route path="tenancies" element={<Tenancies />} />
          <Route path="agreements" element={<Agreements />} />

          {/* Catalog */}
          <Route path="vendors" element={<Vendors />} />
          <Route path="locations" element={<Locations />} />
          <Route path="amenities" element={<Amenities />} />

          {/* Analytics */}
          <Route path="reports" element={<Reports />} />

          {/* System */}
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="activity-logs" element={<ActivityLogs />} />
          <Route path="trash" element={<Trash />} />
          <Route path="settings" element={<Settings />} />
          <Route path="my-account" element={<MyAccount />} />

          {/* Fallback within protected layout */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>

      {/* Global fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
