import {
  getPublicPrivacyContactController,
  getAdminPrivacyContactsController,
  createPrivacyContactController,
  updatePrivacyContactController,
  deletePrivacyContactController,
} from "../controllers/privacyContactController";

export async function handlePrivacyContactRoutes(request, env) {
  const url = new URL(request.url);

  if (
    request.method === "GET" &&
    url.pathname === "/api/privacy-contact"
  ) {
    return getPublicPrivacyContactController(env);
  }

  if (
    request.method === "GET" &&
    url.pathname === "/api/admin/privacy-contacts"
  ) {
    return getAdminPrivacyContactsController(env, request);
  }

  if (
    request.method === "POST" &&
    url.pathname === "/api/admin/privacy-contacts"
  ) {
    return createPrivacyContactController(env, request);
  }

  if (
    request.method === "PUT" &&
    url.pathname.startsWith("/api/admin/privacy-contacts/")
  ) {
    const contactId = url.pathname.split("/").pop();

    return updatePrivacyContactController(env, request, contactId);
  }

  if (
    request.method === "DELETE" &&
    url.pathname.startsWith("/api/admin/privacy-contacts/")
  ) {
    const contactId = url.pathname.split("/").pop();

    return deletePrivacyContactController(env, request, contactId);
  }

  return null;
}