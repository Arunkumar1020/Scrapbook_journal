import { getAuthenticatedUser } from "../middleware/authMiddleware";
import { createAuditLog } from "../services/auditService";

import {
  createPrivacyRequest,
  getMyPrivacyRequests,
  getAllPrivacyRequests,
  updatePrivacyRequestStatus,
} from "../services/privacyRequestService";

function checkAdmin(user) {
  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }
}

export async function createMyPrivacyRequest(env, request) {
  const user = await getAuthenticatedUser(request, env);
  const body = await request.json();

  const privacyRequest = await createPrivacyRequest(
    env,
    user.id,
    body.request_type,
    body.notes || ""
  );

  await createAuditLog(env, {
    actorUserId: user.id,
    action: "PRIVACY_REQUEST_CREATED",
    targetType: "privacy_request",
    targetId: privacyRequest.id,
    metadata: {
      email: user.email,
      request_type: body.request_type,
    },
  });

  return Response.json({
    success: true,
    request: privacyRequest,
  });
}

export async function getMyPrivacyRequestsController(env, request) {
  const user = await getAuthenticatedUser(request, env);

  const requests = await getMyPrivacyRequests(env, user.id);

  return Response.json(requests);
}

export async function getAdminPrivacyRequests(env, request) {
  const admin = await getAuthenticatedUser(request, env);

  checkAdmin(admin);

  const requests = await getAllPrivacyRequests(env);

  return Response.json(requests);
}

export async function updateAdminPrivacyRequest(env, request, requestId) {
  const admin = await getAuthenticatedUser(request, env);

  checkAdmin(admin);

  const body = await request.json();

  const updatedRequest = await updatePrivacyRequestStatus(
    env,
    requestId,
    body.status,
    admin.id,
    body.notes || ""
  );

  await createAuditLog(env, {
    actorUserId: admin.id,
    action: "PRIVACY_REQUEST_STATUS_UPDATED",
    targetType: "privacy_request",
    targetId: Number(requestId),
    metadata: {
      status: body.status,
      notes: body.notes || "",
    },
  });

  return Response.json({
    success: true,
    request: updatedRequest,
  });
}