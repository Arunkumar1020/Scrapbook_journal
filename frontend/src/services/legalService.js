const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function getPrivacyPolicy() {
  const response = await fetch(
    `${API_BASE_URL}/api/legal/privacy-policy`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch privacy policy");
  }

  return response.json();
}

export async function getDataRetentionPolicy() {
  const response = await fetch(
    `${API_BASE_URL}/api/legal/data-retention-policy`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data retention policy");
  }

  return response.json();
}