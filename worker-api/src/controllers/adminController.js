import {
  getAdminStats,
  getAdminUsers,
  getAdminJournals,
} from "../services/adminService";

import { getAuthenticatedUser } from "../middleware/authMiddleware";

function checkAdmin(user) {
  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }
}

export async function adminStats(env, request) {
  const user = await getAuthenticatedUser(request);
  checkAdmin(user);

  const stats = await getAdminStats(env);

  return Response.json(stats);
}

export async function adminUsers(env, request) {
  const user = await getAuthenticatedUser(request);
  checkAdmin(user);

  const users = await getAdminUsers(env);

  return Response.json(users);
}

export async function adminJournals(env, request) {
  const user = await getAuthenticatedUser(request);
  checkAdmin(user);

  const journals = await getAdminJournals(env);

  return Response.json(journals);
}