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

    loadJournals();
  }, []);

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

        if (sortOrder === "newest") {
          return dateB - dateA;
        }

        return dateA - dateB;
      });
  }, [journals, searchText, selectedMood, sortOrder]);

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
        <p className="text-slate-500">Loading journals...</p>
      </div>
    );
  }

  return (
    <>
      <section>
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Journal Timeline
            </h1>

            <p className="mt-2 text-slate-500">
              Capture memories, moods, and moments in one place.
            </p>
          </div>

          <Link to="/journals/create">
            <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
              + New Journal
            </button>
          </Link>
        </div>

        {journals.length > 0 && (
          <div className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search title or content..."
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              {moods.map((mood) => (
                <option key={mood} value={mood}>
                  {mood === "all" ? "All moods" : mood}
                </option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        )}

        {journals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-slate-800">
              No journals yet
            </h2>

            <p className="mt-2 text-slate-500">
              Create your first scrapbook memory.
            </p>
          </div>
        ) : filteredJournals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-slate-800">
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