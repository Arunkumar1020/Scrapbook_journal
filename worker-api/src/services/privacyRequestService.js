import { getDb } from "../utils/db";

const VALID_REQUEST_TYPES = [
  "DATA_EXPORT",
  "ACCOUNT_DELETION",
  "CONSENT_WITHDRAWAL",
];

const VALID_STATUSES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
];

export async function createPrivacyRequest(
  env,
  userId,
  requestType,
  notes = ""
) {
  const sql = getDb(env);

  if (!VALID_REQUEST_TYPES.includes(requestType)) {
    throw new Error("Invalid privacy request type");
  }

  const result = await sql`
    INSERT INTO privacy_requests
    (
      user_id,
      request_type,
      notes
    )
    VALUES
    (
      ${userId},
      ${requestType},
      ${notes}
    )
    RETURNING *
  `;

  return result[0];
}

export async function getMyPrivacyRequests(env, userId) {
  const sql = getDb(env);

  return await sql`
    SELECT *
    FROM privacy_requests
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
}

export async function getAllPrivacyRequests(env) {
  const sql = getDb(env);

  return await sql`
    SELECT
      privacy_requests.*,
      users.name AS user_name,
      users.email AS user_email,
      processor.name AS processed_by_name,
      processor.email AS processed_by_email
    FROM privacy_requests
    JOIN users
      ON privacy_requests.user_id = users.id
    LEFT JOIN users AS processor
      ON privacy_requests.processed_by = processor.id
    ORDER BY privacy_requests.created_at DESC
  `;
}

export async function updatePrivacyRequestStatus(
  env,
  requestId,
  status,
  processedBy,
  notes = ""
) {
  const sql = getDb(env);

  if (!VALID_STATUSES.includes(status)) {
    throw new Error("Invalid privacy request status");
  }

  const result = await sql`
    UPDATE privacy_requests
    SET
      status = ${status},
      processed_at = NOW(),
      processed_by = ${processedBy},
      notes = CASE
        WHEN ${notes} <> '' THEN ${notes}
        ELSE notes
      END
    WHERE id = ${requestId}
    RETURNING *
  `;

  return result[0];
}