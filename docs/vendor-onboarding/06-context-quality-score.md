# 06 — Context Quality Score

**Purpose:** A 0–100 model that rates how good the submitted context is — so both sides know whether we have enough to build a high-quality blueprint before we start.

---

## Why this exists

Blueprint quality is capped by intake quality. This score makes that explicit and tells you exactly what to add. It is run **before** Graph Analysis.

## Categories

Eight categories, weighted to total 100:

| Category | Weight | Looks for |
|---|---:|---|
| Goal clarity | 20 | A specific, bounded goal — not "an AI app" |
| User clarity | 10 | Who uses it and in what role |
| Workflow clarity | 15 | Step-by-step of what should happen |
| Data clarity | 15 | Sources, format, volume, sensitivity |
| Stack clarity | 10 | Current/preferred tech, or explicit "open" |
| AI behavior clarity | 15 | What the AI retrieves/decides/generates/approves/evaluates |
| Constraints clarity | 10 | Security, privacy, must-avoid, deployment |
| Output expectation clarity | 5 | Which deliverables you want from us (`07`) |

Each category is scored 0–100% of its weight, then summed.

### Scoring rubric per category

- **0–33% of weight** — absent or one vague line.
- **34–66% of weight** — present but underspecified; we can partly infer.
- **67–100% of weight** — specific and actionable; little inference needed.

## Bands

| Total | Band | Meaning | What we do |
|---:|---|---|---|
| **0–39** | Low | Too little to build a reliable blueprint | We pause and send targeted follow-ups |
| **40–69** | Medium | Workable; some assumptions required | We proceed and **list every assumption** (Fast Path recommended) |
| **70–100** | High | Strong basis for a confident blueprint | We proceed to Deep Blueprint if requested |

## What low / medium / high mean for you

- **Low:** Expect questions before output. This protects you from a confident-but-wrong plan.
- **Medium:** You'll get useful results, but read the assumptions section carefully — that's where risk hides.
- **High:** The Blueprint Confidence Score (`13`) is no longer limited by intake; it now reflects how well the graph itself supports your idea.

## Example

> Intake says "We want an AI assistant for support" and nothing else.

| Category | Score |
|---|---:|
| Goal | 6/20 |
| User | 3/10 |
| Workflow | 0/15 |
| Data | 0/15 |
| Stack | 0/10 |
| AI behavior | 3/15 |
| Constraints | 0/10 |
| Output expectation | 0/5 |
| **Total** | **12/100 — Low** |

Action: we ask about data sources, the approval/escalation flow, the stack, and the output you want — then re-score.
