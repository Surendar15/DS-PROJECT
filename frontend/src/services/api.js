const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Sends session feature vector to FastAPI backend for purchase intention prediction.
 * @param {Object} sessionFeatures - Object containing 17 dataset features
 * @returns {Promise<Object>} API response JSON containing prediction, probability, label, confidence, recommendation
 */
export async function predictPurchaseIntention(sessionFeatures) {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionFeatures),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server returned status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("[API Error] Failed to fetch purchase intention prediction:", error);
    throw error;
  }
}

/**
 * Verifies API connectivity with GET /health
 */
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
