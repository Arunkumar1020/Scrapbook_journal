import {
  getBackupRecordsController,
  createBackupRecordController,
  updateBackupRecordController,
  deleteBackupRecordController,
  getBackupAnalyticsController,
} from "../controllers/backupController";

export async function handleBackupRoutes(request, env) {
  const url = new URL(request.url);

  if (
    request.method === "GET" &&
    url.pathname === "/api/admin/backups"
  ) {
    return getBackupRecordsController(env, request);
  }

  if (
    request.method === "POST" &&
    url.pathname === "/api/admin/backups"
  ) {
    return createBackupRecordController(env, request);
  }

  if (
    request.method === "GET" &&
    url.pathname === "/api/admin/backups/analytics"
  ) {
    return getBackupAnalyticsController(env, request);
  }

  if (
    request.method === "PUT" &&
    url.pathname.startsWith("/api/admin/backups/")
  ) {
    const recordId = url.pathname.split("/").pop();
    return updateBackupRecordController(env, request, recordId);
  }

  if (
    request.method === "DELETE" &&
    url.pathname.startsWith("/api/admin/backups/")
  ) {
    const recordId = url.pathname.split("/").pop();
    return deleteBackupRecordController(env, request, recordId);
  }

  return null;
}