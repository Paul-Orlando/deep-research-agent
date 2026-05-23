export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ExaResult {
  title: string;
  url: string;
  publishedDate?: string;
  highlights?: string[];
}

export interface SearchResultGroup {
  query: string;
  results: ExaResult[];
}

export type SSEEvent =
  | { type: "status"; message: string }
  | { type: "subqueries"; queries: string[] }
  | { type: "searching"; query: string; index: number }
  | { type: "search_complete"; query: string; index: number; resultCount: number }
  | { type: "sources"; data: SearchResultGroup[] }
  | { type: "answer_chunk"; content: string }
  | { type: "done" }
  | { type: "error"; message: string; detail?: string };
