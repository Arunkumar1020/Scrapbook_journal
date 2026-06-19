import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import JournalCard from "../../components/journal/JournalCard";
import DeleteModal from "../../components/common/DeleteModal";

import {
  getAllJournals,
  deleteJournal,
} from "../../services/journalService";

function Dashboard() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [selectedMood, setSelectedMood] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedJournalId, setSelectedJournalId] = useState(null);

  useEffect(() => {
    loadJournals();
  }, []);

  async function loadJournals() {
    try {
      const data = await getAllJournals();
      setJournals(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load journals");
    } finally {
      setLoading(false);
    }
  }

  const moods = useMemo(() => {
    const moodList = journals
      .map((journal) => journal.mood)
      .filter(Boolean);

    return ["all", ...new Set(moodList)];
  }, [journals]);

  const filteredJournals = useMemo(() => {
    return journals
      .filter((journal) => {
        const text = searchText.toLowerCase();

        const matchesSearch =
          journal.title?.toLowerCase().includes(text) ||
          journal.content?.toLowerCase().includes(text);

        const matchesMood =
          selectedMood === "all" || journal.mood === selectedMood;

        return matchesSearch && matchesMood;
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);

        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [journals, searchText, selectedMood, sortOrder]);

  const totalImages = journals.filter((journal) => journal.image_url).length;

  function handleDelete(id) {
    setSelectedJournalId(id);
    setIsDeleteOpen(true);
  }

  async function confirmDelete() {
    try {
      await deleteJournal(selectedJournalId);

      setJournals((prevJournals) =>
        prevJournals.filter((journal) => journal.id !== selectedJournalId)
      );

      toast.success("Journal deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete journal");
    } finally {
      setIsDeleteOpen(false);
      setSelectedJournalId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-3xl bg-white px-8 py-6 shadow-sm">
          <p className="font-medium text-slate-500">
            Loading your scrapbook...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section>
        <div className="mb-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              📚 Total Journals
            </p>
            <h2 className="mt-3 text-4xl font-extrabold text-slate-900">
              {journals.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              🖼️ Images Added
            </p>
            <h2 className="mt-3 text-4xl font-extrabold text-slate-900">
              {totalImages}
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              😊 Mood Types
            </p>
            <h2 className="mt-3 text-4xl font-extrabold text-slate-900">
              {moods.length - 1}
            </h2>
          </div>
        </div>

        {journals.length > 0 && (
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Your Journal Timeline
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Search, filter, and organize your memories.
                </p>
              </div>

              <Link to="/journals/create">
                <button className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">
                  ✍️ Add Memory
                </button>
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Search
                </label>

                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search title or content..."
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Mood
                </label>

                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  {moods.map((mood) => (
                    <option key={mood} value={mood}>
                      {mood === "all" ? "All moods" : mood}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Sort
                </label>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <p>
                Showing{" "}
                <span className="font-bold text-slate-900">
                  {filteredJournals.length}
                </span>{" "}
                of {journals.length} journals
              </p>

              {(searchText || selectedMood !== "all") && (
                <button
                  onClick={() => {
                    setSearchText("");
                    setSelectedMood("all");
                    setSortOrder("newest");
                  }}
                  className="font-bold text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}

        {journals.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
              📘
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900">
              Start your scrapbook
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              Create your first journal entry with a memory, mood, and image.
            </p>

            <Link to="/journals/create">
              <button className="mt-6 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700">
                ✍️ Create First Journal
              </button>
            </Link>
          </div>
        ) : filteredJournals.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-extrabold text-slate-900">
              No matching journals
            </h2>

            <p className="mt-2 text-slate-500">
              Try changing your search, mood filter, or sort option.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredJournals.map((journal) => (
              <JournalCard
                key={journal.id}
                journal={journal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedJournalId(null);
        }}
        onConfirm={confirmDelete}
      />
    </>
  );
}

export default Dashboard;