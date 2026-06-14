import { getDb } from "../utils/db";

export async function getAllJournals(
  env,
  userId
) {
  const sql = getDb(env);

  return await sql`
    SELECT *
    FROM journals
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
}

export async function getJournalByIdDb(
  env,
  id,
  userId
) {
  const sql = getDb(env);

  const result = await sql`
    SELECT *
    FROM journals
    WHERE id = ${id}
    AND user_id = ${userId}
  `;

  return result[0];
}

export async function createJournalDb(
  env,
  title,
  content,
  mood,
  image_url,
  userId
) {
  const sql = getDb(env);

  const result = await sql`
    INSERT INTO journals
    (
      title,
      content,
      mood,
      image_url,
      user_id
    )
    VALUES
    (
      ${title},
      ${content},
      ${mood},
      ${image_url},
      ${userId}
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
  mood,
  image_url,
  userId
) {
  const sql = getDb(env);

  const result = await sql`
    UPDATE journals
    SET
      title = ${title},
      content = ${content},
      mood = ${mood},
      image_url = ${image_url}
    WHERE id = ${id}
    AND user_id = ${userId}
    RETURNING *
  `;

  return result[0];
}

export async function deleteJournalDb(
  env,
  id,
  userId
) {
  const sql = getDb(env);

  const result = await sql`
    DELETE FROM journals
    WHERE id = ${id}
    AND user_id = ${userId}
    RETURNING *
  `;

  return result[0];
}