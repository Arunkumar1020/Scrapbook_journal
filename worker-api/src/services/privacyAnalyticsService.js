import { getDb } from "../utils/db";

export async function getPrivacyRequestAnalytics(env) {
  const sql = getDb(env);

  const totalRequests = await sql`
    SELECT COUNT(*)::int AS count
    FROM privacy_requests
  `;

  const pendingRequests = await sql`
    SELECT COUNT(*)::int AS count
    FROM privacy_requests
    WHERE status = 'PENDING'
  `;

  const approvedRequests = await sql`
    SELECT COUNT(*)::int AS count
    FROM privacy_requests
    WHERE status = 'APPROVED'
  `;

  const rejectedRequests = await sql`
    SELECT COUNT(*)::int AS count
    FROM privacy_requests
    WHERE status = 'REJECTED'
  `;

  const completedRequests = await sql`
    SELECT COUNT(*)::int AS count
    FROM privacy_requests
    WHERE status = 'COMPLETED'
  `;

  const exportRequests = await sql`
    SELECT COUNT(*)::int AS count
    FROM privacy_requests
    WHERE request_type = 'DATA_EXPORT'
  `;

  const deletionRequests = await sql`
    SELECT COUNT(*)::int AS count
    FROM privacy_requests
    WHERE request_type = 'ACCOUNT_DELETION'
  `;

  const withdrawalRequests = await sql`
    SELECT COUNT(*)::int AS count
    FROM privacy_requests
    WHERE request_type = 'CONSENT_WITHDRAWAL'
  `;

  return {
    totalRequests: totalRequests[0].count,
    pendingRequests: pendingRequests[0].count,
    approvedRequests: approvedRequests[0].count,
    rejectedRequests: rejectedRequests[0].count,
    completedRequests: completedRequests[0].count,
    exportRequests: exportRequests[0].count,
    deletionRequests: deletionRequests[0].count,
    withdrawalRequests: withdrawalRequests[0].count,
  };
}