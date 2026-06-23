import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getComplianceSummary } from "../../services/adminService";

function ComplianceHub() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplianceData();
  }, []);

  async function loadComplianceData() {
    try {
      const data = await getComplianceSummary();
      setSummary(data);
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
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="mt-4 text-slate-500">
            Loading Compliance Hub...
          </p>
        </div>
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

  const cards = [
    {
      title: "Total Users",
      value: summary?.totalUsers || 0,
      icon: "👥",
      color: "bg-blue-50 border-blue-100 text-blue-700",
    },
    {
      title: "Consent Given",
      value: summary?.consentGiven || 0,
      icon: "✅",
      color: "bg-green-50 border-green-100 text-green-700",
    },
    {
      title: "Consent Missing",
      value: summary?.consentMissing || 0,
      icon: "❌",
      color: "bg-red-50 border-red-100 text-red-700",
    },
    {
      title: "MFA Enabled",
      value: summary?.mfaEnabled || 0,
      icon: "🔐",
      color: "bg-purple-50 border-purple-100 text-purple-700",
    },
    {
      title: "Data Exports",
      value: summary?.dataExports || 0,
      icon: "📤",
      color: "bg-indigo-50 border-indigo-100 text-indigo-700",
    },
    {
      title: "Account Deletes",
      value: summary?.accountDeletes || 0,
      icon: "🗑️",
      color: "bg-orange-50 border-orange-100 text-orange-700",
    },
    {
      title: "Failed Logins",
      value: summary?.failedLogins || 0,
      icon: "🚨",
      color: "bg-red-50 border-red-100 text-red-700",
    },
    {
      title: "MFA Failures",
      value: summary?.mfaFailures || 0,
      icon: "🔑",
      color: "bg-yellow-50 border-yellow-100 text-yellow-700",
    },
    {
      title: "Role Changes",
      value: summary?.roleChanges || 0,
      icon: "👮",
      color: "bg-slate-50 border-slate-200 text-slate-700",
    },
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

      <div className="overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-600 to-green-700 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
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
              Compliance readiness indicator
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`rounded-3xl border p-6 shadow-sm ${card.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-4xl">
                {card.icon}
              </span>

              <span className="text-4xl font-extrabold">
                {card.value}
              </span>
            </div>

            <h3 className="mt-4 text-sm font-bold uppercase tracking-wide">
              {card.title}
            </h3>
          </div>
        ))}
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
            "Data Export",
            "Account Deletion",
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