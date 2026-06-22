import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { getPrivacyPolicy } from "../../services/legalService";

function PrivacyPolicy() {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPolicy();
  }, []);

  async function loadPolicy() {
    try {
      const data = await getPrivacyPolicy();
      setPolicy(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load privacy policy");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <p className="text-slate-500">Loading privacy policy...</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="text-sm font-bold text-blue-600 hover:text-blue-700"
        >
          ← Back to ScrapBook
        </Link>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-950 px-6 py-10 text-white sm:px-8">
            <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-blue-50 ring-1 ring-white/20">
              🔐 Privacy & Compliance
            </span>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight">
              Privacy Policy
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100">
              Learn how {policy?.app_name} collects, uses, protects, exports,
              and deletes user data.
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

          <div className="space-y-5 p-6 sm:p-8">
            {policy?.sections?.map((section) => (
              <div
                key={section.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <h2 className="text-lg font-extrabold text-slate-900">
                  {section.title}
                </h2>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {section.content}
                </p>
              </div>
            ))}

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <h2 className="text-lg font-extrabold text-slate-900">
                Contact
              </h2>

              <p className="mt-2 text-sm leading-7 text-slate-600">
                For privacy-related questions, contact{" "}
                <span className="font-bold text-blue-700">
                  {policy?.contact_email}
                </span>
                .
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
              <h2 className="text-lg font-extrabold text-yellow-800">
                Important Note
              </h2>

              <p className="mt-2 text-sm leading-7 text-yellow-800">
                This policy is a technical project privacy notice and should be
                reviewed by a legal professional before production business use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PrivacyPolicy;