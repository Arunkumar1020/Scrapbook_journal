import { Link } from "react-router-dom";

function JournalCard({ journal, onDelete }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {journal.image_url ? (
        <img
          src={journal.image_url}
          alt={journal.title}
          className="h-52 w-full object-cover"
        />
      ) : (
        <div className="flex h-52 w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-100 text-slate-500">
          No Image
        </div>
      )}

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900">
            {journal.title}
          </h3>

          {journal.mood && (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {journal.mood}
            </span>
          )}
        </div>

        <p className="mb-4 line-clamp-3 text-sm leading-6 text-slate-600">
          {journal.content}
        </p>

        <p className="mb-5 text-xs text-slate-400">
          {new Date(journal.created_at).toLocaleString()}
        </p>

        <div className="flex gap-2">
          <Link to={`/journals/${journal.id}`}>
            <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
              View
            </button>
          </Link>

          <Link to={`/journals/edit/${journal.id}`}>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Edit
            </button>
          </Link>

          <button
            onClick={() => onDelete(journal.id)}
            className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default JournalCard;