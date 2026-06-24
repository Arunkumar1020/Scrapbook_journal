import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  getVendorAnalytics,
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor,
} from "../../services/vendorService";

function VendorManagement() {
  const [analytics, setAnalytics] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    vendor_name: "",
    service_type: "",
    purpose: "",
    data_shared: "",
    country: "",
    retention_period: "",
    dp_agreement_signed: false,
    website: "",
  });

  useEffect(() => {
    loadVendorData();
  }, []);

  async function loadVendorData() {
    try {
      const [analyticsData, vendorsData] = await Promise.all([
        getVendorAnalytics(),
        getVendors(),
      ]);

      setAnalytics(analyticsData);
      setVendors(vendorsData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load vendor register");
    } finally {
      setLoading(false);
    }
  }

  const filteredVendors = useMemo(() => {
    const text = searchText.toLowerCase();

    return vendors.filter(
      (vendor) =>
        vendor.vendor_name?.toLowerCase().includes(text) ||
        vendor.service_type?.toLowerCase().includes(text) ||
        vendor.purpose?.toLowerCase().includes(text) ||
        vendor.country?.toLowerCase().includes(text)
    );
  }, [vendors, searchText]);

  function resetForm() {
    setEditingId(null);
    setForm({
      vendor_name: "",
      service_type: "",
      purpose: "",
      data_shared: "",
      country: "",
      retention_period: "",
      dp_agreement_signed: false,
      website: "",
    });
  }

  function handleEdit(vendor) {
    setEditingId(vendor.id);

    setForm({
      vendor_name: vendor.vendor_name || "",
      service_type: vendor.service_type || "",
      purpose: vendor.purpose || "",
      data_shared: vendor.data_shared || "",
      country: vendor.country || "",
      retention_period: vendor.retention_period || "",
      dp_agreement_signed: Boolean(vendor.dp_agreement_signed),
      website: vendor.website || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.vendor_name.trim()) {
      toast.error("Vendor name is required");
      return;
    }

    if (!form.service_type.trim()) {
      toast.error("Service type is required");
      return;
    }

    if (!form.purpose.trim()) {
      toast.error("Purpose is required");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await updateVendor(editingId, form);
        toast.success("Vendor updated");
      } else {
        await createVendor(form);
        toast.success("Vendor created");
      }

      resetForm();
      await loadVendorData();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save vendor");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(vendorId) {
    const confirmDelete = window.confirm(
      "Delete this vendor from the subprocessor register?"
    );

    if (!confirmDelete) return;

    setSaving(true);

    try {
      await deleteVendor(vendorId);
      toast.success("Vendor deleted");
      await loadVendorData();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to delete vendor");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-500">Loading vendor register...</p>
      </section>
    );
  }

  const analyticsCards = [
    ["🏢", "Total Vendors", analytics?.totalVendors || 0],
    ["✅", "DPA Signed", analytics?.agreementsSigned || 0],
    ["⚠️", "DPA Missing", analytics?.agreementsMissing || 0],
  ];

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Vendor / Subprocessor Register
        </h1>

        <p className="mt-2 text-slate-500">
          Track third-party vendors, subprocessors, data sharing, retention,
          country, and DPA agreement status.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
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
          {editingId ? "Edit Vendor" : "Add Vendor"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-5 grid gap-5 lg:grid-cols-2"
        >
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Vendor Name
            </label>

            <input
              value={form.vendor_name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  vendor_name: e.target.value,
                }))
              }
              placeholder="Example: Cloudflare"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Service Type
            </label>

            <input
              value={form.service_type}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  service_type: e.target.value,
                }))
              }
              placeholder="Example: Hosting / CDN"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Purpose
            </label>

            <input
              value={form.purpose}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  purpose: e.target.value,
                }))
              }
              placeholder="Example: Application hosting"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Data Shared
            </label>

            <input
              value={form.data_shared}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  data_shared: e.target.value,
                }))
              }
              placeholder="Example: User content, images"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Country
            </label>

            <input
              value={form.country}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  country: e.target.value,
                }))
              }
              placeholder="Example: Global / United States / India"
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
              placeholder="Example: According to retention policy"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Website
            </label>

            <input
              value={form.website}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  website: e.target.value,
                }))
              }
              placeholder="https://example.com"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700 lg:col-span-2">
            <input
              type="checkbox"
              checked={form.dp_agreement_signed}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  dp_agreement_signed: e.target.checked,
                }))
              }
              className="h-5 w-5"
            />
            Data Processing Agreement signed
          </label>

          <div className="flex flex-wrap gap-3 lg:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-blue-300"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Vendor"
                : "Add Vendor"}
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
              Vendor Register
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Showing {filteredVendors.length} of {vendors.length}
            </p>
          </div>

          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search vendors..."
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:max-w-md"
          />
        </div>

        <div className="mt-6 grid gap-5">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={
                        vendor.dp_agreement_signed
                          ? "rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700"
                          : "rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700"
                      }
                    >
                      {vendor.dp_agreement_signed
                        ? "DPA Signed"
                        : "DPA Missing"}
                    </span>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                      {vendor.service_type}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                    {vendor.vendor_name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {vendor.purpose}
                  </p>

                  {vendor.website && (
                    <a
                      href={vendor.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm font-bold text-blue-600 hover:text-blue-700"
                    >
                      Visit website →
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEdit(vendor)}
                    disabled={saving}
                    className="rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(vendor.id)}
                    disabled={saving}
                    className="rounded-xl bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">
                    Data Shared
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {vendor.data_shared || "Not specified"}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">
                    Country
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {vendor.country || "Not specified"}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">
                    Retention
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {vendor.retention_period || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {filteredVendors.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No vendors found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default VendorManagement;