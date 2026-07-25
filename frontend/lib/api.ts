// ── SAHAYA AI — API Client ──
// Handles communication with the /api/chat backend.
// Switches between mock responses and live API based on environment variable.
//
// Set NEXT_PUBLIC_API_URL in .env.local to point to the Catalyst endpoint.
// When unset, falls back to mock responses for offline development.

import type { ChatResponse } from "./mock-data";
import { MOCK_RESPONSES, KANNADA_MOCK_RESPONSES } from "./mock-data";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production" ? "/server/chat-api" : "");

/** Whether to use the live API or fall back to mocks. */
export function isLiveAPI(): boolean {
  return API_URL.length > 0;
}

/**
 * Send a chat message to the backend API.
 * Falls back to mock responses if NEXT_PUBLIC_API_URL is not set.
 */
export async function sendChatMessage(
  message: string,
  sessionId: string | null,
  language: string = "en"
): Promise<ChatResponse> {
  if (!isLiveAPI()) {
    return sendMockMessage(message, language);
  }

  try {
    const res = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        session_id: sessionId,
        language: language,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      console.error(`[SAHAYA] API error ${res.status}: ${errorText}`);
      return {
        type: "error",
        answer: `API returned an error (${res.status}). The backend may be unavailable. Please try again.`,
        data: null,
        source: null,
        graph: null,
        reasoning: [`HTTP ${res.status} from ${API_URL}/api/chat`, errorText],
      };
    }

    const data: ChatResponse = await res.json();
    return data;
  } catch (err) {
    const message_text = err instanceof Error ? err.message : String(err);
    console.error("[SAHAYA] Network error:", message_text);
    return {
      type: "error",
      answer: `Could not reach the backend. Check your connection or run the chat-api locally on port 3001.\n\nError: ${message_text}`,
      data: null,
      source: null,
      graph: null,
      reasoning: [`Network error: ${message_text}`, `Endpoint: ${API_URL}/api/chat`],
    };
  }
}

/**
 * Mock message handler — simulates API responses from hardcoded data.
 * Adds realistic delay to simulate network latency.
 */
async function sendMockMessage(message: string, language: string): Promise<ChatResponse> {
  // Simulate network delay
  await new Promise((resolve) =>
    setTimeout(resolve, 800 + Math.random() * 1000)
  );

  const lower = message.toLowerCase();
  const isKannada = language === "kn" || /[\u0C80-\u0CFF]/.test(message);
  const responses = isKannada ? KANNADA_MOCK_RESPONSES : MOCK_RESPONSES;

  // Profile intent
  if (
    lower.includes("profile") ||
    lower.includes("who is") ||
    lower.includes("rap sheet") ||
    lower.includes("criminal record") ||
    lower.includes("his cases") ||
    lower.includes("her cases") ||
    lower.includes("risk score") ||
    lower.includes("repeat offender") ||
    lower.includes("ರವಿ") ||
    lower.includes("ಆರೋಪಿ")
  ) {
    return responses.profile_suspect;
  }

  // Summary intent
  if (
    lower.includes("summary") ||
    lower.includes("summarize") ||
    lower.includes("similar cases") ||
    lower.includes("cases like") ||
    lower.includes("fir-") ||
    lower.includes("ಸಾರಾಂಶ")
  ) {
    return responses.summary_case;
  }

  // Network intent
  if (
    lower.includes("network") ||
    lower.includes("suspect") ||
    lower.includes("ring") ||
    lower.includes("connection") ||
    lower.includes("graph") ||
    lower.includes("gang") ||
    lower.includes("ನೆಟ್‌ವರ್ಕ್") ||
    lower.includes("ಜಾಲ")
  ) {
    return responses.network_crime_ring;
  }

  // Fact intent
  if (
    lower.includes("highest") ||
    lower.includes("most") ||
    lower.includes("how many") ||
    lower.includes("count") ||
    lower.includes("stats") ||
    lower.includes("hotspot") ||
    lower.includes("district") ||
    lower.includes("spike") ||
    lower.includes("trend") ||
    lower.includes("emerging") ||
    lower.includes("ಯಾವ") ||
    lower.includes("ಹೆಚ್ಚಿನ") ||
    lower.includes("ಜಿಲ್ಲೆ") ||
    lower.includes("ಕಳ್ಳತನ")
  ) {
    return responses.fact_highest_theft;
  }

  // Default: narrative
  return responses.narrative_mo_pattern;
}
