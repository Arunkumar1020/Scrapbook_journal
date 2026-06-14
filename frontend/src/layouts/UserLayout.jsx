import { Outlet, Link, NavLink } from "react-router-dom";

function UserLayout() {
  const navClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-slate-600 hover:text-blue-600";

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

            <NavLink to="/admin/journals" className={navClass}>
              Admin
            </NavLink>
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