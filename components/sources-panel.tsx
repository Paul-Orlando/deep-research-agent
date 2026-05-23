"use client";

import { useState } from "react";
import type { SearchResultGroup } from "@/lib/types";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

interface SourcesPanelProps {
  sources: SearchResultGroup[];
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export function SourcesPanel({ sources }: SourcesPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const allResults = sources.flatMap((g) => g.results);
  const panelId = "sources-list";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2"
          aria-expanded={expanded}
          aria-controls={panelId}
          style={{ color: "var(--muted-foreground)" }}
        >
          <span
            className="text-[10px] font-medium tracking-widest uppercase"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Sources
          </span>
          <span
            className="text-[10px] rounded px-1.5 py-0.5 tabular-nums"
            style={{
              fontFamily: "var(--font-mono)",
              background: "var(--muted)",
              color: "var(--muted-foreground)",
            }}
          >
            {allResults.length}
          </span>
          {expanded ? (
            <ChevronUp className="size-3" />
          ) : (
            <ChevronDown className="size-3" />
          )}
        </button>
      </div>

      {expanded && (
        <div id={panelId} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {allResults.map((result, i) => {
            const domain = getDomain(result.url);
            return (
              <a
                key={i}
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-2 p-3 rounded-lg border animate-badge-enter"
                style={{
                  animationDelay: `${i * 0.04}s`,
                  borderColor: "var(--border)",
                  background: "var(--card)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "color-mix(in oklch, var(--primary) 30%, transparent)";
                  el.style.background = "var(--surface)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--border)";
                  el.style.background = "var(--card)";
                }}
              >
                {/* Domain row */}
                <div className="flex items-center gap-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
                    alt=""
                    width={14}
                    height={14}
                    className="rounded-sm shrink-0"
                    style={{ opacity: 0.6 }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <span
                    className="text-[10px] truncate flex-1"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "color-mix(in oklch, var(--muted-foreground) 80%, transparent)",
                    }}
                  >
                    {domain}
                  </span>
                  <ExternalLink
                    className="size-3 shrink-0 opacity-0 group-hover:opacity-100"
                    style={{ color: "var(--primary)" }}
                  />
                </div>

                {/* Title */}
                <p
                  className="text-xs font-medium line-clamp-2 leading-snug"
                  style={{ color: "color-mix(in oklch, var(--foreground) 85%, transparent)" }}
                >
                  {result.title}
                </p>

                {/* Snippet */}
                {result.highlights && result.highlights.length > 0 && (
                  <p
                    className="text-[11px] line-clamp-2 leading-snug"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {result.highlights[0]}
                  </p>
                )}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
