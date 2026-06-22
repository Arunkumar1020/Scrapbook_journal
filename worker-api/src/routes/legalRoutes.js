import {
  getPrivacyPolicy,
  getDataRetentionPolicy,
} from "../controllers/legalController";

export async function handleLegalRoutes(request) {
  const url = new URL(request.url);

  if (
    request.method === "GET" &&
    url.pathname === "/api/legal/privacy-policy"
  ) {
    return getPrivacyPolicy();
  }

  if (
    request.method === "GET" &&
    url.pathname === "/api/legal/data-retention-policy"
  ) {
    return getDataRetentionPolicy();
  }

  return null;
}