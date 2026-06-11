# 11 — ROI Estimator

**Purpose:** A lightweight, honest estimator for the value this service adds. Uses **ranges and qualitative bands**, not precise guarantees.

---

## Assumptions

- These estimates describe **time-to-clarity and rework avoidance**, not a promise of delivered software.
- Actual impact depends on team experience, intake quality (`06`), and how well your idea matches the collection (`13`).
- "Acceleration" is relative to starting from a blank page with no reference base.

## Inputs

Rate each:

| Input | Scale |
|---|---|
| Project size | Small / Medium / Large |
| Number of developers | 1 / 2–4 / 5+ |
| Number of AI components | 1 / 2–3 / 4+ |
| Architecture uncertainty | Low / Medium / High |
| Unknown stack research needed | Low / Medium / High |
| Urgency | Low / Medium / High |
| Existing code | Yes / Partial / No |

## Outputs (qualitative bands)

For each, we report **Low / Moderate / High** with a rough range:

| Output | What it measures | Typical range* |
|---|---|---|
| Onboarding acceleration | How much faster devs/agents reach productive work | 1.2×–3× faster ramp |
| Architecture research reduction | Discovery/research time avoided | 20%–60% less |
| Blueprint value | Quality of the starting plan vs blank page | Moderate–High |
| Agent handoff value | How much an agent can do unattended with our pack | Moderate–High |
| Risk reduction | Fewer false starts / dead-end rewrites | Moderate–High |

\* Ranges are illustrative, not contractual.

## How inputs map to outputs (heuristics)

- **High architecture uncertainty + High unknown-stack research** → biggest gains in *research reduction* and *blueprint value* (this is the blank-page case we help most).
- **More AI components** → higher *agent handoff value* (more proven patterns to reuse).
- **Existing code = Yes** → gains shift toward *risk reduction* and *adaptation guidance* rather than greenfield acceleration.
- **High urgency** → favor **Fast Path** (`10`); ROI shows up as speed-to-orientation.
- **Low AI involvement** → all outputs trend Low; reconsider fit (`10`).

## Example estimates

**Example A — greenfield RAG + approval, 3 devs, high uncertainty, no existing code, medium urgency**

| Output | Estimate |
|---|---|
| Onboarding acceleration | High (≈2–3× ramp) |
| Architecture research reduction | High (≈40–60%) |
| Blueprint value | High |
| Agent handoff value | High |
| Risk reduction | High |

*Why:* multiple AI components are well-covered in the collection; the blank-page cost we remove is large.

**Example B — adding one eval loop to an existing app, 2 devs, low uncertainty, existing code, high urgency**

| Output | Estimate |
|---|---|
| Onboarding acceleration | Moderate |
| Architecture research reduction | Low–Moderate |
| Blueprint value | Moderate |
| Agent handoff value | Moderate |
| Risk reduction | Moderate |

*Why:* narrow scope and known stack mean less to discover; value concentrates in a proven eval pattern and avoiding a flawed first design.

## Honesty note

If your idea maps weakly to the collection (low Blueprint Confidence, `13`), we say so and ROI estimates drop accordingly. We'd rather scope you to Fast Path than oversell a Deep Blueprint.
