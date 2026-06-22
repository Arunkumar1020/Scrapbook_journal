import {
  getPrivacyPolicyData,
  getDataRetentionPolicyData,
  getIncidentResponsePlanData,
  getSecurityPolicyData,
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