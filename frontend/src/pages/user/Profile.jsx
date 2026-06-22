import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { exportMyData } from "../../services/authService";

function Profile() {
  const { user } = useAuth();

  async function handleExportData() {
    try {
      const data = await exportMyData();

      const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        {
          type: "application/json",
        }
      );

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "scrapbook-data-export.json";
      link.click();

      URL.revokeObjectURL(url);

      toast.success("Data exported successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export data");
    }
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Profile & Privacy
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your account privacy and export your personal data.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Account Information
        </h2>

        <div className="mt-5 grid gap-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase text-slate-500">
              Name
            </p>
            <p className="mt-1 font-semibold text-slate-900">
              {user?.name}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase text-slate-500">
              Email
            </p>
            <p className="mt-1 font-semibold text-slate-900">
              {user?.email}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase text-slate-500">
              Role
            </p>
            <p className="mt-1 font-semibold text-slate-900">
              {user?.role}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-6">
        <h2 className="text-xl font-bold text-slate-900">
          Data Export
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Download a copy of your account and journal data in JSON format.
          This supports privacy and portability requirements.
        </p>

        <button
          onClick={handleExportData}
          className="mt-5 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700"
        >
          Download My Data
        </button>
      </div>
    </section>
  );
}

export default Profile;