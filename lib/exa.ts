import type { ExaResult } from "./types";
import { RESEARCH_CONFIG } from "./config";
import { withRetry } from "./retry";

const BASE_URL = "https://api.exa.ai";

export async function searchExa(
  query: string,
  numResults = RESEARCH_CONFIG.searchResultsPerQuery,
  timeoutMs = 15_000
): Promise<ExaResult[]> {
  return withRetry(
    async () => {
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(), timeoutMs);
      const res = await fetch(`${BASE_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.EXA_API_KEY!,
        },
        signal: ac.signal,
        body: JSON.stringify({
          query,
          numResults,
          type: "auto",
          contents: { highlights: true, text: false },
        }),
      });

      clearTimeout(timer);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Exa error ${res.status}: ${text}`);
      }

      const data = await res.json();
      return (data.results ?? []) as ExaResult[];
    },
    RESEARCH_CONFIG.maxRetries,
    RESEARCH_CONFIG.retryBaseDelayMs
  );
}
