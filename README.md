# Deep Research Agent
---

## 🔗 Live Demo

**[Try it live → deep-research-agent-five.vercel.app](https://deep-research-agent-five.vercel.app/)**

---

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

User Query
↓
Sub-Query Generator (OpenRouter LLM)
↓
Exa Web Search (30+ sources per query)
↓
Synthesis Agent (OpenRouter LLM)
↓
Streaming Markdown Response → UI

---

## Setup

1. Clone the repo:
```bash
git clone https://github.com/Paul-Orlando/deep-research-agent.git
cd deep-research-agent
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env.local
```
Add your API keys to `.env.local`

4. Run the development server:
```bash
npm run dev
```

5. Open `http://localhost:3000`

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENROUTER_API_KEY` | ✅ | Get from openrouter.ai/keys |
| `EXA_API_KEY` | ✅ | Get from dashboard.exa.ai |
| `OPENROUTER_MODEL` | Optional | Default: google/gemini-3-flash-preview |
| `NEXT_PUBLIC_APP_URL` | Optional | Default: http://localhost:3000 |

---

## Project Structure

| Path | Description |
|---|---|
| `app/` | Next.js App Router pages and API routes |
| `components/` | React UI components |
| `lib/` | OpenRouter and Exa utility functions |
| `hooks/` | Custom React hooks |
| `AGENTS.md` | Claude Code agent configuration |
| `CLAUDE.md` | Claude Code project instructions |

---

## Built With Claude Code

This entire application was built using Claude Code —
Anthropic's agentic coding tool — including the Next.js
setup, OpenRouter integration, Exa search pipeline,
streaming UI, and sub-query generation architecture.

---

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Paul-Orlando/deep-research-agent)

Add your environment variables in the Vercel dashboard
during deployment.

---

## Roadmap

- Add source citation links inline in output
- Support multiple LLM model selection in UI
- Add query history and saved research
- Export to PDF or Notion
- One-click Vercel deployment with env setup guide

---

## Related Repos

| Repo | Pattern | Framework |
|---|---|---|
| [ai-agent-team-supervisor-pattern](https://github.com/Paul-Orlando/ai-agent-team-supervisor-pattern) | Supervisor Pattern | Flowise AgentFlows V2/V3 |
| [ai-research-assistant-rag](https://github.com/Paul-Orlando/ai-research-assistant-rag) | RAG + Python | Python + OpenAI API |
| [ai-food-chatbot-agent](https://github.com/Paul-Orlando/ai-food-chatbot-agent) | Agentic RAG | Flowise + Postgres |
| [data-analysis-agent](https://github.com/Paul-Orlando/data-analysis-agent) | Custom GPT | ChatGPT + Versioned Instructions |

---

## Author

Paul Orlando
Creative Technologist | AI Agent Developer | Data Analytics
🌐 [paulforlando.com](https://www.paulforlando.com)
💼 [LinkedIn](https://www.linkedin.com/in/paul-orlando-7841b5154)
🐙 [GitHub](https://github.com/Paul-Orlando)

---

## License

MIT License
