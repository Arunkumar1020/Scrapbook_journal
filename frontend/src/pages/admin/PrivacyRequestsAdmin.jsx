import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  getAdminPrivacyRequests,
  updateAdminPrivacyRequestStatus,
} from "../../services/privacyRequestService";

function PrivacyRequestsAdmin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [notesById, setNotesById] = useState({});

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      const data = await getAdminPrivacyRequests();
      setRequests(data);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to load privacy requests");
    } finally {
      setLoading(false);
    }
  }

  const filteredRequests = useMemo(() => {
    const text = searchText.toLowerCase();

    return requests.filter(
      (request) =>
        request.user_name?.toLowerCase().includes(text) ||
        request.user_email?.toLowerCase().includes(text) ||
        request.request_type?.toLowerCase().includes(text) ||
        request.status?.toLowerCase().includes(text)
    );
  }, [requests, searchText]);

  function statusClass(status) {
    if (status === "APPROVED") return "bg-green-50 text-green-700";
    if (status === "REJECTED") return "bg-red-50 text-red-700";
    if (status === "COMPLETED") return "bg-blue-50 text-blue-700";
    return "bg-yellow-50 text-yellow-700";
  }

  async function handleStatusUpdate(requestId, status) {
    const notes = notesById[requestId] || "";

    setActionLoadingId(requestId);

    try {
      await updateAdminPrivacyRequestStatus(requestId, status, notes);

      toast.success(`Request marked as ${status}`);
      setNotesById((prev) => ({
        ...prev,
        [requestId]: "",
      }));
      await loadRequests();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update request");
    } finally {
      setActionLoadingId(null);
    }
  }

  if (loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-500">Loading privacy requests...</p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Privacy Requests
        </h1>

        <p className="mt-2 text-slate-500">
          Review and process GDPR/DPDP privacy requests submitted by users.
        </p>
      </div>

      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Request Queue
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Showing {filteredRequests.length} of {requests.length}
            </p>
          </div>

          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by user, email, type, or status..."
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:max-w-md"
          />
        </div>
      </div>

      <div className="grid gap-5">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
              <div>
                <span
                  className={`inline-flex rounded-full px-4 py-2 text-xs font-bold ${statusClass(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>

                <h2 className="mt-4 text-xl font-extrabold text-slate-900">
                  {request.request_type}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Requested by{" "}
                  <span className="font-bold text-slate-700">
                    {request.user_name || "Unknown"}
                  </span>{" "}
                  • {request.user_email}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Created: {new Date(request.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  disabled={actionLoadingId === request.id}
                  onClick={() =>
                    handleStatusUpdate(request.id, "APPROVED")
                  }
                  className="rounded-xl bg-green-50 px-4 py-2 text-xs font-bold text-green-700 hover:bg-green-100 disabled:opacity-50"
                >
                  Approve
                </button>

                <button
                  disabled={actionLoadingId === request.id}
                  onClick={() =>
                    handleStatusUpdate(request.id, "REJECTED")
                  }
                  className="rounded-xl bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
                >
                  Reject
                </button>

                <button
                  disabled={actionLoadingId === request.id}
                  onClick={() =>
                    handleStatusUpdate(request.id, "COMPLETED")
                  }
                  className="rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                >
                  Complete
                </button>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <label className="mb-2 block text-xs font-bold uppercase text-slate-500">
                Admin Notes
              </label>

              <textarea
                value={notesById[request.id] || ""}
                onChange={(e) =>
                  setNotesById((prev) => ({
                    ...prev,
                    [request.id]: e.target.value,
                  }))
                }
                rows="3"
                placeholder="Add notes before approving, rejecting, or completing..."
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {request.notes && (
              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase text-slate-500">
                  Saved Notes
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {request.notes}
                </p>
              </div>
            )}

            {request.processed_at && (
              <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-blue-700">
                Processed:{" "}
                {new Date(request.processed_at).toLocaleString()} by{" "}
                {request.processed_by_email || "admin"}
              </div>
            )}
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No privacy requests found.
          </div>
        )}
      </div>
    </section>
  );
}

export default PrivacyRequestsAdmin;