import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getRetentionSettings,
  updateRetentionSettings,
  previewRetentionCleanup,
  runRetentionCleanup,
} from "../../services/retentionService";

function RetentionManagement() {
  const [settings, setSettings] = useState(null);
  const [preview, setPreview] = useState(null);
  const [retentionDays, setRetentionDays] = useState(365);
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRetentionData();
  }, []);

  async function loadRetentionData() {
    try {
      const settingsData = await getRetentionSettings();
      const previewData = await previewRetentionCleanup();

      setSettings(settingsData);
      setPreview(previewData);
      setRetentionDays(settingsData.retention_days);
      setEnabled(settingsData.enabled);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load retention data");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSettings() {
    if (!retentionDays || Number(retentionDays) < 1) {
      toast.error("Retention days must be greater than 0");
      return;
    }

    setSaving(true);

    try {
      await updateRetentionSettings({
        retention_days: Number(retentionDays),
        enabled,
      });

      toast.success("Retention settings updated");
      await loadRetentionData();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  }

  async function handleRunCleanup() {
    const confirmRun = window.confirm(
      "Run retention cleanup now? This may permanently delete expired journals and images."
    );

    if (!confirmRun) return;

    setSaving(true);

    try {
      const data = await runRetentionCleanup();
      toast.success(
        `Cleanup complete: ${data.result.deleted_journals} journals deleted`
      );
      await loadRetentionData();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to run cleanup");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-500">Loading retention settings...</p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Data Retention Management
        </h1>

        <p className="mt-2 text-slate-500">
          Configure retention rules and clean expired journal data.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
          <p className="text-xs font-bold uppercase text-blue-600">
            Retention Days
          </p>

          <h2 className="mt-3 text-4xl font-extrabold text-blue-700">
            {settings?.retention_days}
          </h2>

          <p className="mt-2 text-sm text-blue-600">
            Current active retention period.
          </p>
        </div>

        <div className="rounded-3xl border border-green-100 bg-green-50 p-6">
          <p className="text-xs font-bold uppercase text-green-600">
            Status
          </p>

          <h2 className="mt-3 text-4xl font-extrabold text-green-700">
            {settings?.enabled ? "Enabled" : "Disabled"}
          </h2>

          <p className="mt-2 text-sm text-green-600">
            Retention cleanup engine state.
          </p>
        </div>

        <div className="rounded-3xl border border-orange-100 bg-orange-50 p-6">
          <p className="text-xs font-bold uppercase text-orange-600">
            Expired Journals
          </p>

          <h2 className="mt-3 text-4xl font-extrabold text-orange-700">
            {preview?.expired_journals || 0}
          </h2>

          <p className="mt-2 text-sm text-orange-600">
            Journals eligible for cleanup.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Retention Settings
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Retention Days
            </label>

            <input
              type="number"
              min="1"
              value={retentionDays}
              onChange={(e) => setRetentionDays(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Cleanup Enabled
            </label>

            <select
              value={enabled ? "true" : "false"}
              onChange={(e) => setEnabled(e.target.value === "true")}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="mt-5 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-blue-300"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-xl font-bold text-red-700">
          Manual Retention Cleanup
        </h2>

        <p className="mt-2 text-sm leading-6 text-red-700">
          This deletes journals older than the configured retention period and
          removes their associated R2 images. This action is permanent.
        </p>

        <button
          onClick={handleRunCleanup}
          disabled={saving}
          className="mt-5 rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:bg-red-300"
        >
          {saving ? "Running..." : "Run Cleanup Now"}
        </button>
      </div>
    </section>
  );
}

export default RetentionManagement;