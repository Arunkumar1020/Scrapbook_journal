import {
  createBreachIncidentController,
  getBreachIncidentsController,
  updateBreachIncidentController,
  getBreachAnalyticsController,
} from "../controllers/breachController";

export async function handleBreachRoutes(request, env) {
  const url = new URL(request.url);

  if (
    request.method === "GET" &&
    url.pathname === "/api/admin/breaches"
  ) {
    return getBreachIncidentsController(env, request);
  }

  if (
    request.method === "POST" &&
    url.pathname === "/api/admin/breaches"
  ) {
    return createBreachIncidentController(env, request);
  }

  if (
    request.method === "GET" &&
    url.pathname === "/api/admin/breaches/analytics"
  ) {
    return getBreachAnalyticsController(env, request);
  }

  if (
    request.method === "PUT" &&
    url.pathname.startsWith("/api/admin/breaches/")
  ) {
    const incidentId = url.pathname.split("/").pop();

    return updateBreachIncidentController(env, request, incidentId);
  }

  return null;
}