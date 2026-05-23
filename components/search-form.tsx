"use client";

import { useState, type FormEvent } from "react";

interface SearchFormProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
  onCancel: () => void;
  onClear: () => void;
  hasResults: boolean;
}

export function SearchForm({ onSubmit, isLoading, onCancel, onClear, hasResults }: SearchFormProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
  }

  const canSubmit = Boolean(query.trim()) && !isLoading;
  const canClear = Boolean(query.trim()) || hasResults;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <textarea
          placeholder="e.g. What are the latest breakthroughs in quantum computing and their practical applications?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={4}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              handleSubmit(e as unknown as FormEvent);
            }
          }}
          className="w-full resize-none rounded-lg px-4 py-3.5 text-sm leading-relaxed outline-none placeholder:opacity-30"
          style={{
            fontFamily: "var(--font-sans)",
            background: "var(--card)",
            color: "var(--foreground)",
            border: focused
              ? "1px solid color-mix(in oklch, var(--primary) 60%, transparent)"
              : "1px solid var(--border)",
            boxShadow: focused
              ? "0 0 0 3px color-mix(in oklch, var(--primary) 10%, transparent)"
              : "none",
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        {isLoading ? (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium border"
            style={{
              fontFamily: "var(--font-mono)",
              borderColor: "color-mix(in oklch, var(--destructive) 50%, transparent)",
              color: "var(--destructive)",
              background: "color-mix(in oklch, var(--destructive) 8%, transparent)",
            }}
          >
            <span className="inline-block w-2 h-2 rounded-sm bg-current" />
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex items-center gap-1.5 rounded-lg px-5 py-2 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              fontFamily: "var(--font-mono)",
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              boxShadow: canSubmit
                ? "0 0 20px color-mix(in oklch, var(--primary) 30%, transparent)"
                : "none",
              letterSpacing: "0.05em",
            }}
          >
            Research
            <span className="opacity-70">→</span>
          </button>
        )}

        <span
          className="text-[11px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--muted-foreground)" }}
        >
          {isLoading ? (
            <span className="flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="inline-block w-1 h-1 rounded-full"
                  style={{
                    background: "var(--primary)",
                    animation: `dot-pulse 1.4s ease-in-out ${i * 0.16}s infinite`,
                  }}
                />
              ))}
              <span>Researching…</span>
            </span>
          ) : (
            "⌘↵ to submit"
          )}
        </span>

        {canClear && !isLoading && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              onClear();
            }}
            className="ml-auto text-[11px] rounded px-2.5 py-1 transition-colors"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--muted-foreground)",
              border: "1px solid var(--border)",
            }}
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
}
