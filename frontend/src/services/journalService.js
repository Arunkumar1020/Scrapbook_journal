const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function getAllJournals() {
  const response = await fetch(
    `${API_BASE_URL}/api/journals`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch journals");
  }

  return response.json();
}

export async function createJournal(journalData) {
  const response = await fetch(
    `${API_BASE_URL}/api/journals`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(journalData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create journal");
  }

  return response.json();
}

export async function getJournalById(id) {
  const response = await fetch(
    `${API_BASE_URL}/api/journals/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch journal");
  }

  return response.json();
}

export async function updateJournal(id, journalData) {
  const response = await fetch(
    `${API_BASE_URL}/api/journals/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(journalData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update journal");
  }

  return response.json();
}

export async function deleteJournal(id) {
  const response = await fetch(
    `${API_BASE_URL}/api/journals/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      errorText || "Failed to delete journal"
    );
  }

  return true;
}