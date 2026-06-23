import {
  Outlet,
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navClass = ({ isActive }) =>
    isActive
      ? "rounded-2xl bg-purple-600 px-5 py-3 text-sm font-bold text-white shadow-sm"
      : "rounded-2xl px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-purple-600";

  function handleLogout() {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/admin/journals" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-slate-900 text-xl text-white shadow-sm">
              🛡️
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Admin Panel
              </h1>
              <p className="text-xs font-medium text-slate-500">
                ScrapBook Control Center
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/admin/journals" className={navClass}>
              📊 Dashboard
            </NavLink>
            
            <Link
              to="/"
              className="rounded-2xl px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-blue-600"
            >
              🏠 User Area
            </Link>
            
          </nav>
            <NavLink
  to="/admin/compliance"
  className={navClass}
>
  🏛 Compliance
</NavLink><NavLink to="/admin/privacy-requests" className={navClass}>
  📝 Privacy Requests
</NavLink>
          <div className="flex items-center gap-3">
            <div className="hidden rounded-2xl border border-purple-100 bg-purple-50 px-4 py-2 md:block">
              <p className="text-sm font-bold text-slate-900">
                {user?.name}
              </p>
              <p className="text-xs text-slate-500">
                {user?.email}
              </p>
            </div>

            <span className="hidden rounded-full bg-purple-100 px-3 py-2 text-xs font-bold text-purple-700 sm:inline">
              {user?.role || "admin"}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-r from-slate-950 via-purple-900 to-indigo-900">
        <div className="mx-auto max-w-7xl px-4 py-12 text-white">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-purple-50 ring-1 ring-white/20">
                🛡️ Admin Control Center
              </span>

              <h2 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Welcome, {user?.name || "Admin"} 👋
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-purple-100 sm:text-base">
                Manage users, monitor journals, review platform activity, and
                control role-based access from one secure dashboard.
              </p>
            </div>

            <Link to="/">
              <button className="rounded-2xl bg-white px-7 py-4 text-sm font-extrabold text-purple-700 shadow-sm hover:bg-purple-50">
                🏠 Back to User Area
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

export default AdminLayout;