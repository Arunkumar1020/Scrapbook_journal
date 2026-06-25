const API_BASE_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getBackupAnalytics() {
  const response = await fetch(`${API_BASE_URL}/api/admin/backups/analytics`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load backup analytics");
  }

  return data;
}

export async function getBackupRecords() {
  const response = await fetch(`${API_BASE_URL}/api/admin/backups`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load backup records");
  }

  return data;
}

export async function createBackupRecord(payload) {
  const response = await fetch(`${API_BASE_URL}/api/admin/backups`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create backup record");
  }

  return data;
}

export async function updateBackupRecord(recordId, payload) {
  const response = await fetch(`${API_BASE_URL}/api/admin/backups/${recordId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update backup record");
  }

  return data;
}

export async function deleteBackupRecord(recordId) {
  const response = await fetch(`${API_BASE_URL}/api/admin/backups/${recordId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete backup record");
  }

  return data;
}