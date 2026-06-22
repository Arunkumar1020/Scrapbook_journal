import {
  setupMfa,
  enableMfa,
  verifyMfaLogin,
} from "../controllers/mfaController";

export async function handleMfaRoutes(request, env) {
  const url = new URL(request.url);

  if (
    request.method === "GET" &&
    url.pathname === "/api/mfa/setup"
  ) {
    return setupMfa(env, request);
  }

  if (
    request.method === "POST" &&
    url.pathname === "/api/mfa/enable"
  ) {
    return enableMfa(env, request);
  }

  if (
    request.method === "POST" &&
    url.pathname === "/api/mfa/verify-login"
  ) {
    return verifyMfaLogin(env, request);
  }

  return null;
}