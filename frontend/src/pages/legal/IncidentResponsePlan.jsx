import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { getIncidentResponsePlan } from "../../services/legalService";

function IncidentResponsePlan() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlan();
  }, []);

  async function loadPlan() {
    try {
      const data = await getIncidentResponsePlan();
      setPlan(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load incident response plan");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <p className="text-slate-500">Loading incident response plan...</p>
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
          <div className="bg-gradient-to-r from-red-800 via-slate-950 to-indigo-900 px-6 py-10 text-white sm:px-8">
            <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-red-50 ring-1 ring-white/20">
              🚨 Security & Incident Response
            </span>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight">
              Incident Response Plan
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-red-100">
              {plan?.purpose}
            </p>

            <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-red-100">Version</p>
                <p className="mt-1 font-bold text-white">{plan?.version}</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-red-100">Effective Date</p>
                <p className="mt-1 font-bold text-white">
                  {plan?.effective_date}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Severity Levels
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {plan?.severity_levels?.map((item) => (
                <div
                  key={item.level}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {item.level}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>

                  <p className="mt-4 rounded-xl bg-white p-3 text-sm font-bold text-red-700">
                    Response: {item.response_time}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="mt-8 text-2xl font-extrabold text-slate-900">
              Response Workflow
            </h2>

            <div className="mt-5 grid gap-4">
              {plan?.response_steps?.map((step, index) => (
                <div
                  key={step.step}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-sm font-extrabold text-white">
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">
                        {step.step}
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <h2 className="text-xl font-extrabold text-slate-900">
                Current Security Controls
              </h2>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {plan?.current_controls?.map((control) => (
                  <div
                    key={control}
                    className="rounded-xl bg-white p-4 text-sm font-semibold text-slate-700"
                  >
                    ✅ {control}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
              <h2 className="text-lg font-extrabold text-yellow-800">
                Important Note
              </h2>

              <p className="mt-2 text-sm leading-7 text-yellow-800">
                {plan?.note}
              </p>

              <p className="mt-3 text-sm font-bold text-yellow-900">
                Contact: {plan?.contact_email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IncidentResponsePlan;