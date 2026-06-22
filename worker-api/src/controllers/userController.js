import {
  exportUserData,
  deleteMyAccountData,
  getUserConsent,
  updateUserConsent,
} from "../services/userService";

import { getAuthenticatedUser } from "../middleware/authMiddleware";
import { createAuditLog } from "../services/auditService";

export async function exportMyData(env, request) {
  const user = await getAuthenticatedUser(request, env);

  const data = await exportUserData(env, user.id);

  await createAuditLog(env, {
    actorUserId: user.id,
    action: "DATA_EXPORTED",
    targetType: "user",
    targetId: user.id,
    metadata: {
      email: user.email,
    },
  });

  return Response.json(data, {
    headers: {
      "Content-Disposition":
        "attachment; filename=scrapbook-data-export.json",
    },
  });
}

export async function getMyConsent(env, request) {
  const user = await getAuthenticatedUser(request, env);

  const consent = await getUserConsent(env, user.id);

  return Response.json(consent);
}

export async function updateMyConsent(env, request) {
  const user = await getAuthenticatedUser(request, env);

  const body = await request.json();

  const consentGiven = Boolean(body.consent_given);

  const updatedConsent = await updateUserConsent(
    env,
    user.id,
    consentGiven
  );

  await createAuditLog(env, {
    actorUserId: user.id,
    action: consentGiven
      ? "CONSENT_GRANTED"
      : "CONSENT_WITHDRAWN",
    targetType: "user",
    targetId: user.id,
    metadata: {
      email: user.email,
      consent_given: consentGiven,
    },
  });

  return Response.json({
    success: true,
    consent: updatedConsent,
  });
}

export async function deleteMyAccount(env, request) {
  const user = await getAuthenticatedUser(request, env);

  await createAuditLog(env, {
    actorUserId: user.id,
    action: "ACCOUNT_DELETED",
    targetType: "user",
    targetId: user.id,
    metadata: {
      email: user.email,
    },
  });

  const deletedUser = await deleteMyAccountData(env, user.id);

  return Response.json({
    success: true,
    message: "Account deleted successfully",
    user: deletedUser,
  });
}