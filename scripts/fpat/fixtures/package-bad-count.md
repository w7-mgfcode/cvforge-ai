# FPAT Plan Package — bad count fixture (only 4 subtasks)

## Subtasks

### ST1 — first subtask
- **Purpose:** do the first thing.
- **Scope:** file A.
- **Out of scope:** everything else.
- **Dependencies:** none.
- **Risks / blockers:** none.
- **Acceptance criteria:** `- [ ]` it works.
- **Why it matters now:** unblocks ST2.

### ST2 — second subtask
- **Purpose:** do the second thing.
- **Scope:** file B.
- **Out of scope:** file A.
- **Dependencies:** ST1.
- **Risks / blockers:** none.
- **Acceptance criteria:** `- [ ]` it works.
- **Why it matters now:** unblocks ST3.

### ST3 — third subtask
- **Purpose:** do the third thing.
- **Scope:** file C.
- **Out of scope:** files A, B.
- **Dependencies:** ST2.
- **Risks / blockers:** none.
- **Acceptance criteria:** `- [ ]` it works.
- **Why it matters now:** unblocks ST4.

### ST4 — fourth subtask
- **Purpose:** do the fourth thing.
- **Scope:** file D.
- **Out of scope:** files A, B, C.
- **Dependencies:** ST3.
- **Risks / blockers:** none.
- **Acceptance criteria:** `- [ ]` it works.
- **Why it matters now:** there is no ST5 — this fixture must fail.
