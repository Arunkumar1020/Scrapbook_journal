import { getDb } from "../utils/db";

const VALID_SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const VALID_STATUSES = [
  "OPEN",
  "INVESTIGATING",
  "NOTIFICATION_REQUIRED",
  "NOTIFIED",
  "RESOLVED",
  "CLOSED",
];

export async function createBreachIncident(env, data) {
  const sql = getDb(env);

  if (!VALID_SEVERITIES.includes(data.severity)) {
    throw new Error("Invalid breach severity");
  }

  const result = await sql`
    INSERT INTO breach_incidents
    (
      title,
      description,
      severity,
      status,
      affected_data,
      affected_user_count,
      notification_required,
      regulatory_deadline_at,
      reported_by,
      assigned_to
    )
    VALUES
    (
      ${data.title},
      ${data.description || ""},
      ${data.severity},
      ${data.status || "OPEN"},
      ${data.affected_data || ""},
      ${Number(data.affected_user_count || 0)},
      ${Boolean(data.notification_required)},
      ${
        data.notification_required
          ? sql`NOW() + INTERVAL '72 hours'`
          : null
      },
      ${data.reported_by},
      ${data.assigned_to || null}
    )
    RETURNING *
  `;

  return result[0];
}

export async function getAllBreachIncidents(env) {
  const sql = getDb(env);

  return await sql`
    SELECT
      breach_incidents.*,
      reporter.name AS reported_by_name,
      reporter.email AS reported_by_email,
      assignee.name AS assigned_to_name,
      assignee.email AS assigned_to_email
    FROM breach_incidents
    LEFT JOIN users AS reporter
      ON breach_incidents.reported_by = reporter.id
    LEFT JOIN users AS assignee
      ON breach_incidents.assigned_to = assignee.id
    ORDER BY breach_incidents.created_at DESC
  `;
}

export async function updateBreachIncident(env, incidentId, data) {
  const sql = getDb(env);

  if (data.severity && !VALID_SEVERITIES.includes(data.severity)) {
    throw new Error("Invalid breach severity");
  }

  if (data.status && !VALID_STATUSES.includes(data.status)) {
    throw new Error("Invalid breach status");
  }

  const result = await sql`
    UPDATE breach_incidents
    SET
      title = COALESCE(${data.title || null}, title),
      description = COALESCE(${data.description || null}, description),
      severity = COALESCE(${data.severity || null}, severity),
      status = COALESCE(${data.status || null}, status),
      affected_data = COALESCE(${data.affected_data || null}, affected_data),
      affected_user_count = COALESCE(${data.affected_user_count ?? null}, affected_user_count),
      notification_required = COALESCE(${data.notification_required ?? null}, notification_required),
      notified_at = CASE
        WHEN ${data.status || ""} = 'NOTIFIED' THEN NOW()
        ELSE notified_at
      END,
      resolved_at = CASE
        WHEN ${data.status || ""} IN ('RESOLVED', 'CLOSED') THEN NOW()
        ELSE resolved_at
      END,
      resolution_notes = COALESCE(${data.resolution_notes || null}, resolution_notes),
      assigned_to = COALESCE(${data.assigned_to || null}, assigned_to),
      updated_at = NOW()
    WHERE id = ${incidentId}
    RETURNING *
  `;

  return result[0];
}

export async function getBreachAnalytics(env) {
  const sql = getDb(env);

  const result = await sql`
    SELECT
      (SELECT COUNT(*)::int FROM breach_incidents) AS total_incidents,
      (SELECT COUNT(*)::int FROM breach_incidents WHERE status = 'OPEN') AS open_incidents,
      (SELECT COUNT(*)::int FROM breach_incidents WHERE status = 'INVESTIGATING') AS investigating_incidents,
      (SELECT COUNT(*)::int FROM breach_incidents WHERE status = 'NOTIFICATION_REQUIRED') AS notification_required,
      (SELECT COUNT(*)::int FROM breach_incidents WHERE status = 'NOTIFIED') AS notified_incidents,
      (SELECT COUNT(*)::int FROM breach_incidents WHERE status IN ('RESOLVED', 'CLOSED')) AS resolved_incidents,
      (SELECT COUNT(*)::int FROM breach_incidents WHERE severity = 'CRITICAL') AS critical_incidents,
      (SELECT COUNT(*)::int FROM breach_incidents WHERE severity = 'HIGH') AS high_incidents
  `;

  const row = result[0];

  return {
    totalIncidents: row.total_incidents || 0,
    openIncidents: row.open_incidents || 0,
    investigatingIncidents: row.investigating_incidents || 0,
    notificationRequired: row.notification_required || 0,
    notifiedIncidents: row.notified_incidents || 0,
    resolvedIncidents: row.resolved_incidents || 0,
    criticalIncidents: row.critical_incidents || 0,
    highIncidents: row.high_incidents || 0,
  };
}