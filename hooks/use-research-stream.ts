"use client";

import { useState, useCallback, useRef } from "react";
import type { SSEEvent, SearchResultGroup } from "@/lib/types";

export function useResearchStream() {
  const [status, setStatus] = useState("");
  const [subQueries, setSubQueries] = useState<string[]>([]);
  const [searchingIndices, setSearchingIndices] = useState<number[]>([]);
  const [sources, setSources] = useState<SearchResultGroup[]>([]);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const startResearch = useCallback(async (query: string) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setAnswer("");
    setSources([]);
    setSubQueries([]);
    setSearchingIndices([]);
    setError(null);
    setStatus("");

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      if (!res.body) throw new Error("Response body is not readable");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          let event: SSEEvent;
          try {
            event = JSON.parse(part.slice(6));
          } catch {
            continue;
          }

          switch (event.type) {
            case "status":
              setStatus(event.message);
              break;
            case "subqueries":
              setSubQueries(event.queries);
              break;
            case "searching":
              setSearchingIndices((prev) => [...prev, event.index]);
              break;
            case "search_complete":
              setSearchingIndices((prev) => prev.filter((i) => i !== event.index));
              break;
            case "sources":
              setSources(event.data);
              break;
            case "answer_chunk":
              setAnswer((prev) => prev + event.content);
              break;
            case "done":
              setIsLoading(false);
              break;
            case "error":
              setError(event.message);
              setIsLoading(false);
              break;
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError((err as Error).message);
      }
      setIsLoading(false);
    }
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
    setStatus("");
    setSubQueries([]);
    setSearchingIndices([]);
    setSources([]);
    setAnswer("");
    setError(null);
  }, []);

  return {
    status,
    subQueries,
    searchingIndices,
    sources,
    answer,
    isLoading,
    error,
    startResearch,
    cancel,
    reset,
  };
}
