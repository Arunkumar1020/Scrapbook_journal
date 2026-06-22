import {
  getPrivacyPolicyData,
  getDataRetentionPolicyData,
} from "../services/legalService";

export async function getPrivacyPolicy() {
  return Response.json(getPrivacyPolicyData());
}

export async function getDataRetentionPolicy() {
  return Response.json(getDataRetentionPolicyData());
}