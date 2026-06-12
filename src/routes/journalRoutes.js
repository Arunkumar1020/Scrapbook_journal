
import {
  getJournals,
  getJournalById,
} from "../controllers/journalController";

export async function handleJournalRoutes(request) {
  const url = new URL(request.url);

  if (
    request.method === "GET" &&
    url.pathname === "/api/journals"
  ) {
    return getJournals();
  }
  const journalMatch =
  url.pathname.match(/^\/api\/journals\/([^/]+)$/);

if (
  request.method === "GET" &&
  journalMatch
) {
  const id = journalMatch[1];

  return getJournalById(id);
}

  return null;
}