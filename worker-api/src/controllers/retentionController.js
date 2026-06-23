import { getAuthenticatedUser } from "../middleware/authMiddleware";
import { createAuditLog } from "../services/auditService";

import {
  getRetentionSettings,
  updateRetentionSettings,
  previewRetentionCleanup,
  runRetentionCleanup,
} from "../services/retentionService";

function checkAdmin(user) {
  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }
}

export async function getRetentionSettingsController(env, request) {
  const admin = await getAuthenticatedUser(request, env);

  checkAdmin(admin);

  const settings = await getRetentionSettings(env);

  return Response.json(settings);
}

export async function updateRetentionSettingsController(env, request) {
  const admin = await getAuthenticatedUser(request, env);
  const body = await request.json();

  checkAdmin(admin);

  const retentionDays = Number(body.retention_days);
  const enabled = Boolean(body.enabled);

  if (!retentionDays || retentionDays < 1) {
    return Response.json(
      {
        success: false,
        message: "Retention days must be greater than 0",
      },
      {
        status: 400,
      }
    );
  }

  const settings = await updateRetentionSettings(
    env,
    retentionDays,
    enabled
  );

  await createAuditLog(env, {
    actorUserId: admin.id,
    action: "RETENTION_SETTINGS_UPDATED",
    targetType: "retention_settings",
    targetId: settings.id,
    metadata: {
      retention_days: retentionDays,
      enabled,
    },
  });

  return Response.json({
    success: true,
    settings,
  });
}

export async function previewRetentionCleanupController(env, request) {
  const admin = await getAuthenticatedUser(request, env);

  checkAdmin(admin);

  const preview = await previewRetentionCleanup(env);

  return Response.json(preview);
}

export async function runRetentionCleanupController(env, request) {
  const admin = await getAuthenticatedUser(request, env);

  checkAdmin(admin);

  const result = await runRetentionCleanup(env);

  await createAuditLog(env, {
    actorUserId: admin.id,
    action: "RETENTION_CLEANUP_RUN",
    targetType: "retention",
    targetId: null,
    metadata: result,
  });

  return Response.json({
    success: true,
    result,
  });
}