import {
  exportMyData,
  deleteMyAccount,
} from "../controllers/userController";

export async function handleUserRoutes(request, env) {
  const url = new URL(request.url);

  if (
    request.method === "GET" &&
    url.pathname === "/api/me/export"
  ) {
    return exportMyData(env, request);
  }

  if (
    request.method === "DELETE" &&
    url.pathname === "/api/me"
  ) {
    return deleteMyAccount(env, request);
  }

  return null;
}