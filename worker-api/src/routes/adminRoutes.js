import {
  adminStats,
  adminUsers,
  adminJournals,
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

  return null;
}