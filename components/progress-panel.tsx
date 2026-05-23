"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface ProgressPanelProps {
  status: string;
  subQueries: string[];
  searchingIndices: number[];
}

const PHASES = [
  { label: "Decompose" },
  { label: "Search" },
  { label: "Synthesize" },
];

function getActivePhase(status: string, subQueries: string[], searchingIndices: number[]): number {
  const s = status.toLowerCase();
  if (s.includes("generat") || s.includes("decompos") || s.includes("sub-quer")) return 0;
  if (s.includes("search")) return 1;
  if (s.includes("synthes") || s.includes("analyz") || s.includes("compil")) return 2;
  if (subQueries.length > 0 && searchingIndices.length > 0) return 1;
  if (subQueries.length > 0 && searchingIndices.length === 0) return 2;
  return 0;
}

export function ProgressPanel({ status, subQueries, searchingIndices }: ProgressPanelProps) {
  const completedCount = subQueries.length - searchingIndices.length;
  const activePhase = getActivePhase(status, subQueries, searchingIndices);

  return (
    <div className="space-y-5">
      {/* Phase pipeline */}
      <div className="flex items-center gap-3">
        {PHASES.map((phase, i) => {
          const isActive = activePhase === i;
          const isDone = activePhase > i;

          return (
            <div key={phase.label} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{
                    background: isDone
                      ? "var(--success)"
                      : isActive
                      ? "var(--primary)"
                      : "color-mix(in oklch, var(--foreground) 20%, transparent)",
                    boxShadow: isActive
                      ? "0 0 8px color-mix(in oklch, var(--primary) 60%, transparent)"
                      : "none",
                  }}
                />
                <span
                  className="text-[10px] font-medium tracking-widest uppercase"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: isDone
                      ? "color-mix(in oklch, var(--primary) 55%, var(--muted-foreground))"
                      : isActive
                      ? "var(--primary)"
                      : "color-mix(in oklch, var(--foreground) 30%, transparent)",
                  }}
                >
                  {phase.label}
                </span>
                {isActive && (
                  <span className="flex gap-0.5 items-center">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="inline-block w-1 h-1 rounded-full"
                        style={{
                          background: "color-mix(in oklch, var(--primary) 70%, transparent)",
                          animation: `dot-pulse 1.2s ease-in-out ${d * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </span>
                )}
              </div>
              {i < PHASES.length - 1 && (
                <span
                  className="text-[10px]"
                  style={{ color: "color-mix(in oklch, var(--foreground) 18%, transparent)" }}
                >
                  ——
                </span>
              )}
            </div>
          );
        })}

        {subQueries.length > 0 && searchingIndices.length > 0 && (
          <span
            className="ml-auto text-[10px] tabular-nums"
            style={{ fontFamily: "var(--font-mono)", color: "var(--muted-foreground)" }}
          >
            {completedCount}/{subQueries.length}
          </span>
        )}
      </div>

      {/* Sub-query badges */}
      {subQueries.length === 0 ? (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-28 rounded-full" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {subQueries.map((q, i) => {
            const isSearching = searchingIndices.includes(i);
            return (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] rounded-full border animate-badge-enter"
                title={q}
                style={{
                  animationDelay: `${i * 0.055}s`,
                  fontFamily: "var(--font-mono)",
                  borderColor: isSearching
                    ? "color-mix(in oklch, var(--primary) 55%, transparent)"
                    : "var(--border)",
                  background: isSearching
                    ? "color-mix(in oklch, var(--primary) 9%, transparent)"
                    : "var(--card)",
                  color: isSearching
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
                  boxShadow: isSearching
                    ? "0 0 12px color-mix(in oklch, var(--primary) 15%, transparent)"
                    : "none",
                }}
              >
                {isSearching && (
                  <span className="flex gap-0.5 shrink-0">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="inline-block w-1 h-1 rounded-full"
                        style={{
                          background: "color-mix(in oklch, var(--primary) 80%, transparent)",
                          animation: `dot-pulse 1.2s ease-in-out ${d * 0.15}s infinite`,
                        }}
                      />
                    ))}
                  </span>
                )}
                <span className="max-w-[190px] truncate">{q}</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
