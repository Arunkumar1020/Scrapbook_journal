import { exportUserData } from "../services/userService";
import { getAuthenticatedUser } from "../middleware/authMiddleware";

export async function exportMyData(env, request) {
  const user = await getAuthenticatedUser(request, env);

  const data = await exportUserData(env, user.id);

  return Response.json(data, {
    headers: {
      "Content-Disposition": "attachment; filename=scrapbook-data-export.json",
    },
  });
}