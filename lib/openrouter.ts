import type { Message } from "./types";
import { RESEARCH_CONFIG } from "./config";

const BASE_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL ?? "google/gemini-3-flash-preview";

function headers() {
  return {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  };
}

export async function chatComplete(
  messages: Message[],
  timeoutMs = RESEARCH_CONFIG.subQueryTimeoutMs
): Promise<string> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: headers(),
    signal: ac.signal,
    body: JSON.stringify({ model: DEFAULT_MODEL, messages, stream: false }),
  }).finally(() => clearTimeout(timer));

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.choices[0].message.content as string;
}

export async function* chatCompleteStream(
  messages: Message[],
  timeoutMs = RESEARCH_CONFIG.synthesisTimeoutMs
): AsyncGenerator<string> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: headers(),
    signal: ac.signal,
    body: JSON.stringify({ model: DEFAULT_MODEL, messages, stream: true }),
  }).finally(() => clearTimeout(timer));

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${text}`);
  }

  if (!res.body) throw new Error("OpenRouter response has no body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const raw = line.slice(6).trim();
      if (raw === "[DONE]") return;
      try {
        const parsed = JSON.parse(raw);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        // skip malformed chunks
      }
    }
  }
}
