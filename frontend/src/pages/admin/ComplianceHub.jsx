import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getComplianceSummary,
  getPrivacyAnalytics,
} from "../../services/adminService";

function ComplianceHub() {
  const [summary, setSummary] = useState(null);
  const [privacyAnalytics, setPrivacyAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplianceData();
  }, []);

  async function loadComplianceData() {
    try {
      const [summaryData, analyticsData] = await Promise.all([
        getComplianceSummary(),
        getPrivacyAnalytics(),
      ]);

      setSummary(summaryData);
      setPrivacyAnalytics(analyticsData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load compliance data");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="flex items-center justify-center py-20">
        <p className="text-slate-500">Loading Compliance Hub...</p>
      </section>
    );
  }

  const complianceScore =
    summary?.totalUsers > 0
      ? Math.round(
          ((summary.consentGiven + summary.mfaEnabled) /
            (summary.totalUsers * 2)) *
            100
        )
      : 0;

  const complianceCards = [
    ["👥", "Total Users", summary?.totalUsers || 0],
    ["✅", "Consent Given", summary?.consentGiven || 0],
    ["❌", "Consent Missing", summary?.consentMissing || 0],
    ["🔐", "MFA Enabled", summary?.mfaEnabled || 0],
    ["📤", "Data Exports", summary?.dataExports || 0],
    ["🗑️", "Account Deletes", summary?.accountDeletes || 0],
    ["🚨", "Failed Logins", summary?.failedLogins || 0],
    ["🔑", "MFA Failures", summary?.mfaFailures || 0],
    ["👮", "Role Changes", summary?.roleChanges || 0],
  ];

  const privacyCards = [
    ["📊", "Total Requests", privacyAnalytics?.totalRequests || 0],
    ["⏳", "Pending", privacyAnalytics?.pendingRequests || 0],
    ["✅", "Approved", privacyAnalytics?.approvedRequests || 0],
    ["❌", "Rejected", privacyAnalytics?.rejectedRequests || 0],
    ["✔️", "Completed", privacyAnalytics?.completedRequests || 0],
    ["📤", "Export Requests", privacyAnalytics?.exportRequests || 0],
    ["🗑️", "Deletion Requests", privacyAnalytics?.deletionRequests || 0],
    ["🚫", "Consent Withdrawal", privacyAnalytics?.withdrawalRequests || 0],
  ];

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900">
          🏛️ Compliance Hub
        </h1>

        <p className="mt-2 text-slate-500">
          GDPR / DPDP Compliance Monitoring Dashboard
        </p>
      </div>

      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-600 to-green-700 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-100">
          Overall Compliance Score
        </p>

        <h2 className="mt-3 text-6xl font-extrabold">
          {complianceScore}%
        </h2>

        <p className="mt-3 text-emerald-100">
          Based on consent adoption and MFA adoption.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-900">
          Security & Compliance Metrics
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {complianceCards.map(([icon, title, value]) => (
            <div
              key={title}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl">{icon}</span>
                <span className="text-4xl font-extrabold text-slate-900">
                  {value}
                </span>
              </div>

              <h3 className="mt-4 text-sm font-bold uppercase tracking-wide text-slate-600">
                {title}
              </h3>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-blue-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-900">
          Privacy Request Analytics
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Tracks GDPR/DPDP user-rights requests and processing status.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {privacyCards.map(([icon, title, value]) => (
            <div
              key={title}
              className="rounded-3xl border border-blue-100 bg-blue-50 p-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{icon}</span>
                <span className="text-3xl font-extrabold text-blue-700">
                  {value}
                </span>
              </div>

              <h3 className="mt-4 text-xs font-bold uppercase tracking-wide text-blue-700">
                {title}
              </h3>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-900">
          Compliance Coverage
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            "Privacy Policy",
            "Data Retention Policy",
            "Security Policy",
            "Incident Response Plan",
            "Terms & Conditions",
            "Cookie Policy",
            "Consent Management",
            "Cookie Consent",
            "Data Export",
            "Account Deletion",
            "Privacy Requests",
            "Retention Engine",
            "Audit Logs",
            "MFA Authentication",
            "Role Based Access Control",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl bg-green-50 p-4 font-semibold text-green-700"
            >
              ✅ {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ComplianceHub;