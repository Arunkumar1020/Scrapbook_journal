import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function UserLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-slate-600 hover:text-blue-600";

  function handleLogout() {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold tracking-tight">
            📔 ScrapBook
          </Link>

          <nav className="flex items-center gap-5 text-sm">
            <NavLink to="/" className={navClass}>
              Dashboard
            </NavLink>

            <NavLink to="/journals/create" className={navClass}>
              Create
            </NavLink>
{user?.role === "admin" && (
  <NavLink to="/admin/journals" className={navClass}>
    Admin
  </NavLink>
)}

            {user && (
              <span className="hidden text-slate-500 sm:inline">
                Hi, {user.name}
              </span>
            )}

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-50 px-3 py-2 font-medium text-red-600 hover:bg-red-100"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;