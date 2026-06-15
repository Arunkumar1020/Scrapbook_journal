const API_BASE_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getAdminStats() {
  const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin stats");
  }

  return response.json();
}

export async function getAdminUsers() {
  const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin users");
  }

  return response.json();
}

export async function getAdminJournals() {
  const response = await fetch(`${API_BASE_URL}/api/admin/journals`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin journals");
  }

  return response.json();
}