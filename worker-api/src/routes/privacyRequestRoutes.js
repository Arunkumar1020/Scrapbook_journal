import {
  createMyPrivacyRequest,
  getMyPrivacyRequestsController,
  getAdminPrivacyRequests,
  updateAdminPrivacyRequest,
} from "../controllers/privacyRequestController";

export async function handlePrivacyRequestRoutes(request, env) {
  const url = new URL(request.url);

  if (
    request.method === "POST" &&
    url.pathname === "/api/privacy-requests"
  ) {
    return createMyPrivacyRequest(env, request);
  }

  if (
    request.method === "GET" &&
    url.pathname === "/api/privacy-requests/me"
  ) {
    return getMyPrivacyRequestsController(env, request);
  }

  if (
    request.method === "GET" &&
    url.pathname === "/api/admin/privacy-requests"
  ) {
    return getAdminPrivacyRequests(env, request);
  }

  if (
    request.method === "PUT" &&
    url.pathname.startsWith(
      "/api/admin/privacy-requests/"
    )
  ) {
    const requestId =
      url.pathname.split("/").pop();

    return updateAdminPrivacyRequest(
      env,
      request,
      requestId
    );
  }

  return null;
}