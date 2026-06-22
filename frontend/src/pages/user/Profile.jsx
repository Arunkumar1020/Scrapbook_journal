import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

import {
  exportMyData,
  deleteMyAccount,
  getMyConsent,
  updateMyConsent,
} from "../../services/authService";

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [consent, setConsent] = useState(null);
  const [consentLoading, setConsentLoading] = useState(true);
  const [consentSaving, setConsentSaving] = useState(false);

  useEffect(() => {
    loadConsent();
  }, []);

  async function loadConsent() {
    try {
      const data = await getMyConsent();
      setConsent(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load consent status");
    } finally {
      setConsentLoading(false);
    }
  }

  async function handleExportData() {
    try {
      const data = await exportMyData();

      const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        {
          type: "application/json",
        }
      );

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "scrapbook-data-export.json";
      link.click();

      URL.revokeObjectURL(url);

      toast.success("Data exported successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export data");
    }
  }

  async function handleConsentUpdate(consentGiven) {
    setConsentSaving(true);

    try {
      const data = await updateMyConsent(consentGiven);

      setConsent(data.consent);

      toast.success(
        consentGiven
          ? "Consent granted successfully"
          : "Consent withdrawn successfully"
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update consent");
    } finally {
      setConsentSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (confirmText !== "DELETE") {
      toast.error("Type DELETE to confirm account deletion");
      return;
    }

    const confirmDelete = window.confirm(
      "This will permanently delete your account, journals, and uploaded images. Continue?"
    );

    if (!confirmDelete) return;

    setDeleting(true);

    try {
      await deleteMyAccount();

      logout();

      toast.success("Account deleted successfully");

      navigate("/register");
    } catch (error) {
      console.error(error);
      toast.error(
        error.message || "Failed to delete account"
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Profile & Privacy
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your account privacy, export your personal data, update consent,
          or permanently delete your account.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Account Information
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase text-slate-500">
              Name
            </p>
            <p className="mt-1 font-semibold text-slate-900">
              {user?.name}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase text-slate-500">
              Email
            </p>
            <p className="mt-1 break-all font-semibold text-slate-900">
              {user?.email}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase text-slate-500">
              Role
            </p>
            <p className="mt-1 font-semibold text-slate-900">
              {user?.role}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-purple-100 bg-purple-50 p-6">
        <h2 className="text-xl font-bold text-slate-900">
          Consent Management
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Control whether ScrapBook may process your account and journal data
          for providing the service. Consent activity is logged for privacy
          compliance.
        </p>

        {consentLoading ? (
          <p className="mt-5 text-sm text-slate-500">
            Loading consent status...
          </p>
        ) : (
          <div className="mt-5 rounded-2xl bg-white p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">
                  Current Status
                </p>

                <p
                  className={
                    consent?.consent_given
                      ? "mt-1 font-bold text-green-700"
                      : "mt-1 font-bold text-red-700"
                  }
                >
                  {consent?.consent_given
                    ? "Consent Given"
                    : "Consent Not Given / Withdrawn"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-slate-500">
                  Consent Date
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {consent?.consent_given_at
                    ? new Date(
                        consent.consent_given_at
                      ).toLocaleString()
                    : "Not available"}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => handleConsentUpdate(true)}
                disabled={consentSaving || consent?.consent_given}
                className="rounded-2xl bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
              >
                Grant Consent
              </button>

              <button
                onClick={() => handleConsentUpdate(false)}
                disabled={consentSaving || !consent?.consent_given}
                className="rounded-2xl bg-yellow-500 px-6 py-3 text-sm font-bold text-white hover:bg-yellow-600 disabled:cursor-not-allowed disabled:bg-yellow-300"
              >
                Withdraw Consent
              </button>
            </div>

            <p className="mt-4 text-xs leading-6 text-slate-500">
              Note: Withdrawing consent may limit future processing features,
              but existing account deletion and data export rights remain
              available.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-6">
        <h2 className="text-xl font-bold text-slate-900">
          Data Export
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Download a copy of your account and journal data in JSON format. This
          supports privacy and data portability requirements.
        </p>

        <button
          onClick={handleExportData}
          className="mt-5 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700"
        >
          Download My Data
        </button>

        <Link
          to="/privacy"
          className="ml-4 inline-block text-sm font-bold text-blue-700 hover:text-blue-800"
        >
          View Privacy Policy
        </Link>
      </div>

      <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-xl font-bold text-red-700">
          Danger Zone
        </h2>

        <p className="mt-2 text-sm leading-6 text-red-700">
          Permanently delete your account, all journals, and uploaded images.
          This action cannot be undone.
        </p>

        <div className="mt-5 rounded-2xl bg-white p-4">
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Type DELETE to confirm
          </label>

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="w-full rounded-2xl border border-red-200 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
          />

          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="mt-4 rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:bg-red-300"
          >
            {deleting ? "Deleting..." : "Delete My Account"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default Profile;