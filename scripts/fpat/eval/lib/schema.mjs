// scripts/fpat/eval/lib/schema.mjs
// FPAT Umbrella 2 — Phase-1 eval report schema (read-only, raw metrics, no thresholds).
import { z } from 'zod';

// Distribution of a numeric metric (durations in hours). Raw only — no thresholds.
export const DistributionSchema = z.object({
  count: z.number().int().nonnegative(),
  min: z.number().nullable(),
  max: z.number().nullable(),
  mean: z.number().nullable(),
  median: z.number().nullable(),
  p90: z.number().nullable(),
  unit: z.literal('hours'),
});

// Generic envelope every domain report shares (modeled on dark-factory feedback/*.json:
// per-criterion data + an explicit "what this proves / does not prove" summary).
export const DomainReportSchema = z.object({
  domain: z.string(),
  schemaVersion: z.literal('1.0.0'),
  generatedAt: z.string(),
  scope: z.object({
    label: z.string(),
    umbrella: z.string(),
    note: z.string(),
  }),
  inputs: z.array(z.string()),
  metrics: z.record(z.string(), z.unknown()),
  findings: z.array(z.string()),
  inferred: z.array(z.string()),
  proven: z.array(z.string()),
  notProven: z.array(z.string()),
  confidence: z.enum(['low', 'medium', 'high']),
});

export const ThroughputMetricsSchema = z.object({
  closedIssues: z.number().int().nonnegative(),
  mergedPRs: z.number().int().nonnegative(),
  issueToPrRatio: z.number().nullable(),
  byTypeLabel: z.record(z.string(), z.number().int()),
  issueCycleTimeHours: DistributionSchema,
  prMergeTimeHours: DistributionSchema,
  epicSubIssueCounts: z.array(z.object({
    epic: z.number().int(),
    title: z.string(),
    subIssueCount: z.number().int().nonnegative(),
  })),
  baselineRecompute: z.object({
    priorClaimedClosedIssues: z.number().int().nullable(),
    priorClaimedMergedPRs: z.number().int().nullable(),
    recomputedClosedIssues: z.number().int(),
    recomputedMergedPRs: z.number().int(),
    matchesPriorClaim: z.boolean(),
  }),
});

export const ThroughputReportSchema = DomainReportSchema.extend({
  domain: z.literal('throughput'),
  metrics: ThroughputMetricsSchema,
});

// ---------------------------------------------------------------------------
// Phase-2 schemas (same envelope; raw metrics only, never gates)
// ---------------------------------------------------------------------------

export const PlanningAccuracyMetricsSchema = z.object({
  branchNaming: z.object({
    totalMergedPRs: z.number().int().nonnegative(),
    compliant: z.number().int().nonnegative(),
    complianceRate: z.number().nullable(),
    violations: z.array(z.object({
      pr: z.number().int(),
      headRefName: z.string(),
      flowPackLabeled: z.boolean(),
    })),
  }),
  commitFormat: z.object({
    totalCommits: z.number().int().nonnegative(),
    compliant: z.number().int().nonnegative(),
    complianceRate: z.number().nullable(),
    violations: z.array(z.string()),
  }),
  epicFanOut: z.object({
    epicsChecked: z.number().int().nonnegative(),
    exactlyFive: z.number().int().nonnegative(),
    perEpic: z.array(z.object({
      epic: z.number().int(),
      title: z.string(),
      subIssueCount: z.number().int().nullable(),
    })),
  }),
  prLinkage: z.object({
    totalMergedPRs: z.number().int().nonnegative(),
    withClosingKeyword: z.number().int().nonnegative(),
    complianceRate: z.number().nullable(),
    violations: z.array(z.object({
      pr: z.number().int(),
      title: z.string(),
      flowPackLabeled: z.boolean(),
    })),
  }),
});

export const PlanningAccuracyReportSchema = DomainReportSchema.extend({
  domain: z.literal('planning-accuracy'),
  metrics: PlanningAccuracyMetricsSchema,
});

const WorkflowTallySchema = z.object({
  total: z.number().int().nonnegative(),
  success: z.number().int().nonnegative(),
  skipped: z.number().int().nonnegative(),
  cancelled: z.number().int().nonnegative(),
  failure: z.number().int().nonnegative(),
  other: z.number().int().nonnegative(),
  cancelRate: z.number().nullable(),
  avgDurationHours: z.number().nullable(),
});

export const WorkflowReliabilityMetricsSchema = z.object({
  asOf: z.string(),
  until: z.string().nullable(),
  limitPerWorkflow: z.number().int().positive(),
  possiblyTruncated: z.array(z.string()),
  raw: z.object({
    perWorkflow: z.record(z.string(), WorkflowTallySchema),
    aggregate: WorkflowTallySchema,
  }),
  windowed: z.object({
    perWorkflow: z.record(z.string(), WorkflowTallySchema),
    aggregate: WorkflowTallySchema,
  }).nullable(),
  projectSyncCancellation: z.object({
    cancelled: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
    rate: z.number().nullable(),
  }),
  // Compact per-run record kept so the second-stage signal-quality audit can
  // compute supersession without re-fetching run history (non-stationary).
  runsTimeline: z.record(z.string(), z.array(z.object({
    id: z.number().int(),
    conclusion: z.string(),
    createdAt: z.string(),
    event: z.string(),
  }))),
});

