import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  createPrivacyRequest,
  getMyPrivacyRequests,
} from "../../services/privacyRequestService";

function PrivacyRequestCenter() {
  const [requests, setRequests] = useState([]);
  const [requestType, setRequestType] = useState("DATA_EXPORT");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      const data = await getMyPrivacyRequests();
      setRequests(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load privacy requests");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);

    try {
      await createPrivacyRequest({
        request_type: requestType,
        notes,
      });

      toast.success("Privacy request submitted");
      setNotes("");
      setRequestType("DATA_EXPORT");
      await loadRequests();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to submit request");
    } finally {
      setSaving(false);
    }
  }

  function statusClass(status) {
    if (status === "APPROVED") return "bg-green-50 text-green-700";
    if (status === "REJECTED") return "bg-red-50 text-red-700";
    if (status === "COMPLETED") return "bg-blue-50 text-blue-700";
    return "bg-yellow-50 text-yellow-700";
  }

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Privacy Request Center
        </h1>

        <p className="mt-2 text-slate-500">
          Submit and track GDPR/DPDP-style privacy requests.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Create New Request
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Request Type
            </label>

            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="DATA_EXPORT">Data Export Request</option>
              <option value="ACCOUNT_DELETION">Account Deletion Request</option>
              <option value="CONSENT_WITHDRAWAL">
                Consent Withdrawal Request
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Notes
            </label>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              placeholder="Add any details for admin review..."
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {saving ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          My Requests
        </h2>

        {loading ? (
          <p className="mt-5 text-slate-500">Loading requests...</p>
        ) : requests.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            No privacy requests submitted yet.
          </div>
        ) : (
          <div className="mt-5 grid gap-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="font-extrabold text-slate-900">
                      {request.request_type}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Created:{" "}
                      {new Date(request.created_at).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-xs font-bold ${statusClass(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </div>

                {request.notes && (
                  <p className="mt-4 rounded-xl bg-white p-4 text-sm leading-6 text-slate-600">
                    {request.notes}
                  </p>
                )}

                {request.processed_at && (
                  <p className="mt-3 text-xs text-slate-400">
                    Processed:{" "}
                    {new Date(request.processed_at).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default PrivacyRequestCenter;