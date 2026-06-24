import { getPrivacyRequestAnalyticsController } from "../controllers/privacyAnalyticsController";

export async function handlePrivacyAnalyticsRoutes(request, env) {
  const url = new URL(request.url);

  if (
    request.method === "GET" &&
    url.pathname === "/api/admin/privacy-analytics"
  ) {
    return getPrivacyRequestAnalyticsController(env, request);
  }

  return null;
}