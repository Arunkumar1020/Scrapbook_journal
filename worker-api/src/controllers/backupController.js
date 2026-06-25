import { getAuthenticatedUser } from "../middleware/authMiddleware";
import { createAuditLog } from "../services/auditService";

import {
  getAllBackupRecords,
  createBackupRecord,
  updateBackupRecord,
  deleteBackupRecord,
  getBackupAnalytics,
} from "../services/backupService";

function checkAdmin(user) {
  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }
}

export async function getBackupRecordsController(env, request) {
  const admin = await getAuthenticatedUser(request, env);
  checkAdmin(admin);

  const records = await getAllBackupRecords(env);
  return Response.json(records);
}

export async function createBackupRecordController(env, request) {
  const admin = await getAuthenticatedUser(request, env);
  checkAdmin(admin);

  const body = await request.json();
  const record = await createBackupRecord(env, body);

  await createAuditLog(env, {
    actorUserId: admin.id,
    action: "BACKUP_RECORD_CREATED",
    targetType: "backup_record",
    targetId: record.id,
    metadata: {
      provider_name: record.provider_name,
      backup_frequency: record.backup_frequency,
    },
  });

  return Response.json({
    success: true,
    record,
  });
}

export async function updateBackupRecordController(env, request, recordId) {
  const admin = await getAuthenticatedUser(request, env);
  checkAdmin(admin);

  const body = await request.json();

  const record = await updateBackupRecord(
    env,
    Number(recordId),
    body
  );

  await createAuditLog(env, {
    actorUserId: admin.id,
    action: "BACKUP_RECORD_UPDATED",
    targetType: "backup_record",
    targetId: Number(recordId),
    metadata: {
      provider_name: record?.provider_name,
      restore_tested: record?.restore_tested,
      encryption_enabled: record?.encryption_enabled,
    },
  });

  return Response.json({
    success: true,
    record,
  });
}

export async function deleteBackupRecordController(env, request, recordId) {
  const admin = await getAuthenticatedUser(request, env);
  checkAdmin(admin);

  const record = await deleteBackupRecord(env, Number(recordId));

  await createAuditLog(env, {
    actorUserId: admin.id,
    action: "BACKUP_RECORD_DELETED",
    targetType: "backup_record",
    targetId: Number(recordId),
    metadata: {
      provider_name: record?.provider_name,
    },
  });

  return Response.json({
    success: true,
    record,
  });
}

export async function getBackupAnalyticsController(env, request) {
  const admin = await getAuthenticatedUser(request, env);
  checkAdmin(admin);

  const analytics = await getBackupAnalytics(env);
  return Response.json(analytics);
}