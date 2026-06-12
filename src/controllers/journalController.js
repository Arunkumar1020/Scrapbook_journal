import { journals } from "../data/journals";

export async function getJournals() {
  return Response.json(journals);
}

export async function getJournalById(id) {
  const journal = journals.find(
    (journal) => journal.id === id
  );

  if (!journal) {
    return Response.json(
      { message: "Journal not found" },
      { status: 404 }
    );
  }

  return Response.json(journal);
}

export async function createJournal(request) {
  const body = await request.json();

  const journal = {
    id: Date.now().toString(),
    title: body.title,
    description: body.description,
    imageUrl: body.imageUrl || "",
    createdAt: new Date().toISOString(),
  };

  journals.push(journal);

  return Response.json(journal, {
    status: 201,
  });
}

export async function updateJournal(id, request) {
  const body = await request.json();

  const journal = journals.find(
    (journal) => journal.id === id
  );

  if (!journal) {
    return Response.json(
      { message: "Journal not found" },
      { status: 404 }
    );
  }

  journal.title =
    body.title ?? journal.title;

  journal.description =
    body.description ?? journal.description;

  return Response.json(journal);
}

export async function deleteJournal(id) {
  const index = journals.findIndex(
    (journal) => journal.id === id
  );

  if (index === -1) {
    return Response.json(
      { message: "Journal not found" },
      { status: 404 }
    );
  }

  journals.splice(index, 1);

  return Response.json({
    message: "Journal deleted",
  });
}