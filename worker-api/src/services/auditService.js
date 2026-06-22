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