import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  getBreachAnalytics,
  getBreachIncidents,
  createBreachIncident,
  updateBreachIncident,
} from "../../services/breachService";

function BreachManagement() {
  const [analytics, setAnalytics] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    severity: "LOW",
    status: "OPEN",
    affected_data: "",
    affected_user_count: 0,
    notification_required: false,
  });

  useEffect(() => {
    loadBreachData();
  }, []);

  async function loadBreachData() {
    try {
      const [analyticsData, incidentsData] = await Promise.all([
        getBreachAnalytics(),
        getBreachIncidents(),
      ]);

      setAnalytics(analyticsData);
      setIncidents(incidentsData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load breach data");
    } finally {
      setLoading(false);
    }
  }

  const filteredIncidents = useMemo(() => {
    const text = searchText.toLowerCase();

    return incidents.filter(
      (incident) =>
        incident.title?.toLowerCase().includes(text) ||
        incident.description?.toLowerCase().includes(text) ||
        incident.severity?.toLowerCase().includes(text) ||
        incident.status?.toLowerCase().includes(text) ||
        incident.affected_data?.toLowerCase().includes(text)
    );
  }, [incidents, searchText]);

  function severityClass(severity) {
    if (severity === "CRITICAL") return "bg-red-100 text-red-800";
    if (severity === "HIGH") return "bg-orange-100 text-orange-800";
    if (severity === "MEDIUM") return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  }

  function statusClass(status) {
    if (status === "OPEN") return "bg-red-50 text-red-700";
    if (status === "INVESTIGATING") return "bg-yellow-50 text-yellow-700";
    if (status === "NOTIFICATION_REQUIRED")
      return "bg-purple-50 text-purple-700";
    if (status === "NOTIFIED") return "bg-blue-50 text-blue-700";
    if (status === "RESOLVED") return "bg-green-50 text-green-700";
    return "bg-slate-100 text-slate-700";
  }

  async function handleCreateIncident(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Incident title is required");
      return;
    }

    setSaving(true);

    try {
      await createBreachIncident({
        ...form,
        affected_user_count: Number(form.affected_user_count || 0),
      });

      toast.success("Breach incident created");

      setForm({
        title: "",
        description: "",
        severity: "LOW",
        status: "OPEN",
        affected_data: "",
        affected_user_count: 0,
        notification_required: false,
      });

      await loadBreachData();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to create incident");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusUpdate(incidentId, status) {
    setSaving(true);

    try {
      await updateBreachIncident(incidentId, {
        status,
      });

      toast.success(`Incident marked as ${status}`);
      await loadBreachData();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update incident");
    } finally {
      setSaving(false);
    }
  }

  async function handleSeverityUpdate(incidentId, severity) {
    setSaving(true);

    try {
      await updateBreachIncident(incidentId, {
        severity,
      });

      toast.success(`Severity changed to ${severity}`);
      await loadBreachData();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update severity");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-500">Loading breach register...</p>
      </section>
    );
  }

  const analyticsCards = [
    ["📊", "Total Incidents", analytics?.totalIncidents || 0],
    ["🚨", "Open", analytics?.openIncidents || 0],
    ["🔎", "Investigating", analytics?.investigatingIncidents || 0],
    ["📢", "Notification Required", analytics?.notificationRequired || 0],
    ["📨", "Notified", analytics?.notifiedIncidents || 0],
    ["✅", "Resolved / Closed", analytics?.resolvedIncidents || 0],
    ["🔥", "Critical", analytics?.criticalIncidents || 0],
    ["⚠️", "High", analytics?.highIncidents || 0],
  ];

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Breach & Incident Register
        </h1>

        <p className="mt-2 text-slate-500">
          Track security incidents, breach notification requirements, and
          resolution status.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {analyticsCards.map(([icon, title, value]) => (
          <div
            key={title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">{icon}</span>
              <span className="text-3xl font-extrabold text-slate-900">
                {value}
              </span>
            </div>

            <h3 className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">
              {title}
            </h3>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Create New Incident
        </h2>

        <form
          onSubmit={handleCreateIncident}
          className="mt-5 grid gap-5 lg:grid-cols-2"
        >
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Title
            </label>

            <input
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="Example: Unauthorized login attempt"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Affected Data
            </label>

            <input
              value={form.affected_data}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  affected_data: e.target.value,
                }))
              }
              placeholder="Example: User accounts, journals"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Severity
            </label>

            <select
              value={form.severity}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  severity: e.target.value,
                }))
              }
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Affected User Count
            </label>

            <input
              type="number"
              min="0"
              value={form.affected_user_count}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  affected_user_count: e.target.value,
                }))
              }
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Description
            </label>

            <textarea
              rows="4"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe what happened, how it was detected, and what is being investigated..."
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700 lg:col-span-2">
            <input
              type="checkbox"
              checked={form.notification_required}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  notification_required: e.target.checked,
                }))
              }
              className="h-5 w-5"
            />
            Notification required under GDPR/DPDP workflow
          </label>

          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:bg-red-300"
          >
            {saving ? "Creating..." : "Create Incident"}
          </button>
        </form>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Incident Register
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Showing {filteredIncidents.length} of {incidents.length}
            </p>
          </div>

          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search incidents..."
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:max-w-md"
          />
        </div>

        <div className="mt-6 grid gap-5">
          {filteredIncidents.map((incident) => (
            <div
              key={incident.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${severityClass(
                        incident.severity
                      )}`}
                    >
                      {incident.severity}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                        incident.status
                      )}`}
                    >
                      {incident.status}
                    </span>

                    {incident.notification_required && (
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                        Notification Required
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                    {incident.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {incident.description || "No description provided."}
                  </p>

                  <p className="mt-3 text-xs text-slate-400">
                    Created: {new Date(incident.created_at).toLocaleString()}
                  </p>

                  {incident.regulatory_deadline_at && (
                    <p className="mt-1 text-xs font-bold text-red-600">
                      Regulatory deadline:{" "}
                      {new Date(
                        incident.regulatory_deadline_at
                      ).toLocaleString()}
                    </p>
                  )}

                  {incident.notified_at && (
                    <p className="mt-1 text-xs font-bold text-blue-600">
                      Notified:{" "}
                      {new Date(incident.notified_at).toLocaleString()}
                    </p>
                  )}

                  {incident.resolved_at && (
                    <p className="mt-1 text-xs font-bold text-green-600">
                      Resolved:{" "}
                      {new Date(incident.resolved_at).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="grid gap-3 sm:min-w-64">
                  <select
                    value={incident.severity}
                    onChange={(e) =>
                      handleSeverityUpdate(incident.id, e.target.value)
                    }
                    disabled={saving}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>

                  <select
                    value={incident.status}
                    onChange={(e) =>
                      handleStatusUpdate(incident.id, e.target.value)
                    }
                    disabled={saving}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="INVESTIGATING">INVESTIGATING</option>
                    <option value="NOTIFICATION_REQUIRED">
                      NOTIFICATION_REQUIRED
                    </option>
                    <option value="NOTIFIED">NOTIFIED</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">
                    Affected Data
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {incident.affected_data || "Not specified"}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">
                    Affected Users
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {incident.affected_user_count || 0}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">
                    Reported By
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {incident.reported_by_email || "Admin"}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {filteredIncidents.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No incidents found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default BreachManagement;