const API_BASE_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getVendorAnalytics() {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/vendors/analytics`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load vendor analytics");
  }

  return data;
}

export async function getVendors() {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/vendors`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load vendors");
  }

  return data;
}

export async function createVendor(payload) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/vendors`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create vendor");
  }

  return data;
}

export async function updateVendor(vendorId, payload) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/vendors/${vendorId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update vendor");
  }

  return data;
}

export async function deleteVendor(vendorId) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/vendors/${vendorId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete vendor");
  }

  return data;
}