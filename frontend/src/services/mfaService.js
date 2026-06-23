const API_BASE_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getMfaStatus() {
  const response = await fetch(`${API_BASE_URL}/api/mfa/status`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch MFA status");
  }

  return data;
}

export async function setupMfa() {
  const response = await fetch(`${API_BASE_URL}/api/mfa/setup`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to setup MFA");
  }

  return data;
}

export async function enableMfa(code) {
  const response = await fetch(`${API_BASE_URL}/api/mfa/enable`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to enable MFA");
  }

  return data;
}

export async function disableMfa(code) {
  const response = await fetch(`${API_BASE_URL}/api/mfa/disable`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to disable MFA");
  }

  return data;
}

export async function verifyMfaLogin(credentials) {
  const response = await fetch(`${API_BASE_URL}/api/mfa/verify-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "MFA verification failed");
  }

  return data;
}