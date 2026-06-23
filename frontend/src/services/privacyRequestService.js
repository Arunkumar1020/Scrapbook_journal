const API_BASE_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function createPrivacyRequest(requestData) {
  const response = await fetch(
    `${API_BASE_URL}/api/privacy-requests`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create privacy request");
  }

  return data;
}

export async function getMyPrivacyRequests() {
  const response = await fetch(
    `${API_BASE_URL}/api/privacy-requests/me`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load privacy requests");
  }

  return data;
}

export async function getAdminPrivacyRequests() {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/privacy-requests`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load admin privacy requests");
  }

  return data;
}

export async function updateAdminPrivacyRequestStatus(
  requestId,
  status,
  notes = ""
) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/privacy-requests/${requestId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        status,
        notes,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update privacy request");
  }

  return data;
}