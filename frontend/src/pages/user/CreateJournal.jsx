import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createJournal } from "../../services/journalService";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;

function CreateJournal() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

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
      return "";
    }

    const formData = new FormData();
    formData.append("image", imageFile);

   const token = localStorage.getItem("token");

const response = await fetch(`${API_URL}/upload`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
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
    setLoading(true);

    try {
      const imageUrl = await uploadImage();

      await createJournal({
        title,
        content,
        mood,
        image_url: imageUrl,
      });

      toast.success("Journal created successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create journal");
    } finally {
      setLoading(false);
    }
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
          Create Journal
        </h1>

        <p className="mt-2 text-slate-500">
          Add a memory, mood, and image to your scrapbook timeline.
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
              placeholder="A beautiful day..."
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
              placeholder="Write your memory here..."
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
              Image
            </label>

            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mb-4 h-64 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="mb-4 flex h-44 items-center justify-center rounded-xl bg-white text-sm text-slate-400">
                  Image preview will appear here
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
              />
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
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 sm:w-auto"
          >
            {loading ? "Saving..." : "Save Journal"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreateJournal;