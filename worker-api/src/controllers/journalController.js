import {
  getAllJournals,
  getJournalByIdDb,
  createJournalDb,
  updateJournalDb,
  deleteJournalDb,
} from "../services/journalService";

export async function getJournals(env) {
  const journals = await getAllJournals(env);
  return Response.json(journals);
}

export async function getJournalById(env, id) {
  const journal = await getJournalByIdDb(env, id);

  if (!journal) {
    return Response.json(
      { message: "Journal not found" },
      { status: 404 }
    );
  }

  return Response.json(journal);
}

export async function createJournal(env, request) {
  const body = await request.json();

  const journal = await createJournalDb(
    env,
    body.title,
    body.content,
    body.mood,
    body.image_url || ""
  );

  return Response.json(journal, { status: 201 });
}

export async function updateJournal(env, id, request) {
  const body = await request.json();

  const journal = await updateJournalDb(
    env,
    id,
    body.title,
    body.content,
    body.mood,
    body.image_url || ""
  );

  if (!journal) {
    return Response.json(
      { message: "Journal not found" },
      { status: 404 }
    );
  }

  return Response.json(journal);
}

export async function deleteJournal(env, id) {
  const deletedJournal = await deleteJournalDb(env, id);

  if (!deletedJournal) {
    return Response.json(
      { message: "Journal not found" },
      { status: 404 }
    );
  }

  return Response.json({
    success: true,
    message: "Journal deleted successfully",
    deletedJournal,
  });
}