import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { getCookiePolicy } from "../../services/legalService";

function CookiePolicy() {
  const [policy, setPolicy] = useState(null);

  useEffect(() => {
    loadPolicy();
  }, []);

  async function loadPolicy() {
    try {
      const data = await getCookiePolicy();
      setPolicy(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load cookie policy");
    }
  }

  if (!policy) {
    return (
      <div className="p-10 text-center">
        Loading Cookie Policy...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/compliance"
          className="text-sm font-bold text-blue-600"
        >
          ← Back to Compliance Center
        </Link>

        <div className="mt-6 rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-extrabold">
            🍪 Cookie Policy
          </h1>

          <p className="mt-4 text-slate-600">
            {policy.introduction}
          </p>

          <div className="mt-8 grid gap-4">
            {policy.categories.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border p-5"
              >
                <h2 className="font-bold">
                  {item.name}
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  {item.purpose}
                </p>

                <p className="mt-3 text-sm font-semibold">
                  {item.required
                    ? "Required"
                    : "Optional"}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold">
              Storage Used
            </h2>

            <ul className="mt-4 space-y-2">
              {policy.storage_used.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold">
              User Rights
            </h2>

            <ul className="mt-4 space-y-2">
              {policy.user_rights.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CookiePolicy;