import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === "admin";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const navClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-200"
      : "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950";

  const sectionTitle =
    "px-4 pt-5 pb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-400";

  const pageTitleMap = {
    "/": "My Journal Dashboard",
    "/journals/create": "Create New Journal",
    "/profile": "Profile & Privacy",
    "/mfa-settings": "MFA Security Settings",
    "/privacy-requests": "Privacy Request Center",
    "/admin/compliance": "Compliance Hub",
    "/admin/journals": "Admin Journal Management",
    "/admin/privacy-requests": "Admin Privacy Requests",
    "/admin/retention": "Data Retention Management",
    "/admin/breaches": "Breach Register",
    "/admin/vendors": "Vendor Register",
    "/admin/backups": "Backup Register",
    "/admin/privacy-contacts": "Privacy Contacts",
  };

  const currentTitle =
    pageTitleMap[location.pathname] || "ScrapBook Workspace";

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed left-0 top-0 hidden h-screen w-80 border-r border-slate-200 bg-white p-5 shadow-sm lg:block">
        <div className="rounded-[2rem] bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 p-5 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl ring-1 ring-white/20">
              📖
            </div>

            <div>
              <h1 className="text-xl font-extrabold">ScrapBook</h1>
              <p className="text-xs font-semibold text-blue-100">
                Journal Workspace
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-100">
              Welcome
            </p>
            <p className="mt-1 text-sm font-bold">
              Capture, reflect and protect your memories.
            </p>
          </div>
        </div>

        <nav className="mt-5 h-[calc(100vh-250px)] space-y-1 overflow-y-auto pr-1">
          <p className={sectionTitle}>User Workspace</p>

          <NavLink to="/" className={navClass}>
            🏠 Dashboard
          </NavLink>

          <NavLink to="/journals/create" className={navClass}>
            ✍️ Create Journal
          </NavLink>

          <NavLink to="/profile" className={navClass}>
            👤 Profile
          </NavLink>

          <NavLink to="/privacy-requests" className={navClass}>
            📝 Privacy Requests
          </NavLink>

          <NavLink to="/mfa-settings" className={navClass}>
            🔐 MFA Settings
          </NavLink>

          {isAdmin && (
            <>
              <p className={sectionTitle}>Admin Console</p>

              <NavLink to="/admin/compliance" className={navClass}>
                🏛️ Compliance Hub
              </NavLink>

              <NavLink to="/admin/journals" className={navClass}>
                📓 Manage Journals
              </NavLink>

              <NavLink to="/admin/privacy-requests" className={navClass}>
                📝 Manage Privacy Requests
              </NavLink>

              <NavLink to="/admin/retention" className={navClass}>
                🗂️ Data Retention
              </NavLink>

              <NavLink to="/admin/breaches" className={navClass}>
                🚨 Breach Register
              </NavLink>

              <NavLink to="/admin/vendors" className={navClass}>
                🏢 Vendor Register
              </NavLink>

              <NavLink to="/admin/backups" className={navClass}>
                💾 Backup Register
              </NavLink>

              <NavLink to="/admin/privacy-contacts" className={navClass}>
                📞 Privacy Contacts
              </NavLink>
            </>
          )}

          <p className={sectionTitle}>Legal</p>

          <NavLink to="/compliance" className={navClass}>
            🏛️ Compliance Center
          </NavLink>

          <NavLink to="/privacy" className={navClass}>
            📄 Privacy Policy
          </NavLink>

          <NavLink to="/cookies" className={navClass}>
            🍪 Cookie Policy
          </NavLink>

          <NavLink to="/terms" className={navClass}>
            📜 Terms
          </NavLink>
        </nav>

        <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase text-slate-400">
            Signed in as
          </p>
          <p className="mt-1 truncate text-sm font-extrabold text-slate-900">
            {user?.name || "User"}
          </p>
          <p className="truncate text-xs text-slate-500">{user?.email}</p>

          <button
            onClick={handleLogout}
            className="mt-4 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-red-600"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-80">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur lg:px-8">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">
                {isAdmin ? "Admin + User Workspace" : "User Workspace"}
              </p>

              <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                {currentTitle}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Journaling, privacy controls, security and compliance access.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-green-50 px-4 py-2 text-xs font-extrabold text-green-700">
                ● Active
              </span>

              <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-extrabold text-blue-700">
                {user?.role || "user"}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-full bg-slate-950 px-4 py-2 text-xs font-extrabold text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="px-5 py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default UserLayout;