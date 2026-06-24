import { getAuthenticatedUser } from "../middleware/authMiddleware";
import { getPrivacyRequestAnalytics } from "../services/privacyAnalyticsService";

function checkAdmin(user) {
  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }
}

export async function getPrivacyRequestAnalyticsController(env, request) {
  const admin = await getAuthenticatedUser(request, env);

  checkAdmin(admin);

  const analytics = await getPrivacyRequestAnalytics(env);

  return Response.json(analytics);
}