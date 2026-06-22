import { Link } from "react-router-dom";

function ComplianceCenter() {
  const documents = [
    {
      title: "Privacy Policy",
      description:
        "Explains what user data is collected, how it is used, and user privacy rights.",
      icon: "🔐",
      path: "/privacy",
      color: "blue",
    },
    {
      title: "Data Retention Policy",
      description:
        "Explains how long user data, journals, images, audit logs, and consent records are retained.",
      icon: "🗂️",
      path: "/data-retention",
      color: "indigo",
    },
    {
      title: "Security Policy",
      description:
        "Describes authentication, JWT security, MFA, RBAC, audit logging, and secure storage controls.",
      icon: "🛡️",
      path: "/security",
      color: "purple",
    },
    {
      title: "Incident Response Plan",
      description:
        "Defines how security incidents are detected, contained, investigated, resolved, and reviewed.",
      icon: "🚨",
      path: "/incident-response",
      color: "red",
    },
    {
      title: "Terms & Conditions",
      description:
        "Defines user responsibilities, acceptable use, ownership, termination, and service limitations.",
      icon: "📜",
      path: "/terms",
      color: "slate",
    },
  ];

  return (
    <section className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="text-sm font-bold text-blue-600 hover:text-blue-700"
        >
          ← Back to ScrapBook
        </Link>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 px-6 py-10 text-white sm:px-8">
            <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-blue-50 ring-1 ring-white/20">
              ✅ Compliance & Governance
            </span>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight">
              ScrapBook Compliance Center
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-blue-100">
              Central place for privacy, security, retention, incident response,
              and usage policies implemented for GDPR/DPDP-style readiness.
            </p>
          </div>

          <div className="grid gap-5 p-6 sm:p-8 md:grid-cols-2">
            {documents.map((doc) => (
              <Link
                key={doc.title}
                to={doc.path}
                className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                    {doc.icon}
                  </div>

                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-700">
                      {doc.title}
                    </h2>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {doc.description}
                    </p>

                    <p className="mt-4 text-sm font-bold text-blue-600">
                      View document →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Implemented Compliance Features
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Consent Management",
                "Data Export",
                "Account Deletion",
                "R2 Image Cleanup",
                "Audit Logs",
                "Failed Login Tracking",
                "Security Monitoring",
                "MFA Support",
                "RBAC Admin Protection",
                "JWT Secret Management",
                "Privacy Policy",
                "Data Retention Policy",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white p-4 text-sm font-bold text-slate-700 shadow-sm"
                >
                  ✅ {item}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-yellow-200 bg-yellow-50 p-6 sm:p-8">
            <h2 className="text-lg font-extrabold text-yellow-800">
              Important Note
            </h2>

            <p className="mt-2 text-sm leading-7 text-yellow-800">
              This Compliance Center is a technical project implementation for
              privacy and security readiness. Legal documents should be reviewed
              by a qualified legal professional before production business use.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ComplianceCenter;