import {
  getPrivacyPolicy,
  getDataRetentionPolicy,
  getIncidentResponsePlan,
  getSecurityPolicy,
  getTermsAndConditions,
  getCookiePolicy,
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

  if (
    request.method === "GET" &&
    url.pathname === "/api/legal/incident-response-plan"
  ) {
    return getIncidentResponsePlan();
  }

  if (
    request.method === "GET" &&
    url.pathname === "/api/legal/security-policy"
  ) {
    return getSecurityPolicy();
  }

  if (
    request.method === "GET" &&
    url.pathname === "/api/legal/terms"
  ) {
    return getTermsAndConditions();
  }
  if (
  request.method === "GET" &&
  url.pathname === "/api/legal/cookie-policy"
) {
  return getCookiePolicy();
}

  return null;
}