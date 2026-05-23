# Deep Research Agent
### Built with Claude Code · Next.js · OpenRouter · Exa AI

A production-ready deep research agent that accepts a natural
language query, generates targeted sub-queries, searches 30+
live web sources via Exa, and synthesizes a structured markdown
research report — all streaming in real time.

Built entirely using Claude Code — Anthropic's agentic coding tool.

---

## What It Does

1. Accepts a natural language research query
2. Generates 6+ targeted sub-queries automatically
3. Searches 30+ sources via Exa web search API
4. Synthesizes findings into structured markdown
5. Streams the response in real time to the UI

---

## Example Output

**Query:** "Who is the digital artist Lente Scura?"

**Agent generated sub-queries:**
- Biography and real identity of digital artist Lente Scura
- Lente Scura digital art style and creative philosophy
- Official art portfolio and social media presence
- NFT marketplace sales and digital art exhibitions
- Critical reception and reviews of artwork
- Collaborations and presence in the digital art community

**Sources found:** 30+
**Output:** Structured markdown research report with
sections, citations, and linked sources — streamed live

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | shadcn/ui + Tailwind CSS |
| AI Routing | OpenRouter API |
| Default Model | google/gemini-3-flash-preview |
| Web Search | Exa AI Search API |
| Built With | Claude Code |

---

## Architecture
