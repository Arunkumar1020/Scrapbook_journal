const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function registerUser(userData) {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

export async function loginUser(credentials) {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function exportMyData() {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/me/export`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to export data");
  }

  return response.json();
}

export async function getMyConsent() {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/me/consent`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch consent");
  }

  return response.json();
}

export async function updateMyConsent(consentGiven) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/me/consent`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        consent_given: consentGiven,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update consent");
  }

  return data;
}

export async function deleteMyAccount() {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/me`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete account");
  }

  return data;
}