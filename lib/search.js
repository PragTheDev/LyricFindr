const LRCLIB_BASE_URL = "https://lrclib.net/api";

export async function searchLyrics(query) {
  try {
    const response = await fetch(
      `${LRCLIB_BASE_URL}/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error("Failed to search lyrics");
    }

    const results = await response.json();
    console.log("Search results:", results);
    return results;
  } catch (error) {
    console.error("Error searching lyrics:", error);
    throw error;
  }
}
