"use client";

import { useResearchStream } from "@/hooks/use-research-stream";
import { SearchForm } from "./search-form";
import { ProgressPanel } from "./progress-panel";
import { SourcesPanel } from "./sources-panel";
import { AnswerPanel } from "./answer-panel";
import { ThemeToggle } from "./theme-toggle";

export function ResearchInterface() {
  const {
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
  } = useResearchStream();

  const hasProgress = isLoading || subQueries.length > 0;
  const hasSources = sources.length > 0;
  const hasAnswer = answer.length > 0;

  return (
    <div className="min-h-screen">
      {/* Sticky header */}
      <header
        className="sticky top-0 z-10 border-b border-border/50 px-6 py-4"
        style={{ background: "var(--header-bg)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <span
            className="text-2xl leading-none select-none"
            style={{ color: "var(--primary)", fontFamily: "var(--font-display)" }}
          >
            ◈
          </span>
          <div>
            <h1
              className="text-[11px] font-semibold tracking-[0.2em] uppercase"
              style={{
                fontFamily: "var(--font-mono)",
                color: "color-mix(in oklch, var(--foreground) 80%, transparent)",
              }}
            >
              Deep Research
            </h1>
            <p
              className="text-[9px] tracking-[0.2em] uppercase"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--muted-foreground)",
              }}
            >
              Intelligence Engine
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span
              className="text-[9px] font-medium tracking-wider uppercase border border-border/60 rounded px-2 py-1 hidden sm:inline"
              style={{ fontFamily: "var(--font-mono)", color: "var(--muted-foreground)" }}
            >
              OpenRouter + Exa
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 space-y-10">
        {/* Hero */}
        <div className="space-y-3 animate-fade-in-up">
          <h2
            className="text-4xl font-bold leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
          >
            What are you
            <br />
            <em
              className="not-italic"
              style={{ color: "var(--primary)" }}
            >
              researching
            </em>{" "}
            today?
          </h2>
          <p className="text-sm max-w-lg" style={{ color: "var(--muted-foreground)" }}>
            Ask any complex question. The agent decomposes it, runs parallel web searches, and synthesizes a comprehensive answer.
          </p>
        </div>

        {/* Search form */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.08s" }}>
          <SearchForm
            onSubmit={startResearch}
            isLoading={isLoading}
            onCancel={cancel}
            onClear={reset}
            hasResults={hasProgress || hasSources || hasAnswer || !!error}
          />
        </div>

        {/* Error state */}
        {error && (
          <div
            className="animate-fade-in-up rounded-lg border px-4 py-3 space-y-1"
            style={{
              borderColor: "color-mix(in oklch, var(--destructive) 40%, transparent)",
              background: "color-mix(in oklch, var(--destructive) 8%, transparent)",
            }}
          >
            <p
              className="text-sm font-medium"
              style={{ fontFamily: "var(--font-mono)", color: "var(--destructive)" }}
            >
              {error}
            </p>
            {error.includes("timed out") && (
              <p className="text-xs" style={{ color: "color-mix(in oklch, var(--destructive) 70%, transparent)" }}>
                Try breaking your question into a more focused query.
              </p>
            )}
            {error.includes("API authentication") && (
              <p className="text-xs" style={{ color: "color-mix(in oklch, var(--destructive) 70%, transparent)" }}>
                Check that OPENROUTER_API_KEY and EXA_API_KEY are set in .env.local.
              </p>
            )}
            {error.includes("Rate limit") && (
              <p className="text-xs" style={{ color: "color-mix(in oklch, var(--destructive) 70%, transparent)" }}>
                Wait 30–60 seconds before submitting again.
              </p>
            )}
            {error.includes("searches failed") && (
              <p className="text-xs" style={{ color: "color-mix(in oklch, var(--destructive) 70%, transparent)" }}>
                Check your EXA_API_KEY or try again in a moment.
              </p>
            )}
          </div>
        )}

        {/* Progress */}
        {hasProgress && (
          <div className="animate-fade-in-up space-y-5">
            <div
              className="h-px"
              style={{ background: "linear-gradient(to right, transparent, var(--border), transparent)" }}
            />
            <ProgressPanel
              status={status}
              subQueries={subQueries}
              searchingIndices={searchingIndices}
            />
          </div>
        )}

        {/* Sources */}
        {hasSources && (
          <div className="animate-fade-in-up space-y-5">
            <div
              className="h-px"
              style={{ background: "linear-gradient(to right, transparent, var(--border), transparent)" }}
            />
            <SourcesPanel sources={sources} />
          </div>
        )}

        {/* Answer */}
        {hasAnswer && (
          <div className="animate-fade-in-up space-y-5">
            <div
              className="h-px"
              style={{ background: "linear-gradient(to right, transparent, var(--border), transparent)" }}
            />
            <AnswerPanel answer={answer} isStreaming={isLoading} />
          </div>
        )}
      </main>
    </div>
  );
}
