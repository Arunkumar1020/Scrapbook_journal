import {
  exportUserData,
  deleteMyAccountData,
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