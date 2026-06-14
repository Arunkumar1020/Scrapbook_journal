import { Outlet, Link } from "react-router-dom";

function AdminLayout() {
  return (
    <div>
      <header>
        <h1>Admin Panel</h1>

        <nav>
          <Link to="/">User Area</Link>
        </nav>

        <hr />
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;