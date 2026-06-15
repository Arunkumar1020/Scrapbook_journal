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