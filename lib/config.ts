export const RESEARCH_CONFIG = {
  maxSubQueries: 6,
  searchResultsPerQuery: 5,
  subQueryTimeoutMs: 30_000,
  synthesisTimeoutMs: 60_000,
  globalTimeoutMs: 120_000,
  maxQueryLength: 500,
  maxRetries: 3,
  retryBaseDelayMs: 1_000,
} as const;
