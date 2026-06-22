import {
  adminStats,
  adminUsers,
  adminJournals,
  changeUserRole,
  removeUser,
  adminAuditLogs,
  adminSecuritySummary,
} from "../controllers/adminController";
export async function handleAdminRoutes(request, env) {
  const url = new URL(request.url);

  if (
    request.method === "GET" &&
    url.pathname === "/api/admin/stats"
  ) {
    return adminStats(env, request);
  }

  if (
    request.method === "GET" &&
    url.pathname === "/api/admin/users"
  ) {
    return adminUsers(env, request);
  }

  if (
    request.method === "GET" &&
    url.pathname === "/api/admin/journals"
  ) {
    return adminJournals(env, request);
  }
  const userMatch = url.pathname.match(
  /^\/api\/admin\/users\/([^/]+)$/
);

if (
  request.method === "PUT" &&
  userMatch
) {
  return changeUserRole(
    env,
    request,
    Number(userMatch[1])
  );
}

if (
  request.method === "DELETE" &&
  userMatch
) {
  return removeUser(
    env,
    request,
    Number(userMatch[1])
  );
}
if (
  request.method === "GET" &&
  url.pathname === "/api/admin/audit-logs"
) {
  return adminAuditLogs(env, request);
}
if (
  request.method === "GET" &&
  url.pathname === "/api/admin/security-summary"
) {
  return adminSecuritySummary(env, request);
}
  return null;
}