import { Link } from "react-router-dom";

function JournalCard({ journal, onDelete }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        {journal.image_url ? (
          <img
            src={journal.image_url}
            alt={journal.title}
            className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-56 w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-100 text-slate-500">
            No Image
          </div>
        )}

        {journal.mood && (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-blue-700 shadow-sm backdrop-blur">
            {journal.mood}
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="line-clamp-1 text-xl font-bold text-slate-900">
          {journal.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {journal.content}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <p className="text-xs font-medium text-slate-400">
            {new Date(journal.created_at).toLocaleDateString()}
          </p>

          <div className="flex gap-2">
            <Link to={`/journals/${journal.id}`}>
              <button className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700">
                View
              </button>
            </Link>

            <Link to={`/journals/edit/${journal.id}`}>
              <button className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700">
                Edit
              </button>
            </Link>

            <button
              onClick={() => onDelete(journal.id)}
              className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default JournalCard;