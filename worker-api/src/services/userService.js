import { getDb } from "../utils/db";

export async function exportUserData(env, userId) {
  const sql = getDb(env);

  const userResult = await sql`
    SELECT
      id,
      name,
      email,
      role,
      consent_given,
      consent_given_at,
      created_at
    FROM users
    WHERE id = ${userId}
  `;

  const journals = await sql`
    SELECT
      id,
      title,
      content,
      mood,
      image_url,
      created_at
    FROM journals
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;

  return {
    exported_at: new Date().toISOString(),
    user: userResult[0],
    journals,
  };
}