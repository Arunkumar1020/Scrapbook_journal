import { Routes, Route, Navigate } from "react-router-dom";

import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/user/Dashboard";
import CreateJournal from "../pages/user/CreateJournal";
import EditJournal from "../pages/user/EditJournal";
import JournalDetails from "../pages/user/JournalDetails";
import Profile from "../pages/user/Profile";
import MfaSettings from "../pages/user/MfaSettings";
import PrivacyRequestCenter from "../pages/user/PrivacyRequestCenter";

import JournalManagement from "../pages/admin/JournalManagement";
import ComplianceHub from "../pages/admin/ComplianceHub";
import PrivacyRequestsAdmin from "../pages/admin/PrivacyRequestsAdmin";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminRoute from "../components/auth/AdminRoute";

import PrivacyPolicy from "../pages/legal/PrivacyPolicy";
import DataRetentionPolicy from "../pages/legal/DataRetentionPolicy";
import IncidentResponsePlan from "../pages/legal/IncidentResponsePlan";
import SecurityPolicy from "../pages/legal/SecurityPolicy";
import TermsAndConditions from "../pages/legal/TermsAndConditions";
import ComplianceCenter from "../pages/legal/ComplianceCenter";
import CookiePolicy from "../pages/legal/CookiePolicy";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/cookies" element={<CookiePolicy />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/security" element={<SecurityPolicy />} />
      <Route
        path="/data-retention"
        element={<DataRetentionPolicy />}
      />
      <Route
        path="/incident-response"
        element={<IncidentResponsePlan />}
      />
      <Route
        path="/compliance"
        element={<ComplianceCenter />}
      />

      {/* User Routes */}
      <Route
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />

        <Route
          path="/journals/create"
          element={<CreateJournal />}
        />

        <Route
          path="/journals/edit/:id"
          element={<EditJournal />}
        />

        <Route
          path="/journals/:id"
          element={<JournalDetails />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/mfa-settings"
          element={<MfaSettings />}
        />

        <Route
          path="/privacy-requests"
          element={<PrivacyRequestCenter />}
        />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<ComplianceHub />}
        />

        <Route
          path="compliance"
          element={<ComplianceHub />}
        />

        <Route
          path="journals"
          element={<JournalManagement />}
        />

        <Route
          path="privacy-requests"
          element={<PrivacyRequestsAdmin />}
        />
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;