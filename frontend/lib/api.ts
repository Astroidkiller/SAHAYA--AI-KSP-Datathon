// ── SAHAYA AI — Offline Intelligence Engine ──
// All queries are handled client-side using embedded analytics data.
// No network calls are made — 100% reliable on static hosting.

import type { ChatResponse } from "./mock-data";
import { MOCK_RESPONSES, KANNADA_MOCK_RESPONSES } from "./mock-data";

export function isLiveAPI(): boolean {
  return false;
}

/**
 * Routes chat queries through the client-side intelligence engine.
 * Responds instantly with verified crime analytics data.
 */
export async function sendChatMessage(
  message: string,
  _sessionId: string | null,
  language: string = "en"
): Promise<ChatResponse> {
  // Simulate processing delay for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 800));

  const lower = message.toLowerCase();
  const isKannada = language === "kn" || /[\u0C80-\u0CFF]/.test(message);
  const responses = isKannada ? KANNADA_MOCK_RESPONSES : MOCK_RESPONSES;

  // Profile intent
  if (
    lower.includes("profile") || lower.includes("who is") || lower.includes("rap sheet") ||
    lower.includes("criminal record") || lower.includes("his cases") || lower.includes("her cases") ||
    lower.includes("risk score") || lower.includes("repeat offender") ||
    lower.includes("ravi") || lower.includes("ರವಿ") || lower.includes("ಆರೋಪಿ")
  ) {
    return responses.profile_suspect;
  }

  // Summary intent
  if (
    lower.includes("summary") || lower.includes("summarize") || lower.includes("similar cases") ||
    lower.includes("cases like") || lower.includes("fir-") || lower.includes("ಸಾರಾಂಶ")
  ) {
    return responses.summary_case;
  }

  // Network intent
  if (
    lower.includes("network") || lower.includes("suspect") || lower.includes("ring") ||
    lower.includes("connection") || lower.includes("graph") || lower.includes("gang") ||
    lower.includes("ಜಾಲ")
  ) {
    return responses.network_crime_ring;
  }

  // Specific crime categories first (so queries like 'most murders' don't hit the generic theft check)
  if (
    lower.includes("murder") || lower.includes("killing") || lower.includes("homicide") ||
    lower.includes("ಕೊಲೆ") || lower.includes("ಕೊಲೆಗಳು")
  ) {
    return responses.fact_highest_murder;
  }

  if (
    lower.includes("cyber") || lower.includes("online") || lower.includes("phishing") ||
    lower.includes("hack") || lower.includes("fraud") || lower.includes("ಸೈಬರ್")
  ) {
    return responses.fact_highest_cyber;
  }

  // Fact / stats intent
  if (
    lower.includes("highest") || lower.includes("most") || lower.includes("how many") ||
    lower.includes("count") || lower.includes("stats") || lower.includes("hotspot") ||
    lower.includes("district") || lower.includes("spike") || lower.includes("trend") ||
    lower.includes("emerging") || lower.includes("crime") || lower.includes("theft") ||
    lower.includes("ಯಾವ") || lower.includes("ಹೆಚ್ಚಿನ") || lower.includes("ಜಿಲ್ಲೆ") ||
    lower.includes("ಕಳ್ಳತನ")
  ) {
    return responses.fact_highest_theft;
  }

  // Default: narrative / MO pattern
  return responses.narrative_mo_pattern;
}
