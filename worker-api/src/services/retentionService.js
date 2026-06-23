import { getDb } from "../utils/db";

export async function getRetentionSettings(env) {
  const sql = getDb(env);

  const result = await sql`
    SELECT *
    FROM retention_settings
    ORDER BY id ASC
    LIMIT 1
  `;

  return result[0];
}

export async function updateRetentionSettings(
  env,
  retentionDays,
  enabled
) {
  const sql = getDb(env);

  const result = await sql`
    UPDATE retention_settings
    SET
      retention_days = ${retentionDays},
      enabled = ${enabled},
      updated_at = NOW()
    WHERE id = (
      SELECT id
      FROM retention_settings
      ORDER BY id ASC
      LIMIT 1
    )
    RETURNING *
  `;

  return result[0];
}

export async function previewRetentionCleanup(env) {
  const sql = getDb(env);

  const settings = await getRetentionSettings(env);

  if (!settings || !settings.enabled) {
    return {
      enabled: false,
      retention_days: settings?.retention_days || 0,
      expired_journals: 0,
    };
  }

  const expiredJournals = await sql`
    SELECT COUNT(*)::int AS count
    FROM journals
    WHERE created_at < NOW() - (${settings.retention_days} || ' days')::interval
  `;

  return {
    enabled: true,
    retention_days: settings.retention_days,
    expired_journals: expiredJournals[0].count,
  };
}

export async function runRetentionCleanup(env) {
  const sql = getDb(env);

  const settings = await getRetentionSettings(env);

  if (!settings || !settings.enabled) {
    return {
      enabled: false,
      retention_days: settings?.retention_days || 0,
      deleted_journals: 0,
      deleted_images: 0,
    };
  }

  const expiredJournals = await sql`
    SELECT id, image_url
    FROM journals
    WHERE created_at < NOW() - (${settings.retention_days} || ' days')::interval
  `;

  let deletedImages = 0;

  for (const journal of expiredJournals) {
    if (journal.image_url) {
      const parts = journal.image_url.split("/image/");
      const fileName = parts[1];

      if (fileName) {
        await env.IMAGES_BUCKET.delete(fileName);
        deletedImages += 1;
      }
    }
  }

  await sql`
    DELETE FROM journals
    WHERE created_at < NOW() - (${settings.retention_days} || ' days')::interval
  `;

  return {
    enabled: true,
    retention_days: settings.retention_days,
    deleted_journals: expiredJournals.length,
    deleted_images: deletedImages,
  };
}
