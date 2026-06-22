import {
  Outlet,
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function UserLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navClass = ({ isActive }) =>
    isActive
      ? "rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm"
      : "rounded-2xl px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-blue-600";

  function handleLogout() {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-xl text-white shadow-sm">
              📘
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                ScrapBook
              </h1>
              <p className="text-xs font-medium text-slate-500">
                Journal Tracker
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={navClass}>
              🏠 Dashboard
            </NavLink>

            <NavLink to="/journals/create" className={navClass}>
              ✍️ Create Journal
            </NavLink>
            <NavLink to="/profile" className={navClass}>
            👤 Profile
            </NavLink>
            {user?.role === "admin" && (
              <NavLink to="/admin/journals" className={navClass}>
                🛡️ Admin Panel
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 md:block">
              <p className="text-sm font-bold text-slate-900">
                {user?.name}
              </p>
              <p className="text-xs text-slate-500">
                {user?.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-12 text-white">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-blue-50 ring-1 ring-white/20">
                ✨ Personal Memory Space
              </span>

              <h2 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Welcome back, {user?.name || "Writer"} 👋
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
                Capture your memories, moods, images, and meaningful moments in
                your private scrapbook timeline.
              </p>
            </div>

            <Link to="/journals/create">
              <button className="rounded-2xl bg-white px-7 py-4 text-sm font-extrabold text-blue-700 shadow-sm hover:bg-blue-50">
                ✍️ New Journal
              </button>
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;