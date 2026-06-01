---
paths:
  - "src/lib/ai/**"
  - "src/components/ai-assistant/**/*.tsx"
---

# AI Copilot Conventions (currently simulated)

## Current State: MOCK, not real AI

`src/lib/ai/copilot.ts` is a **simulation** — it does not call any LLM. It exposes:

- `computeDiff()` — word-level diff for the UI (some hardcoded test cases).
- `optimizeTextSection()` — simulated text optimization with mock responses + `setTimeout` latency.
- `matchJobDescription()` — keyword-based job matching (no real NLP).

`src/components/ai-assistant/CopilotDiffPanel.tsx` is the two-mode UI ("Factual Optimizer",
"Job Match Checker"). It is controlled: `documentData` in, `onUpdateContent` out
(`CopilotUpdateField = keyof CVContent['candidateIdentity'] | 'employmentTimeline'`).

Some mock logic branches on specific sample content (e.g. `original.includes('Gábor Szabó')`).
When generalizing, do not rely on that — make it data-driven.

## Hard Constraint: No Server Runtime

`next.config.mjs` sets `output: 'export'` → **no API routes, no server actions, no server-side
secrets**. A real LLM integration CANNOT be dropped in as a server call. Before building real AI:

- Decide the hosting model first (drop static export for a hosted runtime, OR call a provider
  directly from the client with a user-supplied/public-safe key, OR a separate backend/proxy).
- Surface that decision explicitly in the plan (`/plan-feature`) — it changes the deployment model.
- Never commit API keys; never put a privileged key in client code (it ships to the browser).

## Conventions

- Keep the copilot's public function signatures stable so the panel doesn't churn.
- Preserve the controlled-component contract (`onUpdateContent`) — copilot edits flow through
  the same one-way path as manual edits, into `studio/page.tsx`.
- Factual-tailoring intent: optimization must not fabricate experience; keep edits truthful and
  reversible (the diff view exists so users can verify).

## Anti-patterns

- Never present mock output as if it were a real model result without a clear "simulated" signal.
- Never add a server-side LLM call while `output: 'export'` is set.
- Never bypass `onUpdateContent` to mutate document state directly from the panel.
