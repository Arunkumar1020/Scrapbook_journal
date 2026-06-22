import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { getTermsAndConditions } from "../../services/legalService";

function TermsAndConditions() {
  const [terms, setTerms] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTerms();
  }, []);

  async function loadTerms() {
    try {
      const data = await getTermsAndConditions();
      setTerms(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load terms and conditions");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <p className="text-slate-500">Loading terms and conditions...</p>
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
          <div className="bg-gradient-to-r from-slate-950 via-blue-900 to-indigo-900 px-6 py-10 text-white sm:px-8">
            <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-blue-50 ring-1 ring-white/20">
              📜 Legal Agreement
            </span>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight">
              Terms & Conditions
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-blue-100">
              {terms?.introduction}
            </p>

            <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-blue-100">Version</p>
                <p className="mt-1 font-bold text-white">
                  {terms?.version}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-blue-100">Effective Date</p>
                <p className="mt-1 font-bold text-white">
                  {terms?.effective_date}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Usage Terms
            </h2>

            <div className="mt-5 grid gap-5">
              {terms?.sections?.map((section) => (
                <div
                  key={section.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {section.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <h2 className="text-xl font-extrabold text-slate-900">
                Related Policies
              </h2>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/privacy"
                  className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-100"
                >
                  🔐 Privacy Policy
                </Link>

                <Link
                  to="/data-retention"
                  className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-100"
                >
                  🗂️ Data Retention
                </Link>

                <Link
                  to="/security"
                  className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-100"
                >
                  🛡️ Security Policy
                </Link>

                <Link
                  to="/incident-response"
                  className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-100"
                >
                  🚨 Incident Response
                </Link>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-extrabold text-slate-900">
                Contact
              </h2>

              <p className="mt-2 text-sm leading-7 text-slate-600">
                For questions about these terms, contact{" "}
                <span className="font-bold text-blue-700">
                  {terms?.contact_email}
                </span>
                .
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
              <h2 className="text-lg font-extrabold text-yellow-800">
                Important Note
              </h2>

              <p className="mt-2 text-sm leading-7 text-yellow-800">
                {terms?.note}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TermsAndConditions;