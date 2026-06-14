import { Routes, Route } from "react-router-dom";

import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/user/Dashboard";
import CreateJournal from "../pages/user/CreateJournal";
import EditJournal from "../pages/user/EditJournal";
import JournalDetails from "../pages/user/JournalDetails";

import JournalManagement from "../pages/admin/JournalManagement";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/journals/create" element={<CreateJournal />} />
        <Route path="/journals/edit/:id" element={<EditJournal />} />
        <Route path="/journals/:id" element={<JournalDetails />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="journals" element={<JournalManagement />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;