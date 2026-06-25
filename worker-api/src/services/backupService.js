import { getDb } from "../utils/db";

export async function getAllBackupRecords(env) {
  const sql = getDb(env);

  return await sql`
    SELECT *
    FROM backup_retention_register
    ORDER BY created_at DESC
  `;
}

export async function createBackupRecord(env, data) {
  const sql = getDb(env);

  const result = await sql`
    INSERT INTO backup_retention_register
    (
      provider_name,
      backup_frequency,
      storage_location,
      retention_period,
      encryption_enabled,
      restore_tested,
      last_backup_at,
      last_restore_test_at,
      notes
    )
    VALUES
    (
      ${data.provider_name},
      ${data.backup_frequency},
      ${data.storage_location},
      ${data.retention_period},
      ${Boolean(data.encryption_enabled)},
      ${Boolean(data.restore_tested)},
      ${data.last_backup_at || null},
      ${data.last_restore_test_at || null},
      ${data.notes || ""}
    )
    RETURNING *
  `;

  return result[0];
}

export async function updateBackupRecord(env, recordId, data) {
  const sql = getDb(env);

  const result = await sql`
    UPDATE backup_retention_register
    SET
      provider_name = COALESCE(${data.provider_name || null}, provider_name),
      backup_frequency = COALESCE(${data.backup_frequency || null}, backup_frequency),
      storage_location = COALESCE(${data.storage_location || null}, storage_location),
      retention_period = COALESCE(${data.retention_period || null}, retention_period),
      encryption_enabled = COALESCE(${data.encryption_enabled ?? null}, encryption_enabled),
      restore_tested = COALESCE(${data.restore_tested ?? null}, restore_tested),
      last_backup_at = COALESCE(${data.last_backup_at || null}, last_backup_at),
      last_restore_test_at = COALESCE(${data.last_restore_test_at || null}, last_restore_test_at),
      notes = COALESCE(${data.notes ?? null}, notes),
      updated_at = NOW()
    WHERE id = ${recordId}
    RETURNING *
  `;

  return result[0];
}

export async function deleteBackupRecord(env, recordId) {
  const sql = getDb(env);

  const result = await sql`
    DELETE FROM backup_retention_register
    WHERE id = ${recordId}
    RETURNING *
  `;

  return result[0];
}

export async function getBackupAnalytics(env) {
  const sql = getDb(env);

  const result = await sql`
    SELECT
      (SELECT COUNT(*)::int FROM backup_retention_register) AS total_records,
      (SELECT COUNT(*)::int FROM backup_retention_register WHERE encryption_enabled = true) AS encrypted_backups,
      (SELECT COUNT(*)::int FROM backup_retention_register WHERE restore_tested = true) AS restore_tested,
      (SELECT COUNT(*)::int FROM backup_retention_register WHERE restore_tested = false) AS restore_not_tested
  `;

  const row = result[0];

  return {
    totalRecords: row.total_records || 0,
    encryptedBackups: row.encrypted_backups || 0,
    restoreTested: row.restore_tested || 0,
    restoreNotTested: row.restore_not_tested || 0,
  };
}