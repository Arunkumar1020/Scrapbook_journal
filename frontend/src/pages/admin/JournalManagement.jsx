import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  getAdminStats,
  getAdminUsers,
  getAdminJournals,
  getAdminAuditLogs,
  updateAdminUserRole,
  deleteAdminUser,
} from "../../services/adminService";

function JournalManagement() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [journals, setJournals] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [activeTab, setActiveTab] = useState("users");
  const [searchText, setSearchText] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    try {
      setRefreshing(true);

      const [
        statsData,
        usersData,
        journalsData,
        auditLogsData,
      ] = await Promise.all([
        getAdminStats(),
        getAdminUsers(),
        getAdminJournals(),
        getAdminAuditLogs(),
      ]);

      setStats(statsData);
      setUsers(usersData);
      setJournals(journalsData);
      setAuditLogs(auditLogsData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load admin dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const filteredUsers = useMemo(() => {
    const text = searchText.toLowerCase();

    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(text) ||
        user.email?.toLowerCase().includes(text) ||
        user.role?.toLowerCase().includes(text)
    );
  }, [users, searchText]);

  const filteredJournals = useMemo(() => {
    const text = searchText.toLowerCase();

    return journals.filter(
      (journal) =>
        journal.title?.toLowerCase().includes(text) ||
        journal.content?.toLowerCase().includes(text) ||
        journal.user_name?.toLowerCase().includes(text) ||
        journal.user_email?.toLowerCase().includes(text)
    );
  }, [journals, searchText]);

  const filteredAuditLogs = useMemo(() => {
    const text = searchText.toLowerCase();

    return auditLogs.filter((log) => {
      const metadataText = JSON.stringify(log.metadata || {}).toLowerCase();

      return (
        log.action?.toLowerCase().includes(text) ||
        log.target_type?.toLowerCase().includes(text) ||
        log.actor_name?.toLowerCase().includes(text) ||
        log.actor_email?.toLowerCase().includes(text) ||
        metadataText.includes(text)
      );
    });
  }, [auditLogs, searchText]);

  function getActionBadgeClass(action) {
    if (action?.includes("LOGIN")) {
      return "bg-blue-50 text-blue-700";
    }

    if (action?.includes("REGISTER")) {
      return "bg-green-50 text-green-700";
    }

    if (action?.includes("DELETE")) {
      return "bg-red-50 text-red-700";
    }

    if (action?.includes("EXPORTED")) {
      return "bg-purple-50 text-purple-700";
    }

    if (action?.includes("ROLE")) {
      return "bg-yellow-50 text-yellow-700";
    }

    return "bg-slate-100 text-slate-700";
  }

  async function handleRoleChange(userId, role) {
    setActionLoadingId(userId);

    try {
      await updateAdminUserRole(userId, role);
      toast.success(`User role changed to ${role}`);
      await loadAdminData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user role");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDeleteUser(userId) {
    const confirmDelete = window.confirm(
      "Delete this user and all their journals?"
    );

    if (!confirmDelete) return;

    setActionLoadingId(userId);

    try {
      await deleteAdminUser(userId);
      toast.success("User deleted successfully");
      await loadAdminData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    } finally {
      setActionLoadingId(null);
    }
  }

  function handleTabChange(tab) {
    setActiveTab(tab);
    setSearchText("");
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-500">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 px-6 py-8 text-white sm:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-100 ring-1 ring-blue-300/30">
                  🛡️ Admin Control Center
                </span>

                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100 ring-1 ring-emerald-300/30">
                  ✅ Security Monitoring Enabled
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                ScrapBook Admin Dashboard
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Manage users, monitor journals, track image usage, and review
                privacy/security activity logs from one dashboard.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-slate-300">
                Logged in as
              </p>

              <h2 className="mt-1 text-lg font-bold text-white">
                {currentUser?.name || "Admin"}
              </h2>

              <p className="text-sm text-slate-300">
                {currentUser?.email}
              </p>

              <span className="mt-3 inline-flex rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-100 ring-1 ring-purple-300/30">
                {currentUser?.role || "admin"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 bg-slate-50 px-6 py-5 sm:grid-cols-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Users
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {stats?.totalUsers || 0}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Journals
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {stats?.totalJournals || 0}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Images
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {stats?.totalImages || 0}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Audit Events
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {auditLogs.length}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Management Panel
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review platform users, journals, and security activity.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          disabled={refreshing}
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTabChange("users")}
              className={
                activeTab === "users"
                  ? "rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200"
              }
            >
              Users ({users.length})
            </button>

            <button
              onClick={() => handleTabChange("journals")}
              className={
                activeTab === "journals"
                  ? "rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200"
              }
            >
              Journals ({journals.length})
            </button>

            <button
              onClick={() => handleTabChange("audit")}
              className={
                activeTab === "audit"
                  ? "rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200"
              }
            >
              Audit Logs ({auditLogs.length})
            </button>
          </div>

          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={
              activeTab === "users"
                ? "Search users by name, email, or role..."
                : activeTab === "journals"
                ? "Search journals by title, content, or owner..."
                : "Search audit logs by action, actor, or metadata..."
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 xl:max-w-md"
          />
        </div>
      </div>

      {activeTab === "users" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                User Management
              </h2>
              <p className="text-sm text-slate-500">
                Promote, demote, or remove users from the platform.
              </p>
            </div>

            <p className="text-sm font-medium text-slate-500">
              Showing {filteredUsers.length} of {users.length}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Email</th>
                  <th className="py-3 pr-4">Role</th>
                  <th className="py-3 pr-4">Journals</th>
                  <th className="py-3 pr-4">Created</th>
                  <th className="py-3 pr-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => {
                  const isCurrentUser = currentUser?.id === user.id;

                  return (
                    <tr key={user.id} className="border-b border-slate-100">
                      <td className="py-3 pr-4 font-medium text-slate-800">
                        {user.name}
                        {isCurrentUser && (
                          <span className="ml-2 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
                            You
                          </span>
                        )}
                      </td>

                      <td className="py-3 pr-4 text-slate-600">
                        {user.email}
                      </td>

                      <td className="py-3 pr-4">
                        <span
                          className={
                            user.role === "admin"
                              ? "rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700"
                              : "rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                          }
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="py-3 pr-4 text-slate-600">
                        {user.journal_count}
                      </td>

                      <td className="py-3 pr-4 text-slate-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>

                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-2">
                          {user.role === "admin" ? (
                            <button
                              disabled={
                                actionLoadingId === user.id || isCurrentUser
                              }
                              onClick={() =>
                                handleRoleChange(user.id, "user")
                              }
                              className="rounded-lg bg-yellow-50 px-3 py-2 text-xs font-semibold text-yellow-700 hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Demote
                            </button>
                          ) : (
                            <button
                              disabled={actionLoadingId === user.id}
                              onClick={() =>
                                handleRoleChange(user.id, "admin")
                              }
                              className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Promote
                            </button>
                          )}

                          <button
                            disabled={
                              actionLoadingId === user.id || isCurrentUser
                            }
                            onClick={() => handleDeleteUser(user.id)}
                            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "journals" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Journal Monitoring
              </h2>
              <p className="text-sm text-slate-500">
                Review journals created by all users.
              </p>
            </div>

            <p className="text-sm font-medium text-slate-500">
              Showing {filteredJournals.length} of {journals.length}
            </p>
          </div>

          <div className="grid gap-4">
            {filteredJournals.map((journal) => (
              <div
                key={journal.id}
                className="flex gap-4 rounded-xl border border-slate-200 p-4"
              >
                {journal.image_url ? (
                  <img
                    src={journal.image_url}
                    alt={journal.title}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400">
                    No Image
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900">
                    {journal.title}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {journal.content}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    By {journal.user_name || "Unknown"} •{" "}
                    {journal.user_email || "No email"} •{" "}
                    {new Date(journal.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}

            {filteredJournals.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                No journals found.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Audit Logs
              </h2>
              <p className="text-sm text-slate-500">
                Security and privacy activity for GDPR/DPDP monitoring.
              </p>
            </div>

            <p className="text-sm font-medium text-slate-500">
              Showing {filteredAuditLogs.length} of {auditLogs.length}
            </p>
          </div>

          <div className="grid gap-4">
            {filteredAuditLogs.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getActionBadgeClass(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>

                    <h3 className="mt-3 font-bold text-slate-900">
                      {log.actor_name || "System / Deleted User"}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {log.actor_email || "No actor email"}
                    </p>
                  </div>

                  <p className="text-xs font-medium text-slate-400">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-bold uppercase text-slate-500">
                      Target Type
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {log.target_type || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-bold uppercase text-slate-500">
                      Target ID
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {log.target_id || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-bold uppercase text-slate-500">
                      Actor ID
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {log.actor_user_id || "N/A"}
                    </p>
                  </div>
                </div>

                {log.metadata && (
                  <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                )}
              </div>
            ))}

            {filteredAuditLogs.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                No audit logs found.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default JournalManagement;