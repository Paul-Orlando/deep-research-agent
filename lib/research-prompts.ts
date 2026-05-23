import type { SearchResultGroup } from "./types";

export function buildSubQueryPrompt(userQuery: string): string {
  return `You are a deep research planning agent. Decompose the user's research question into targeted web search sub-queries that together provide comprehensive coverage of the topic.

User's question: "${userQuery}"

Rules:
- Generate 4 sub-queries for focused or technical questions; use 5-6 only for broad, multi-faceted topics
- Each sub-query must explore a distinct aspect (background, recent news, expert views, statistics, counterarguments, related context)
- Sub-queries must be specific and search-engine friendly — not conversational
- Return ONLY a valid JSON array of strings, nothing else, no markdown fencing

Example output:
["sub-query one", "sub-query two", "sub-query three", "sub-query four"]`;
}

export function parseSubQueries(raw: string): string[] {
  const clean = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  try {
    const match = clean.match(/\[[\s\S]*\]/);
    const parsed = JSON.parse(match ? match[0] : clean);
    if (!Array.isArray(parsed)) throw new Error("Expected JSON array");
    return parsed.slice(0, 6) as string[];
  } catch {
    // Fallback: extract quoted strings from the response
    const fallback = [...clean.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    if (fallback.length > 0) return fallback.slice(0, 6);
    throw new Error("Could not parse research plan from model response — please try again.");
  }
}

export function buildSynthesisPrompt(
  userQuery: string,
  searchResults: SearchResultGroup[]
): string {
  const context = searchResults
    .map(
      (group, i) =>
        `## Search ${i + 1}: "${group.query}"\n` +
        group.results
          .map(
            (r, j) =>
              `### Source ${i + 1}.${j + 1}: ${r.title}\nURL: ${r.url}\n${(r.highlights ?? []).join("\n")}`
          )
          .join("\n\n")
    )
    .join("\n\n---\n\n");

  return `You are a deep research analyst. Using the web search results below, write a comprehensive, well-structured answer to the user's research question.

USER'S QUESTION: ${userQuery}

RESEARCH FINDINGS:
${context}

Instructions:
- Organise your answer with clear markdown headings (##, ###)
- Synthesise information across multiple sources — do not simply list them
- Include key facts, statistics, and expert perspectives from the results
- Note any conflicting information or areas of uncertainty
- Cite sources inline using [Title](URL) format when referencing specific claims
- End with a section titled "Key Takeaways" (using a ## heading) with 3-5 bullet points
- Write in-depth: this should read like a high-quality research brief`;
}
