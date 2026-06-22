import { getDb } from "../utils/db";

function extractFileNameFromImageUrl(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  const parts = imageUrl.split("/image/");
  return parts[1] || null;
}

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

export async function getUserConsent(env, userId) {
  const sql = getDb(env);

  const result = await sql`
    SELECT
      id,
      name,
      email,
      consent_given,
      consent_given_at
    FROM users
    WHERE id = ${userId}
  `;

  return result[0];
}

export async function updateUserConsent(
  env,
  userId,
  consentGiven
) {
  const sql = getDb(env);

  const result = await sql`
    UPDATE users
    SET
      consent_given = ${consentGiven},
      consent_given_at = CASE
        WHEN ${consentGiven} = true THEN NOW()
        ELSE consent_given_at
      END
    WHERE id = ${userId}
    RETURNING
      id,
      name,
      email,
      consent_given,
      consent_given_at
  `;

  return result[0];
}

export async function deleteMyAccountData(env, userId) {
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
    RETURNING id, name, email
  `;

  return result[0];
}