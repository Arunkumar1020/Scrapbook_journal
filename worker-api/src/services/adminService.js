import { getDb } from "../utils/db";

export async function getAdminStats(env) {
  const sql = getDb(env);

  const users = await sql`
    SELECT COUNT(*)::int AS total_users
    FROM users
  `;

  const journals = await sql`
    SELECT COUNT(*)::int AS total_journals
    FROM journals
  `;

  const images = await sql`
    SELECT COUNT(*)::int AS total_images
    FROM journals
    WHERE image_url IS NOT NULL
    AND image_url != ''
  `;

  return {
    totalUsers: users[0].total_users,
    totalJournals: journals[0].total_journals,
    totalImages: images[0].total_images,
  };
}

export async function getAdminUsers(env) {
  const sql = getDb(env);

  return await sql`
    SELECT
      users.id,
      users.name,
      users.email,
      users.role,
      users.created_at,
      COUNT(journals.id)::int AS journal_count
    FROM users
    LEFT JOIN journals
    ON users.id = journals.user_id
    GROUP BY users.id
    ORDER BY users.created_at DESC
  `;
}

export async function getAdminJournals(env) {
  const sql = getDb(env);

  return await sql`
    SELECT
      journals.*,
      users.name AS user_name,
      users.email AS user_email
    FROM journals
    LEFT JOIN users
    ON journals.user_id = users.id
    ORDER BY journals.created_at DESC
  `;
}
export async function updateUserRole(
  env,
  userId,
  role
) {
  const sql = getDb(env);

  const result = await sql`
    UPDATE users
    SET role = ${role}
    WHERE id = ${userId}
    RETURNING *
  `;

  return result[0];
}

function extractFileNameFromImageUrl(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  const parts = imageUrl.split("/image/");
  return parts[1] || null;
}

export async function deleteUser(env, userId) {
  const sql = getDb(env);

  const journals = await sql`
    SELECT image_url
    FROM journals
    WHERE user_id = ${userId}
  `;

  for (const journal of journals) {
    const fileName = extractFileNameFromImageUrl(
      journal.image_url
    );

    if (fileName) {
      await env.IMAGES_BUCKET.delete(fileName);
    }
  }

  await sql`
    DELETE FROM journals
    WHERE user_id = ${userId}
  `;

  const result = await sql`
    DELETE FROM users
    WHERE id = ${userId}
    RETURNING *
  `;

  return result[0];
}