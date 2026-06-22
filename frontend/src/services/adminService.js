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

export async function getAdminAuditLogs() {
  const response = await fetch(`${API_BASE_URL}/api/admin/audit-logs`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch audit logs");
  }

  return response.json();
}

export async function getAdminSecuritySummary() {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/security-summary`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch security summary");
  }

  return response.json();
}

export async function updateAdminUserRole(userId, role) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/users/${userId}`,
    {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update user role");
  }

  return response.json();
}

export async function deleteAdminUser(userId) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/users/${userId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  return response.json();
}