"use client";

import { useDeferredValue, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Check } from "lucide-react";

interface AnswerPanelProps {
  answer: string;
  isStreaming: boolean;
}

export function AnswerPanel({ answer, isStreaming }: AnswerPanelProps) {
  const [copied, setCopied] = useState(false);
  const deferredAnswer = useDeferredValue(answer);

  async function handleCopy() {
    await navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2_000);
  }

  const showSkeleton = isStreaming && answer.length === 0;

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{
              background: isStreaming ? "var(--primary)" : "var(--success)",
              boxShadow: isStreaming
                ? "0 0 8px color-mix(in oklch, var(--primary) 70%, transparent)"
                : "none",
              animation: isStreaming ? "glow-pulse 1.5s ease-in-out infinite" : "none",
            }}
          />
          <span
            className="text-[10px] font-medium tracking-widest uppercase"
            style={{ fontFamily: "var(--font-mono)", color: "var(--muted-foreground)" }}
          >
            Analysis
          </span>
          {isStreaming && (
            <span
              className="text-[10px]"
              style={{
                fontFamily: "var(--font-mono)",
                color: "color-mix(in oklch, var(--primary) 70%, transparent)",
              }}
            >
              generating…
            </span>
          )}
        </div>

        {answer.length > 0 && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[11px]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--foreground)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)")}
            aria-label="Copy answer to clipboard"
          >
            {copied ? (
              <>
                <Check className="size-3" style={{ color: "var(--success)" }} />
                <span style={{ color: "var(--success)" }}>Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3" />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {showSkeleton ? (
          <div className="space-y-3">
            {[100, 83, 100, 67, 91].map((w, i) => (
              <Skeleton key={i} className="h-4 rounded" style={{ width: `${w}%` }} />
            ))}
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {deferredAnswer + (isStreaming ? "▊" : "")}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