export const WorkflowReliabilityReportSchema = DomainReportSchema.extend({
  domain: z.literal('workflow-reliability'),
  metrics: WorkflowReliabilityMetricsSchema,
});

const ItemRefSchema = z.object({ number: z.number().int(), title: z.string() });

export const SignalQualityMetricsSchema = z.object({
  labelCoverage: z.object({
    fpatLookingMissingFlowPack: z.object({
      issues: z.array(ItemRefSchema),
      prs: z.array(ItemRefSchema.extend({ headRefName: z.string() })),
      issueCount: z.number().int().nonnegative(),
      prCount: z.number().int().nonnegative(),
    }),
    flowPackMissingTaxonomy: z.object({
      issues: z.array(ItemRefSchema.extend({ missing: z.array(z.string()) })),
      prs: z.array(ItemRefSchema.extend({ missing: z.array(z.string()) })),
      issueCount: z.number().int().nonnegative(),
      prCount: z.number().int().nonnegative(),
    }),
  }),
  runNoise: z.object({
    cancelledSuperseded: z.number().int().nonnegative(),
    cancelledNotSuperseded: z.number().int().nonnegative(),
    skippedSuperseded: z.number().int().nonnegative(),
    skippedNotSuperseded: z.number().int().nonnegative(),
    notSupersededExamples: z.array(z.object({
      workflow: z.string(),
      id: z.number().int(),
      event: z.string(),
      createdAt: z.string(),
      conclusion: z.string(),
    })),
  }),
  gateFalseNegatives: z.object({
    mergedBranchNamingViolations: z.number().int().nonnegative(),
    mergedLinkageViolations: z.number().int().nonnegative(),
    mainCommitFormatViolations: z.number().int().nonnegative(),
    note: z.string(),
  }),
  sources: z.object({
    planningReport: z.string(),
    reliabilityReport: z.string(),
  }),
});

export const SignalQualityReportSchema = DomainReportSchema.extend({
  domain: z.literal('signal-quality'),
  metrics: SignalQualityMetricsSchema,
});

// ---------------------------------------------------------------------------
// Domain 4 — board-consistency (Projects v2). Degraded-first: every board-derived
// block is nullable; null means "not measured" (no project access), NEVER "zero
// problems". Raw metrics only — the 40 score gate is reported, not enforced.
// ---------------------------------------------------------------------------

const BoardItemRefSchema = z.object({
  number: z.number().int().nullable(), // null for DraftIssues (no repo number)
  title: z.string(),
  kind: z.string(), // Issue | PullRequest | DraftIssue
});

export const BoardConsistencyMetricsSchema = z.object({
  access: z.object({
    tokenSource: z.enum(['gh-auth', 'env:FPAT_PROJECT_TOKEN', 'none']),
    degraded: z.boolean(),
    probeError: z.string().nullable(),
  }),
  board: z.object({
    number: z.number().int(),
    title: z.string(),
    owner: z.string(),
    visibility: z.enum(['public', 'private']),
    itemCount: z.number().int().nonnegative(),
    possiblyTruncated: z.boolean(),
    url: z.string(),
  }).nullable(),
  fields: z.object({
    present: z.array(z.string()),
    missing: z.array(z.string()),
    optionDrift: z.array(z.object({
      field: z.string(),
      missingOptions: z.array(z.string()),
    })),
  }).nullable(),
  membership: z.object({
    flowPackTotal: z.number().int().nonnegative(),
    onBoard: z.number().int().nonnegative(),
    flowPackNotOnBoard: z.array(BoardItemRefSchema),
    boardItemsNotFlowPack: z.array(BoardItemRefSchema),
  }).nullable(),
  labelFieldSync: z.object({
    itemsChecked: z.number().int().nonnegative(),
    mismatches: z.array(z.object({
      number: z.number().int(),
      dimension: z.enum(['type', 'phase', 'area']),
      label: z.string(),
      fieldValue: z.string(),
    })),
    missingFieldValues: z.array(z.object({
      number: z.number().int(),
      dimension: z.enum(['type', 'phase', 'area']),
      label: z.string(),
    })),
  }).nullable(),
  statusCoherence: z.object({
    itemsChecked: z.number().int().nonnegative(),
    closedNotDone: z.array(z.object({
      number: z.number().int(),
      title: z.string(),
      status: z.string().nullable(),
    })),
    doneButOpen: z.array(z.object({
      number: z.number().int(),
      title: z.string(),
    })),
  }).nullable(),
  scoreGate: z.object({
    epicsChecked: z.number().int().nonnegative(),
    missingScore: z.array(z.object({
      number: z.number().int().nullable(),
      title: z.string(),
    })),
    belowGateOffBacklog: z.array(z.object({
      number: z.number().int().nullable(),
      title: z.string(),
      score: z.number(),
      status: z.string().nullable(),
    })),
  }).nullable(),
});

export const BoardConsistencyReportSchema = DomainReportSchema.extend({
  domain: z.literal('board-consistency'),
  metrics: BoardConsistencyMetricsSchema,
});
