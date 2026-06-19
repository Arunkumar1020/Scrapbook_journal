import { Outlet, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/admin/journals" className="text-xl font-bold">
            🛡️ Admin Panel
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <Link
              to="/"
              className="font-medium text-slate-600 hover:text-blue-600"
            >
              User Area
            </Link>

            <span className="hidden text-slate-500 sm:inline">
              {user?.name} · {user?.role}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-50 px-3 py-2 font-semibold text-red-600 hover:bg-red-100"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;