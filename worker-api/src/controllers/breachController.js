import { getAuthenticatedUser } from "../middleware/authMiddleware";
import { createAuditLog } from "../services/auditService";

import {
  createBreachIncident,
  getAllBreachIncidents,
  updateBreachIncident,
  getBreachAnalytics,
} from "../services/breachService";

function checkAdmin(user) {
  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }
}

export async function createBreachIncidentController(env, request) {
  const admin = await getAuthenticatedUser(request, env);

  checkAdmin(admin);

  const body = await request.json();

  const incident = await createBreachIncident(env, {
    ...body,
    reported_by: admin.id,
  });

  await createAuditLog(env, {
    actorUserId: admin.id,
    action: "BREACH_INCIDENT_CREATED",
    targetType: "breach_incident",
    targetId: incident.id,
    metadata: {
      title: incident.title,
      severity: incident.severity,
      status: incident.status,
      notification_required: incident.notification_required,
    },
  });

  return Response.json({
    success: true,
    incident,
  });
}

export async function getBreachIncidentsController(env, request) {
  const admin = await getAuthenticatedUser(request, env);

  checkAdmin(admin);

  const incidents = await getAllBreachIncidents(env);

  return Response.json(incidents);
}

export async function updateBreachIncidentController(
  env,
  request,
  incidentId
) {
  const admin = await getAuthenticatedUser(request, env);

  checkAdmin(admin);

  const body = await request.json();

  const incident = await updateBreachIncident(
    env,
    Number(incidentId),
    body
  );

  await createAuditLog(env, {
    actorUserId: admin.id,
    action: "BREACH_INCIDENT_UPDATED",
    targetType: "breach_incident",
    targetId: Number(incidentId),
    metadata: {
      status: body.status,
      severity: body.severity,
      notification_required: body.notification_required,
    },
  });

  return Response.json({
    success: true,
    incident,
  });
}

export async function getBreachAnalyticsController(env, request) {
  const admin = await getAuthenticatedUser(request, env);

  checkAdmin(admin);

  const analytics = await getBreachAnalytics(env);

  return Response.json(analytics);
}