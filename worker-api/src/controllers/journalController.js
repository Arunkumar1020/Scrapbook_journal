import {
  getAllJournals,
  getJournalByIdDb,
  createJournalDb,
  updateJournalDb,
  deleteJournalDb,
} from "../services/journalService";

import { getAuthenticatedUser } from "../middleware/authMiddleware";

export async function getJournals(env, request) {
  const user = await getAuthenticatedUser(request, env);
  const journals = await getAllJournals(env, user.id);
  return Response.json(journals);
}

export async function getJournalById(env, id, request) {
  const user = await getAuthenticatedUser(request, env);
  const journal = await getJournalByIdDb(env, id, user.id);

  if (!journal) {
    return Response.json({ message: "Journal not found" }, { status: 404 });
  }

  return Response.json(journal);
}

export async function createJournal(env, request) {
  const user = await getAuthenticatedUser(request, env);
  const body = await request.json();

  const journal = await createJournalDb(
    env,
    body.title,
    body.content,
    body.mood,
    body.image_url || "",
    user.id
  );

  return Response.json(journal, { status: 201 });
}

export async function updateJournal(env, id, request) {
  const user = await getAuthenticatedUser(request, env);
  const body = await request.json();

  const journal = await updateJournalDb(
    env,
    id,
    body.title,
    body.content,
    body.mood,
    body.image_url || "",
    user.id
  );

  if (!journal) {
    return Response.json({ message: "Journal not found" }, { status: 404 });
  }

  return Response.json(journal);
}

export async function deleteJournal(env, id, request) {
  const user = await getAuthenticatedUser(request, env);
  const deletedJournal = await deleteJournalDb(env, id, user.id);

  if (!deletedJournal) {
    return Response.json({ message: "Journal not found" }, { status: 404 });
  }

  return Response.json({
    success: true,
    message: "Journal deleted successfully",
    deletedJournal,
  });
}