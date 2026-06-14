import {
  register,
  login,
} from "../controllers/authController";

export async function handleAuthRoutes(request, env) {
  const url = new URL(request.url);

  if (
    request.method === "POST" &&
    url.pathname === "/api/auth/register"
  ) {
    return register(env, request);
  }

  if (
    request.method === "POST" &&
    url.pathname === "/api/auth/login"
  ) {
    return login(env, request);
  }

  return null;
}