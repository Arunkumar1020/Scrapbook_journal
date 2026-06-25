import { getDb } from "../utils/db";

export async function getActivePrivacyContact(env) {
  const sql = getDb(env);

  const result = await sql`
    SELECT *
    FROM privacy_contacts
    WHERE is_active = true
    ORDER BY is_dpo DESC, updated_at DESC
    LIMIT 1
  `;

  return result[0];
}

export async function getAllPrivacyContacts(env) {
  const sql = getDb(env);

  return await sql`
    SELECT *
    FROM privacy_contacts
    ORDER BY created_at DESC
  `;
}

export async function createPrivacyContact(env, data) {
  const sql = getDb(env);

  const result = await sql`
    INSERT INTO privacy_contacts
    (
      contact_name,
      role_title,
      email,
      phone,
      address,
      is_dpo,
      is_active
    )
    VALUES
    (
      ${data.contact_name},
      ${data.role_title},
      ${data.email},
      ${data.phone || ""},
      ${data.address || ""},
      ${Boolean(data.is_dpo)},
      ${data.is_active !== false}
    )
    RETURNING *
  `;

  return result[0];
}

export async function updatePrivacyContact(env, contactId, data) {
  const sql = getDb(env);

  const result = await sql`
    UPDATE privacy_contacts
    SET
      contact_name = COALESCE(${data.contact_name || null}, contact_name),
      role_title = COALESCE(${data.role_title || null}, role_title),
      email = COALESCE(${data.email || null}, email),
      phone = COALESCE(${data.phone ?? null}, phone),
      address = COALESCE(${data.address ?? null}, address),
      is_dpo = COALESCE(${data.is_dpo ?? null}, is_dpo),
      is_active = COALESCE(${data.is_active ?? null}, is_active),
      updated_at = NOW()
    WHERE id = ${contactId}
    RETURNING *
  `;

  return result[0];
}

export async function deletePrivacyContact(env, contactId) {
  const sql = getDb(env);

  const result = await sql`
    DELETE FROM privacy_contacts
    WHERE id = ${contactId}
    RETURNING *
  `;

  return result[0];
}