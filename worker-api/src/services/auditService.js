import { getDb } from "../utils/db";

export async function createAuditLog(
  env,
  {
    actorUserId = null,
    action,
    targetType = null,
    targetId = null,
    metadata = {},
  }
) {
  const sql = getDb(env);

  const result = await sql`
    INSERT INTO audit_logs
    (
      actor_user_id,
      action,
      target_type,
      target_id,
      metadata
    )
    VALUES
    (
      ${actorUserId},
      ${action},
      ${targetType},
      ${targetId},
      ${metadata}
    )
    RETURNING *
  `;

  return result[0];
}

export async function getRecentAuditLogs(env) {
  const sql = getDb(env);

  return await sql`
    SELECT
      audit_logs.*,
      users.name AS actor_name,
      users.email AS actor_email
    FROM audit_logs
    LEFT JOIN users
    ON audit_logs.actor_user_id = users.id
    ORDER BY audit_logs.created_at DESC
    LIMIT 50
  `;
}

export async function getSecuritySummary(env) {
  const sql = getDb(env);

  const failedLogins = await sql`
    SELECT COUNT(*)::int AS count
    FROM audit_logs
    WHERE action = 'FAILED_LOGIN'
  `;

  const mfaSuccess = await sql`
    SELECT COUNT(*)::int AS count
    FROM audit_logs
    WHERE action = 'MFA_LOGIN_SUCCESS'
  `;

  const mfaFailures = await sql`
    SELECT COUNT(*)::int AS count
    FROM audit_logs
    WHERE action = 'MFA_LOGIN_FAILED'
  `;

  const dataExports = await sql`
    SELECT COUNT(*)::int AS count
    FROM audit_logs
    WHERE action = 'DATA_EXPORTED'
  `;

  const accountDeletes = await sql`
    SELECT COUNT(*)::int AS count
    FROM audit_logs
    WHERE action IN (
      'ACCOUNT_DELETED',
      'USER_DELETED_BY_ADMIN'
    )
  `;

  const consentWithdrawals = await sql`
    SELECT COUNT(*)::int AS count
    FROM audit_logs
    WHERE action = 'CONSENT_WITHDRAWN'
  `;

  const roleChanges = await sql`
    SELECT COUNT(*)::int AS count
    FROM audit_logs
    WHERE action = 'USER_ROLE_UPDATED'
  `;

  return {
    failedLogins: failedLogins[0].count,
    mfaSuccess: mfaSuccess[0].count,
    mfaFailures: mfaFailures[0].count,
    dataExports: dataExports[0].count,
    accountDeletes: accountDeletes[0].count,
    consentWithdrawals:
      consentWithdrawals[0].count,
    roleChanges: roleChanges[0].count,
  };
}