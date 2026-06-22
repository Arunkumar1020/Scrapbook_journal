import { getPrivacyPolicyData } from "../services/legalService";

export async function getPrivacyPolicy() {
  return Response.json(getPrivacyPolicyData());
}