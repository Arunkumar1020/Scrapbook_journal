import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJournalById } from "../../services/journalService";
import toast from "react-hot-toast";
function JournalDetails() {
  const { id } = useParams();

  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJournal();
  }, []);

  async function loadJournal() {
    try {
      const data = await getJournalById(id);
      setJournal(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load journal");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-500">Loading journal...</p>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">
          Journal not found
        </h2>

        <Link
          to="/"
          className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <Link
          to="/"
          className="text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          ← Back to dashboard
        </Link>

        <Link to={`/journals/edit/${journal.id}`}>
          <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
            Edit Journal
          </button>
        </Link>
      </div>

      <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {journal.image_url ? (
          <img
            src={journal.image_url}
            alt={journal.title}
            className="h-[260px] w-full object-cover sm:h-[420px]"
          />
        ) : (
          <div className="flex h-[260px] w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-100 text-slate-500 sm:h-[420px]">
            No Image
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {journal.title}
            </h1>

            {journal.mood && (
              <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                {journal.mood}
              </span>
            )}
          </div>

          <p className="mb-6 text-sm text-slate-400">
            {new Date(journal.created_at).toLocaleString()}
          </p>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="whitespace-pre-wrap text-base leading-8 text-slate-700">
              {journal.content}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}

export default JournalDetails;