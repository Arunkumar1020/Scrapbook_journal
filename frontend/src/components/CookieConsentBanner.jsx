import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getCookieConsent,
  updateCookieConsent,
} from "../services/cookieConsentService";

function CookieConsentBanner() {
  const location = useLocation();

  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCookieConsent();
  }, [location.pathname]);

  async function loadCookieConsent() {
    const token = localStorage.getItem("token");

    if (!token) {
      setVisible(false);
      return;
    }

    try {
      const data = await getCookieConsent();

      if (
        data.cookie_consent == null ||
        data.cookie_consent_version == null ||
        data.cookie_consent_at == null
      ) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    } catch (error) {
      console.error(error);
      setVisible(false);
    }
  }

  async function handleAcceptAll() {
    setSaving(true);

    try {
      await updateCookieConsent(true);
      toast.success("Cookie preferences saved");
      setVisible(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save cookie preferences");
    } finally {
      setSaving(false);
    }
  }

  async function handleRejectOptional() {
    setSaving(true);

    try {
      await updateCookieConsent(false);
      toast.success("Optional cookies rejected");
      setVisible(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save cookie preferences");
    } finally {
      setSaving(false);
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-5 z-[9999] mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            🍪 Cookie Preferences
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            ScrapBook uses essential browser storage for authentication and
            security. Optional storage helps improve preferences and user
            experience. You can accept all or reject optional cookies.
          </p>

          <Link
            to="/cookies"
            className="mt-2 inline-block text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            View Cookie Policy
          </Link>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleRejectOptional}
            disabled={saving}
            className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
          >
            Reject Optional
          </button>

          <button
            onClick={handleAcceptAll}
            disabled={saving}
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsentBanner;