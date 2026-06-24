const API_BASE_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getBreachAnalytics() {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/breaches/analytics`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to load breach analytics"
    );
  }

  return data;
}

export async function getBreachIncidents() {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/breaches`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to load incidents"
    );
  }

  return data;
}

export async function createBreachIncident(payload) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/breaches`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create incident"
    );
  }

  return data;
}

export async function updateBreachIncident(
  incidentId,
  payload
) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/breaches/${incidentId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update incident"
    );
  }

  return data;
}