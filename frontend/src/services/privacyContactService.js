const API_BASE_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getPublicPrivacyContact() {
  const response = await fetch(`${API_BASE_URL}/api/privacy-contact`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load privacy contact");
  }

  return data;
}

export async function getAdminPrivacyContacts() {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/privacy-contacts`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load privacy contacts");
  }

  return data;
}

export async function createPrivacyContact(payload) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/privacy-contacts`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create privacy contact");
  }

  return data;
}

export async function updatePrivacyContact(contactId, payload) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/privacy-contacts/${contactId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update privacy contact");
  }

  return data;
}

export async function deletePrivacyContact(contactId) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/privacy-contacts/${contactId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete privacy contact");
  }

  return data;
}