import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getComplianceSummary,
  getPrivacyAnalytics,
} from "../../services/adminService";

import { getBreachAnalytics } from "../../services/breachService";
import { getVendorAnalytics } from "../../services/vendorService";
import { getBackupAnalytics } from "../../services/backupService";

function ComplianceHub() {
  const [summary, setSummary] = useState(null);
  const [privacyAnalytics, setPrivacyAnalytics] = useState(null);
  const [breachAnalytics, setBreachAnalytics] = useState(null);
  const [vendorAnalytics, setVendorAnalytics] = useState(null);
  const [backupAnalytics, setBackupAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplianceData();
  }, []);

  async function loadComplianceData() {
    try {
      const [
        summaryData,
        privacyData,
        breachData,
        vendorData,
        backupData,
      ] = await Promise.all([
        getComplianceSummary(),
        getPrivacyAnalytics(),
        getBreachAnalytics(),
        getVendorAnalytics(),
        getBackupAnalytics(),
      ]);

      setSummary(summaryData);
      setPrivacyAnalytics(privacyData);
      setBreachAnalytics(breachData);
      setVendorAnalytics(vendorData);
      setBackupAnalytics(backupData);
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

  const consentScore =
    summary?.totalUsers > 0
      ? (summary.consentGiven / summary.totalUsers) * 100
      : 0;

  const mfaScore =
    summary?.totalUsers > 0
      ? (summary.mfaEnabled / summary.totalUsers) * 100
      : 0;

  const vendorScore =
    vendorAnalytics?.totalVendors > 0
      ? (vendorAnalytics.agreementsSigned / vendorAnalytics.totalVendors) * 100
      : 100;

  const backupScore =
    backupAnalytics?.totalRecords > 0
      ? (backupAnalytics.encryptedBackups / backupAnalytics.totalRecords) * 100
      : 100;

  const breachScore =
    breachAnalytics?.totalIncidents > 0
      ? (breachAnalytics.resolvedIncidents / breachAnalytics.totalIncidents) *
        100
      : 100;

  const complianceScore = Math.round(
    (consentScore + mfaScore + vendorScore + backupScore + breachScore) / 5
  );

  const securityCards = [
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

  const breachCards = [
    ["📊", "Total Incidents", breachAnalytics?.totalIncidents || 0],
    ["🚨", "Open", breachAnalytics?.openIncidents || 0],
    ["🔎", "Investigating", breachAnalytics?.investigatingIncidents || 0],
    ["📢", "Notification Required", breachAnalytics?.notificationRequired || 0],
    ["📨", "Notified", breachAnalytics?.notifiedIncidents || 0],
    ["✅", "Resolved / Closed", breachAnalytics?.resolvedIncidents || 0],
    ["🔥", "Critical", breachAnalytics?.criticalIncidents || 0],
    ["⚠️", "High", breachAnalytics?.highIncidents || 0],
  ];

  const vendorCards = [
    ["🏢", "Total Vendors", vendorAnalytics?.totalVendors || 0],
    ["✅", "DPA Signed", vendorAnalytics?.agreementsSigned || 0],
    ["⚠️", "DPA Missing", vendorAnalytics?.agreementsMissing || 0],
  ];

  const backupCards = [
    ["💾", "Backup Records", backupAnalytics?.totalRecords || 0],
    ["🔐", "Encrypted", backupAnalytics?.encryptedBackups || 0],
    ["✅", "Restore Tested", backupAnalytics?.restoreTested || 0],
    ["⚠️", "Restore Not Tested", backupAnalytics?.restoreNotTested || 0],
  ];

  function MetricCard({ icon, title, value, color = "slate" }) {
    const colorClass =
      color === "blue"
        ? "border-blue-100 bg-blue-50 text-blue-700"
        : color === "red"
        ? "border-red-100 bg-red-50 text-red-700"
        : color === "green"
        ? "border-green-100 bg-green-50 text-green-700"
        : color === "purple"
        ? "border-purple-100 bg-purple-50 text-purple-700"
        : "border-slate-200 bg-slate-50 text-slate-700";

    return (
      <div className={`rounded-3xl border p-6 shadow-sm ${colorClass}`}>
        <div className="flex items-center justify-between">
          <span className="text-3xl">{icon}</span>

          <span className="text-3xl font-extrabold">
            {value}
          </span>
        </div>

        <h3 className="mt-4 text-xs font-bold uppercase tracking-wide">
          {title}
        </h3>
      </div>
    );
  }

  function Section({ title, description, cards, color }) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-sm text-slate-500">
            {description}
          </p>
        )}

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([icon, cardTitle, value]) => (
            <MetricCard
              key={cardTitle}
              icon={icon}
              title={cardTitle}
              value={value}
              color={color}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900">
          🏛️ Compliance Hub
        </h1>

        <p className="mt-2 text-slate-500">
          GDPR / DPDP governance, privacy, security, vendor, breach, and backup
          compliance dashboard.
        </p>
      </div>

      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-600 to-green-700 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-100">
              Overall Compliance Score
            </p>

            <h2 className="mt-3 text-6xl font-extrabold">
              {complianceScore}%
            </h2>

            <p className="mt-3 text-emerald-100">
              Based on consent, MFA, vendor agreements, backup encryption, and
              breach resolution.
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
            <div className="mb-3 h-4 w-64 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white"
                style={{
                  width: `${complianceScore}%`,
                }}
              />
            </div>

            <p className="text-sm font-medium text-emerald-50">
              Live compliance readiness indicator
            </p>
          </div>
        </div>
      </div>

      <Section
        title="Security & Compliance Metrics"
        description="Core account, consent, MFA, audit, and security indicators."
        cards={securityCards}
        color="slate"
      />

      <Section
        title="Privacy Request Analytics"
        description="Tracks GDPR/DPDP user-rights requests and processing status."
        cards={privacyCards}
        color="blue"
      />

      <Section
        title="Breach & Incident Metrics"
        description="Tracks breach incidents, investigation status, notifications, and resolution."
        cards={breachCards}
        color="red"
      />

      <Section
        title="Vendor / Subprocessor Metrics"
        description="Tracks subprocessors and Data Processing Agreement coverage."
        cards={vendorCards}
        color="purple"
      />

      <Section
        title="Backup Retention Metrics"
        description="Tracks backup records, encryption, and restore testing readiness."
        cards={backupCards}
        color="green"
      />

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
            "Privacy Request Analytics",
            "Retention Engine",
            "Retention Management",
            "Breach Register",
            "Vendor Register",
            "DPO / Privacy Contact",
            "Backup Retention Register",
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