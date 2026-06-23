import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getMfaStatus,
  setupMfa,
  enableMfa,
  disableMfa,
} from "../../services/mfaService";

function MfaSettings() {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [setupData, setSetupData] = useState(null);
  const [enableCode, setEnableCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  async function loadStatus() {
    try {
      const data = await getMfaStatus();
      setMfaEnabled(data.mfa_enabled);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load MFA status");
    } finally {
      setLoading(false);
    }
  }

  async function handleSetupMfa() {
    setSaving(true);

    try {
      const data = await setupMfa();
      setSetupData(data);
      toast.success("MFA setup started");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to setup MFA");
    } finally {
      setSaving(false);
    }
  }

  async function handleEnableMfa() {
    if (!enableCode || enableCode.length !== 6) {
      toast.error("Enter the 6-digit authenticator code");
      return;
    }

    setSaving(true);

    try {
      await enableMfa(enableCode);
      setMfaEnabled(true);
      setSetupData(null);
      setEnableCode("");
      toast.success("MFA enabled successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to enable MFA");
    } finally {
      setSaving(false);
    }
  }

  async function handleDisableMfa() {
    if (!disableCode || disableCode.length !== 6) {
      toast.error("Enter the 6-digit authenticator code");
      return;
    }

    const confirmDisable = window.confirm(
      "Disable MFA for your account?"
    );

    if (!confirmDisable) return;

    setSaving(true);

    try {
      await disableMfa(disableCode);
      setMfaEnabled(false);
      setDisableCode("");
      toast.success("MFA disabled successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to disable MFA");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-4xl">
        <p className="text-slate-500">Loading MFA settings...</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">
          MFA Settings
        </h1>

        <p className="mt-2 text-slate-500">
          Secure your account with an authenticator app like Google
          Authenticator, Microsoft Authenticator, Authy, 1Password, or Bitwarden.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Multi-Factor Authentication
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              MFA adds a second verification step during login.
            </p>
          </div>

          <span
            className={
              mfaEnabled
                ? "rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700"
                : "rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-700"
            }
          >
            {mfaEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>

      {!mfaEnabled && (
        <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Enable MFA
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Start setup, copy the secret into your authenticator app, then enter
            the 6-digit code to enable MFA.
          </p>

          {!setupData && (
            <button
              onClick={handleSetupMfa}
              disabled={saving}
              className="mt-5 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-blue-300"
            >
              Start MFA Setup
            </button>
          )}

          {setupData && (
            <div className="mt-5 rounded-2xl bg-white p-5">
              <h3 className="font-bold text-slate-900">
                Authenticator Setup Key
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                In Google Authenticator: Add code → Enter setup key → Time based.
              </p>

              <div className="mt-4 rounded-xl bg-slate-950 p-4 font-mono text-sm font-bold text-green-300 break-all">
                {setupData.secret}
              </div>

              <p className="mt-4 text-xs leading-6 text-slate-500">
                OTP Auth URL:
              </p>

              <div className="mt-2 rounded-xl bg-slate-100 p-3 text-xs break-all text-slate-600">
                {setupData.otpAuthUrl}
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Enter 6-digit code
                </label>

                <input
                  type="text"
                  value={enableCode}
                  onChange={(e) => setEnableCode(e.target.value)}
                  maxLength="6"
                  placeholder="123456"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <button
                  onClick={handleEnableMfa}
                  disabled={saving}
                  className="mt-4 rounded-2xl bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:bg-green-300"
                >
                  Enable MFA
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {mfaEnabled && (
        <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-xl font-bold text-red-700">
            Disable MFA
          </h2>

          <p className="mt-2 text-sm leading-6 text-red-700">
            Enter your current authenticator code to disable MFA.
          </p>

          <div className="mt-5 rounded-2xl bg-white p-5">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Current 6-digit code
            </label>

            <input
              type="text"
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value)}
              maxLength="6"
              placeholder="123456"
              className="w-full rounded-2xl border border-red-200 px-4 py-3 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
            />

            <button
              onClick={handleDisableMfa}
              disabled={saving}
              className="mt-4 rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:bg-red-300"
            >
              Disable MFA
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default MfaSettings;
