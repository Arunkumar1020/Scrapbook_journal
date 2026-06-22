import { getPrivacyPolicy } from "../controllers/legalController";

export async function handleLegalRoutes(request) {
  const url = new URL(request.url);

  if (
    request.method === "GET" &&
    url.pathname === "/api/legal/privacy-policy"
  ) {
    return getPrivacyPolicy();
  }

  return null;
}