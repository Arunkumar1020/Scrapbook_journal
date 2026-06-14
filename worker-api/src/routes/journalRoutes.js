import {
  getJournals,
  getJournalById,
  createJournal,
  updateJournal,
  deleteJournal,
} from "../controllers/journalController";

export async function handleJournalRoutes(request, env) {
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/api/journals") {
    return getJournals(env);
  }

  if (request.method === "POST" && url.pathname === "/api/journals") {
    return createJournal(env, request);
  }

  const journalMatch = url.pathname.match(/^\/api\/journals\/([^/]+)$/);

  if (request.method === "GET" && journalMatch) {
    return getJournalById(env, Number(journalMatch[1]));
  }

  if (request.method === "PUT" && journalMatch) {
    return updateJournal(env, Number(journalMatch[1]), request);
  }

  if (request.method === "DELETE" && journalMatch) {
    return deleteJournal(env, Number(journalMatch[1]));
  }

  return null;
}