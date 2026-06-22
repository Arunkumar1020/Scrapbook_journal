import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { registerUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [consentGiven, setConsentGiven] =
    useState(false);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!consentGiven) {
      toast.error(
        "Please accept the privacy consent to continue"
      );
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser({
        name,
        email,
        password,
        consent_given: consentGiven,
      });

      login(data.user, data.token);

      toast.success("Account created successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white">
            📘
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900">
            Create account
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Start your private scrapbook journal with
            secure login and consent-based data handling.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              minLength="6"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <label className="flex cursor-pointer gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) =>
                setConsentGiven(e.target.checked)
              }
              className="mt-1 h-4 w-4"
            />

            <span className="text-sm leading-6 text-slate-600">
              I agree to the collection and processing of
              my account and journal data for providing
              ScrapBook services. I understand that I can
              request data export or account deletion later. <Link
          to="/privacy"
            className="font-bold text-red-600 hover:text-green-700">Privacy Policy
          </Link>
            </span>
          </label>
         
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-blue-600 hover:text-blue-700"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Register;