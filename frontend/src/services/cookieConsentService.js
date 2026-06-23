const API_BASE_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getCookieConsent() {
  const response = await fetch(
    `${API_BASE_URL}/api/me/cookie-consent`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch cookie consent"
    );
  }

  return data;
}

export async function updateCookieConsent(
  cookieConsent
) {
  const response = await fetch(
    `${API_BASE_URL}/api/me/cookie-consent`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        cookie_consent: cookieConsent,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update cookie consent"
    );
  }

  return data;
}