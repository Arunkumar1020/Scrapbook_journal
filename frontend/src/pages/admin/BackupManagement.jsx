import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  getBackupAnalytics,
  getBackupRecords,
  createBackupRecord,
  updateBackupRecord,
  deleteBackupRecord,
} from "../../services/backupService";

function BackupManagement() {
  const [analytics, setAnalytics] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    provider_name: "",
    backup_frequency: "",
    storage_location: "",
    retention_period: "",
    encryption_enabled: true,
    restore_tested: false,
    last_backup_at: "",
    last_restore_test_at: "",
    notes: "",
  });

  useEffect(() => {
    loadBackupData();
  }, []);

  async function loadBackupData() {
    try {
      const [analyticsData, recordsData] = await Promise.all([
        getBackupAnalytics(),
        getBackupRecords(),
      ]);

      setAnalytics(analyticsData);
      setRecords(recordsData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load backup register");
    } finally {
      setLoading(false);
    }
  }

  const filteredRecords = useMemo(() => {
    const text = searchText.toLowerCase();

    return records.filter(
      (record) =>
        record.provider_name?.toLowerCase().includes(text) ||
        record.backup_frequency?.toLowerCase().includes(text) ||
        record.storage_location?.toLowerCase().includes(text) ||
        record.retention_period?.toLowerCase().includes(text)
    );
  }, [records, searchText]);

  function resetForm() {
    setEditingId(null);
    setForm({
      provider_name: "",
      backup_frequency: "",
      storage_location: "",
      retention_period: "",
      encryption_enabled: true,
      restore_tested: false,
      last_backup_at: "",
      last_restore_test_at: "",
      notes: "",
    });
  }

  function handleEdit(record) {
    setEditingId(record.id);

    setForm({
      provider_name: record.provider_name || "",
      backup_frequency: record.backup_frequency || "",
      storage_location: record.storage_location || "",
      retention_period: record.retention_period || "",
      encryption_enabled: Boolean(record.encryption_enabled),
      restore_tested: Boolean(record.restore_tested),
      last_backup_at: record.last_backup_at
        ? record.last_backup_at.slice(0, 16)
        : "",
      last_restore_test_at: record.last_restore_test_at
        ? record.last_restore_test_at.slice(0, 16)
        : "",
      notes: record.notes || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.provider_name.trim()) {
      toast.error("Provider name is required");
      return;
    }

    if (!form.backup_frequency.trim()) {
      toast.error("Backup frequency is required");
      return;
    }

    if (!form.storage_location.trim()) {
      toast.error("Storage location is required");
      return;
    }

    if (!form.retention_period.trim()) {
      toast.error("Retention period is required");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        last_backup_at: form.last_backup_at || null,
        last_restore_test_at: form.last_restore_test_at || null,
      };

      if (editingId) {
        await updateBackupRecord(editingId, payload);
        toast.success("Backup record updated");
      } else {
        await createBackupRecord(payload);
        toast.success("Backup record created");
      }

      resetForm();
      await loadBackupData();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save backup record");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(recordId) {
    const confirmDelete = window.confirm(
      "Delete this backup retention record?"
    );

    if (!confirmDelete) return;

    setSaving(true);

    try {
      await deleteBackupRecord(recordId);
      toast.success("Backup record deleted");
      await loadBackupData();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to delete backup record");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-500">Loading backup register...</p>
      </section>
    );
  }

  const analyticsCards = [
    ["💾", "Total Records", analytics?.totalRecords || 0],
    ["🔐", "Encrypted Backups", analytics?.encryptedBackups || 0],
    ["✅", "Restore Tested", analytics?.restoreTested || 0],
    ["⚠️", "Restore Not Tested", analytics?.restoreNotTested || 0],
  ];

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Backup Retention Register
        </h1>

        <p className="mt-2 text-slate-500">
          Track backup providers, retention periods, encryption, and restore
          testing status for audit readiness.
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
          {editingId ? "Edit Backup Record" : "Add Backup Record"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-5 grid gap-5 lg:grid-cols-2"
        >
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Provider Name
            </label>

            <input
              value={form.provider_name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  provider_name: e.target.value,
                }))
              }
              placeholder="Example: Neon PostgreSQL"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Backup Frequency
            </label>

            <input
              value={form.backup_frequency}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  backup_frequency: e.target.value,
                }))
              }
              placeholder="Example: Daily"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Storage Location
            </label>

            <input
              value={form.storage_location}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  storage_location: e.target.value,
                }))
              }
              placeholder="Example: Cloud Storage / Region"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Retention Period
            </label>

            <input
              value={form.retention_period}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  retention_period: e.target.value,
                }))
              }
              placeholder="Example: 30 Days"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Last Backup At
            </label>

            <input
              type="datetime-local"
              value={form.last_backup_at}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  last_backup_at: e.target.value,
                }))
              }
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Last Restore Test At
            </label>

            <input
              type="datetime-local"
              value={form.last_restore_test_at}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  last_restore_test_at: e.target.value,
                }))
              }
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              checked={form.encryption_enabled}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  encryption_enabled: e.target.checked,
                }))
              }
              className="h-5 w-5"
            />
            Encryption enabled
          </label>

          <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              checked={form.restore_tested}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  restore_tested: e.target.checked,
                }))
              }
              className="h-5 w-5"
            />
            Restore tested
          </label>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Notes
            </label>

            <textarea
              rows="3"
              value={form.notes}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              placeholder="Backup policy notes, restore testing notes, provider details..."
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-wrap gap-3 lg:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-blue-300"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Backup Record"
                : "Add Backup Record"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl bg-slate-100 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Backup Register
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Showing {filteredRecords.length} of {records.length}
            </p>
          </div>

          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search backup records..."
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:max-w-md"
          />
        </div>

        <div className="mt-6 grid gap-5">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={
                        record.encryption_enabled
                          ? "rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700"
                          : "rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700"
                      }
                    >
                      {record.encryption_enabled
                        ? "Encrypted"
                        : "Not Encrypted"}
                    </span>

                    <span
                      className={
                        record.restore_tested
                          ? "rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700"
                          : "rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700"
                      }
                    >
                      {record.restore_tested
                        ? "Restore Tested"
                        : "Restore Not Tested"}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                    {record.provider_name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {record.notes || "No notes provided."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEdit(record)}
                    disabled={saving}
                    className="rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(record.id)}
                    disabled={saving}
                    className="rounded-xl bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">
                    Frequency
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {record.backup_frequency}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">
                    Location
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {record.storage_location}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">
                    Retention
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {record.retention_period}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">
                    Last Backup
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {record.last_backup_at
                      ? new Date(record.last_backup_at).toLocaleString()
                      : "Not recorded"}
                  </p>
                </div>
              </div>

              {record.last_restore_test_at && (
                <p className="mt-3 text-xs font-bold text-blue-700">
                  Last restore test:{" "}
                  {new Date(record.last_restore_test_at).toLocaleString()}
                </p>
              )}
            </div>
          ))}

          {filteredRecords.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No backup records found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default BackupManagement;