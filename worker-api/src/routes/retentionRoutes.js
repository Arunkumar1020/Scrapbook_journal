import {
  getRetentionSettingsController,
  updateRetentionSettingsController,
  previewRetentionCleanupController,
  runRetentionCleanupController,
} from "../controllers/retentionController";

export async function handleRetentionRoutes(request, env) {
  const url = new URL(request.url);

  if (
    request.method === "GET" &&
    url.pathname === "/api/admin/retention/settings"
  ) {
    return getRetentionSettingsController(env, request);
  }

  if (
    request.method === "PUT" &&
    url.pathname === "/api/admin/retention/settings"
  ) {
    return updateRetentionSettingsController(env, request);
  }

  if (
    request.method === "GET" &&
    url.pathname === "/api/admin/retention/preview"
  ) {
    return previewRetentionCleanupController(env, request);
  }

  if (
    request.method === "POST" &&
    url.pathname === "/api/admin/retention/run"
  ) {
    return runRetentionCleanupController(env, request);
  }

  return null;
}