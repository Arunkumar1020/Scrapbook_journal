import {
  getPrivacyPolicyData,
  getDataRetentionPolicyData,
  getIncidentResponsePlanData,
  getSecurityPolicyData,
  getTermsAndConditionsData,
  getCookiePolicyData,
} from "../services/legalService";

export async function getPrivacyPolicy() {
  return Response.json(getPrivacyPolicyData());
}

export async function getDataRetentionPolicy() {
  return Response.json(getDataRetentionPolicyData());
}

export async function getIncidentResponsePlan() {
  return Response.json(getIncidentResponsePlanData());
}

export async function getSecurityPolicy() {
  return Response.json(getSecurityPolicyData());
}

export async function getTermsAndConditions() {
  return Response.json(
    getTermsAndConditionsData()
  );
}
export async function getCookiePolicy() {
  return Response.json(
    getCookiePolicyData()
  );
}