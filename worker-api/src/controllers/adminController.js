import {
  getAdminStats,
  getAdminUsers,
  getAdminJournals,
  updateUserRole,
  deleteUser,
  getComplianceSummary,
} from "../services/adminService";
import { createAuditLog } from "../services/auditService";
import { getAuthenticatedUser } from "../middleware/authMiddleware";
import { getRecentAuditLogs } from "../services/auditService";
import { getSecuritySummary } from "../services/auditService";
function checkAdmin(user) {
  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }
}

export async function adminStats(env, request) {
  const user = await getAuthenticatedUser(request,env);
  checkAdmin(user);

  const stats = await getAdminStats(env);

  return Response.json(stats);
}

export async function adminUsers(env, request) {
  const user = await getAuthenticatedUser(request,env);
  checkAdmin(user);

  const users = await getAdminUsers(env);

  return Response.json(users);
}

export async function adminJournals(env, request) {
  const user = await getAuthenticatedUser(request,env);
  checkAdmin(user);

  const journals = await getAdminJournals(env);

  return Response.json(journals);
}
export async function changeUserRole(
  env,
  request,
  userId
) {
  const admin = await getAuthenticatedUser(
    request,
    env
  );

  checkAdmin(admin);

  const { role } = await request.json();

  if (
    role !== "admin" &&
    role !== "user"
  ) {
    return Response.json(
      {
        success: false,
        message: "Invalid role",
      },
      {
        status: 400,
      }
    );
  }

  const updatedUser =
    await updateUserRole(
      env,
      userId,
      role
    );

  await createAuditLog(env, {
    actorUserId: admin.id,
    action: "USER_ROLE_UPDATED",
    targetType: "user",
    targetId: userId,
    metadata: {
      new_role: role,
      target_email: updatedUser.email,
    },
  });

  return Response.json({
    success: true,
    user: updatedUser,
  });
}
export async function removeUser(
  env,
  request,
  userId
) {
  const admin = await getAuthenticatedUser(
    request,
    env
  );

  checkAdmin(admin);

  if (
    Number(userId) === Number(admin.id)
  ) {
    return Response.json(
      {
        success: false,
        message:
          "You cannot delete yourself",
      },
      {
        status: 400,
      }
    );
  }

  const deletedUser =
    await deleteUser(env, userId);

  await createAuditLog(env, {
    actorUserId: admin.id,
    action: "USER_DELETED_BY_ADMIN",
    targetType: "user",
    targetId: userId,
    metadata: {
      deleted_email: deletedUser.email,
    },
  });

  return Response.json({
    success: true,
    user: deletedUser,
  });
}
export async function adminAuditLogs(env, request) {
  const user = await getAuthenticatedUser(request, env);

  checkAdmin(user);

  const logs = await getRecentAuditLogs(env);

  return Response.json(logs);
}
export async function adminSecuritySummary(env, request) {
  const user = await getAuthenticatedUser(request, env);

  checkAdmin(user);

  const summary = await getSecuritySummary(env);

  return Response.json(summary);
}
export async function getComplianceSummaryController(
  env
) {
  const summary =
    await getComplianceSummary(env);

  return Response.json(summary);
}