import { chatComplete, chatCompleteStream } from "@/lib/openrouter";
import { searchExa } from "@/lib/exa";
import {
  buildSubQueryPrompt,
  buildSynthesisPrompt,
  parseSubQueries,
} from "@/lib/research-prompts";
import { RESEARCH_CONFIG } from "@/lib/config";
import type { SSEEvent, SearchResultGroup } from "@/lib/types";

const INJECTION_PATTERN =
  /ignore\s+(previous|all|above)\s+(instructions?|prompts?)|system\s*:|<\/?s(ystem|inst)>|\[INST\]|\[\/INST\]/gi;

function sanitizeQuery(query: string): string {
  return query.replace(INJECTION_PATTERN, "").trim();
}

function userFriendlyError(err: unknown): { message: string; detail: string } {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.includes("401")) {
    return { message: "API authentication failed. Check your API keys.", detail: raw };
  }
  if (raw.includes("429")) {
    return { message: "Rate limit reached. Please wait a moment and try again.", detail: raw };
  }
  if (raw.includes("timed out") || (err instanceof Error && err.name === "AbortError")) {
    return { message: "The request timed out. Try a more specific query.", detail: raw };
  }
  if (raw.includes("All searches failed")) {
    return { message: "All web searches failed. Check your Exa API key or try again later.", detail: raw };
  }
  return { message: raw, detail: raw };
}

export async function POST(request: Request) {
  const { query } = await request.json();

  if (!query || typeof query !== "string" || !query.trim()) {
    return new Response(JSON.stringify({ error: "Query is required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (query.length > RESEARCH_CONFIG.maxQueryLength) {
    return new Response(
      JSON.stringify({ error: `Query must be ${RESEARCH_CONFIG.maxQueryLength} characters or fewer.` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const safeQuery = sanitizeQuery(query);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;

      function send(event: SSEEvent) {
        if (closed) return;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      }

      // Hard cap: close the stream after globalTimeoutMs regardless of phase
      const globalTimer = setTimeout(() => {
        if (!closed) {
          send({ type: "error", message: "Research timed out. Try a more specific query.", detail: "global timeout" });
          closed = true;
          controller.close();
        }
      }, RESEARCH_CONFIG.globalTimeoutMs);

      try {
        // Phase 1: generate sub-queries
        send({ type: "status", message: "Generating research plan…" });

        const raw = await chatComplete([
          { role: "user", content: buildSubQueryPrompt(safeQuery) },
        ]);
        const subQueries = parseSubQueries(raw);

        send({ type: "subqueries", queries: subQueries });
        send({ type: "status", message: "Searching the web…" });

        // Phase 2: parallel Exa searches — allSettled so one failure doesn't abort the rest
        const settled = await Promise.allSettled(
          subQueries.map(async (q, index) => {
            send({ type: "searching", query: q, index });
            const results = await searchExa(q);
            send({ type: "search_complete", query: q, index, resultCount: results.length });
            return { query: q, results } as SearchResultGroup;
          })
        );

        const searchResults: SearchResultGroup[] = settled
          .filter((r): r is PromiseFulfilledResult<SearchResultGroup> => r.status === "fulfilled")
          .map((r) => r.value);

        if (searchResults.length === 0) {
          throw new Error("All searches failed — please try again.");
        }

        send({ type: "sources", data: searchResults });
        send({ type: "status", message: "Synthesising findings…" });

        // Phase 3: stream synthesis
        const messages = [
          { role: "user" as const, content: buildSynthesisPrompt(safeQuery, searchResults) },
        ];

        for await (const chunk of chatCompleteStream(messages)) {
          send({ type: "answer_chunk", content: chunk });
        }

        send({ type: "done" });
      } catch (err) {
        const { message, detail } = userFriendlyError(err);
        send({ type: "error", message, detail });
      } finally {
        clearTimeout(globalTimer);
        if (!closed) {
          closed = true;
          controller.close();
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
