import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getAdminPrivacyContacts,
  createPrivacyContact,
  updatePrivacyContact,
  deletePrivacyContact,
} from "../../services/privacyContactService";

function PrivacyContactManagement() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    contact_name: "",
    role_title: "",
    email: "",
    phone: "",
    address: "",
    is_dpo: false,
    is_active: true,
  });

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      const data = await getAdminPrivacyContacts();
      setContacts(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load privacy contacts");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      contact_name: "",
      role_title: "",
      email: "",
      phone: "",
      address: "",
      is_dpo: false,
      is_active: true,
    });
  }

  function handleEdit(contact) {
    setEditingId(contact.id);

    setForm({
      contact_name: contact.contact_name || "",
      role_title: contact.role_title || "",
      email: contact.email || "",
      phone: contact.phone || "",
      address: contact.address || "",
      is_dpo: Boolean(contact.is_dpo),
      is_active: Boolean(contact.is_active),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.contact_name.trim()) {
      toast.error("Contact name is required");
      return;
    }

    if (!form.role_title.trim()) {
      toast.error("Role title is required");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await updatePrivacyContact(editingId, form);
        toast.success("Privacy contact updated");
      } else {
        await createPrivacyContact(form);
        toast.success("Privacy contact created");
      }

      resetForm();
      await loadContacts();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save privacy contact");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(contactId) {
    const confirmDelete = window.confirm(
      "Delete this privacy contact?"
    );

    if (!confirmDelete) return;

    setSaving(true);

    try {
      await deletePrivacyContact(contactId);
      toast.success("Privacy contact deleted");
      await loadContacts();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to delete privacy contact");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-500">Loading privacy contacts...</p>
      </section>
    );
  }

  const activeContacts = contacts.filter((contact) => contact.is_active);
  const dpoContacts = contacts.filter((contact) => contact.is_dpo);

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          DPO / Privacy Contact Management
        </h1>

        <p className="mt-2 text-slate-500">
          Manage public privacy contact and Data Protection Officer details.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
          <p className="text-xs font-bold uppercase text-blue-600">
            Total Contacts
          </p>

          <h2 className="mt-3 text-4xl font-extrabold text-blue-700">
            {contacts.length}
          </h2>
        </div>

        <div className="rounded-3xl border border-green-100 bg-green-50 p-6">
          <p className="text-xs font-bold uppercase text-green-600">
            Active Contacts
          </p>

          <h2 className="mt-3 text-4xl font-extrabold text-green-700">
            {activeContacts.length}
          </h2>
        </div>

        <div className="rounded-3xl border border-purple-100 bg-purple-50 p-6">
          <p className="text-xs font-bold uppercase text-purple-600">
            DPO Contacts
          </p>

          <h2 className="mt-3 text-4xl font-extrabold text-purple-700">
            {dpoContacts.length}
          </h2>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          {editingId ? "Edit Privacy Contact" : "Add Privacy Contact"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-5 grid gap-5 lg:grid-cols-2"
        >
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Contact Name
            </label>

            <input
              value={form.contact_name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  contact_name: e.target.value,
                }))
              }
              placeholder="Example: ScrapBook Privacy Team"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Role Title
            </label>

            <input
              value={form.role_title}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  role_title: e.target.value,
                }))
              }
              placeholder="Example: Privacy Contact / DPO"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Email
            </label>

            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              placeholder="privacy@scrapbook.app"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Phone
            </label>

            <input
              value={form.phone}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
              placeholder="+91..."
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Address
            </label>

            <textarea
              rows="3"
              value={form.address}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
              placeholder="Business/privacy contact address"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              checked={form.is_dpo}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  is_dpo: e.target.checked,
                }))
              }
              className="h-5 w-5"
            />
            This contact is a DPO
          </label>

          <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  is_active: e.target.checked,
                }))
              }
              className="h-5 w-5"
            />
            Active public contact
          </label>

          <div className="flex flex-wrap gap-3 lg:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-blue-300"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Contact"
                : "Add Contact"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl bg-slate-100 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Privacy Contacts
        </h2>

        <div className="mt-6 grid gap-5">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div>
                  <div className="flex flex-wrap gap-2">
                    {contact.is_dpo && (
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                        DPO
                      </span>
                    )}

                    <span
                      className={
                        contact.is_active
                          ? "rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700"
                          : "rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700"
                      }
                    >
                      {contact.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                    {contact.contact_name}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    {contact.role_title}
                  </p>

                  <p className="mt-2 text-sm text-blue-700">
                    {contact.email}
                  </p>

                  {contact.phone && (
                    <p className="mt-1 text-sm text-slate-600">
                      {contact.phone}
                    </p>
                  )}

                  {contact.address && (
                    <p className="mt-3 max-w-3xl rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600">
                      {contact.address}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEdit(contact)}
                    disabled={saving}
                    className="rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(contact.id)}
                    disabled={saving}
                    className="rounded-xl bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {contacts.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No privacy contacts found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default PrivacyContactManagement;