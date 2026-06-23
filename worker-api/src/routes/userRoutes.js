import {
  exportMyData,
  deleteMyAccount,
  getMyConsent,
  updateMyConsent,
  getMyCookieConsent,
  updateMyCookieConsent,
} from "../controllers/userController";

export async function handleUserRoutes(request, env) {
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/api/me/export") {
    return exportMyData(env, request);
  }

  if (request.method === "GET" && url.pathname === "/api/me/consent") {
    return getMyConsent(env, request);
  }

  if (request.method === "PUT" && url.pathname === "/api/me/consent") {
    return updateMyConsent(env, request);
  }

  if (
    request.method === "GET" &&
    url.pathname === "/api/me/cookie-consent"
  ) {
    return getMyCookieConsent(env, request);
  }

  if (
    request.method === "PUT" &&
    url.pathname === "/api/me/cookie-consent"
  ) {
    return updateMyCookieConsent(env, request);
  }

  if (request.method === "DELETE" && url.pathname === "/api/me") {
    return deleteMyAccount(env, request);
  }

  return null;
}