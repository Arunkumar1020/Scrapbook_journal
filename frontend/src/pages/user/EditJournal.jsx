import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getJournalById,
  updateJournal,
} from "../../services/journalService";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;

function EditJournal() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadJournal();
  }, []);

  async function loadJournal() {
    try {
      const journal = await getJournalById(id);

      setTitle(journal.title);
      setContent(journal.content);
      setMood(journal.mood || "");
      setImageUrl(journal.image_url || "");
    } catch (error) {
      console.error(error);
      toast.error("Failed to load journal");
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];

    setImageFile(file);

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl("");
    }
  }

  async function uploadImage() {
    if (!imageFile) {
      return imageUrl;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error("Image upload failed");
    }

    return `${API_URL}/image/${data.fileName}`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const finalImageUrl = await uploadImage();

      await updateJournal(id, {
        title,
        content,
        mood,
        image_url: finalImageUrl,
      });

      toast.success("Journal updated successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update journal");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-500">Loading journal...</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link
          to="/"
          className="text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          ← Back to dashboard
        </Link>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Edit Journal
        </h1>

        <p className="mt-2 text-slate-500">
          Update your memory, mood, or replace the scrapbook image.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Content
            </label>

            <textarea
              rows="6"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Mood
            </label>

            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Happy, Calm, Excited..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Journal Image
            </label>

            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="New preview"
                  className="mb-4 h-64 w-full rounded-xl object-cover"
                />
              ) : imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className="mb-4 h-64 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="mb-4 flex h-44 items-center justify-center rounded-xl bg-white text-sm text-slate-400">
                  No image selected
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
              />

              <p className="mt-3 text-xs text-slate-500">
                Leave empty to keep the current image.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link to="/">
            <button
              type="button"
              className="w-full rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
            >
              Cancel
            </button>
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 sm:w-auto"
          >
            {saving ? "Updating..." : "Update Journal"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditJournal;