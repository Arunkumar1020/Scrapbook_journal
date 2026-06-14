import { verifyToken } from "../utils/jwt";

export async function getAuthenticatedUser(request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.replace("Bearer ", "");

  const user = await verifyToken(token);

  return user;
}