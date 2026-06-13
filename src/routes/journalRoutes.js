import {
  getJournals,
  getJournalById,
  createJournal,
  updateJournal,
  deleteJournal,
} from "../controllers/journalController";

export async function handleJournalRoutes(
  request,
  env
) {
  const url = new URL(request.url);

  if (
    request.method === "GET" &&
    url.pathname === "/api/journals"
  ) {
    return getJournals(env);
  }

  if (
    request.method === "POST" &&
    url.pathname === "/api/journals"
  ) {
    return createJournal(
      env,
      request
    );
  }
  const journalMatch =
    url.pathname.match(
      /^\/api\/journals\/([^/]+)$/
    );

  if (
    request.method === "GET" &&
    journalMatch
  ) {
    const id = Number(
      journalMatch[1]
    );

    return getJournalById(
      env,
      id
    );
  }
  if (
  request.method === "PUT" &&
  journalMatch
) {
  const id = Number(
    journalMatch[1]
  );

  return updateJournal(
    env,
    id,
    request
  );
}

if (
  request.method === "DELETE" &&
  journalMatch
) {
  const id = Number(
    journalMatch[1]
  );

  return deleteJournal(
    env,
    id
  );
}

  return null;
}