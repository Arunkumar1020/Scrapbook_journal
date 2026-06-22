import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { getSecurityPolicy } from "../../services/legalService";

function SecurityPolicy() {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPolicy();
  }, []);

  async function loadPolicy() {
    try {
      const data = await getSecurityPolicy();
      setPolicy(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load security policy");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <p className="text-slate-500">Loading security policy...</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="text-sm font-bold text-blue-600 hover:text-blue-700"
        >
          ← Back to ScrapBook
        </Link>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-950 via-purple-900 to-blue-900 px-6 py-10 text-white sm:px-8">
            <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-blue-50 ring-1 ring-white/20">
              🔐 Security & Safeguards
            </span>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight">
              Security Policy
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-blue-100">
              {policy?.purpose}
            </p>

            <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-blue-100">Version</p>
                <p className="mt-1 font-bold text-white">{policy?.version}</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-blue-100">Effective Date</p>
                <p className="mt-1 font-bold text-white">
                  {policy?.effective_date}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Security Controls
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {policy?.security_controls?.map((control) => (
                <div
                  key={control.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {control.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {control.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50 p-5">
              <h2 className="text-xl font-extrabold text-slate-900">
                Admin Security Controls
              </h2>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {policy?.admin_controls?.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl bg-white p-4 text-sm font-semibold leading-6 text-slate-700"
                  >
                    🛡️ {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <h2 className="text-xl font-extrabold text-slate-900">
                Security Recommendations
              </h2>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {policy?.recommendations?.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl bg-white p-4 text-sm font-semibold leading-6 text-slate-700"
                  >
                    ✅ {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
              <h2 className="text-lg font-extrabold text-yellow-800">
                Important Note
              </h2>

              <p className="mt-2 text-sm leading-7 text-yellow-800">
                {policy?.note}
              </p>

              <p className="mt-3 text-sm font-bold text-yellow-900">
                Contact: {policy?.contact_email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SecurityPolicy;