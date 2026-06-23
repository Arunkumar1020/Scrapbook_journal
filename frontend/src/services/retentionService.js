const API_BASE_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getRetentionSettings() {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/retention/settings`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load retention settings");
  }

  return data;
}

export async function updateRetentionSettings(settings) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/retention/settings`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update retention settings");
  }

  return data;
}

export async function previewRetentionCleanup() {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/retention/preview`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to preview retention cleanup");
  }

  return data;
}

export async function runRetentionCleanup() {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/retention/run`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to run retention cleanup");
  }

  return data;
}