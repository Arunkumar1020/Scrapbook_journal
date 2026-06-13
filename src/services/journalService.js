import { getDb } from "../utils/db";

export async function getAllJournals(env) {
  const sql = getDb(env);

  return await sql`
    SELECT *
    FROM journals
    ORDER BY created_at DESC
  `;
}

export async function getJournalByIdDb(env, id) {
  const sql = getDb(env);

  const result = await sql`
    SELECT *
    FROM journals
    WHERE id = ${id}
  `;

  return result[0];
}

export async function createJournalDb(
  env,
  title,
  content,
  mood
) {
  const sql = getDb(env);

  const result = await sql`
    INSERT INTO journals
    (
      title,
      content,
      mood
    )
    VALUES
    (
      ${title},
      ${content},
      ${mood}
    )
    RETURNING *
  `;

  return result[0];
}
export async function updateJournalDb(
  env,
  id,
  title,
  content,
  mood
) {
  const sql = getDb(env);

  const result = await sql`
    UPDATE journals
    SET
      title = ${title},
      content = ${content},
      mood = ${mood}
    WHERE id = ${id}
    RETURNING *
  `;

  return result[0];
}

export async function deleteJournalDb(
  env,
  id
) {
  const sql = getDb(env);

  const result = await sql`
    DELETE FROM journals
    WHERE id = ${id}
    RETURNING *
  `;

  return result[0];
}