// scripts/fpat/eval/lib/scorecard.mjs
// FPAT Umbrella 2 — versioned scorecard schema modeling the frozen cycle-0
// baseline manifest (docs/reports/2026-06-11/baseline-manifest.json) as-is.
// Raw data contract only — no thresholds, no gates. The manifest reuses the
// DomainReportSchema envelope but its metric sub-blocks each carry their own
// `source`; this module models that frozen artifact shape — never edit the
// frozen manifest to fit the schema.
//
// Null/absent on a measured block means "not measured at baseline", NEVER
// "zero problems" (same degraded-first convention as schema.mjs).
//
// schemaVersion bump rules + catalog lock-step contract:
// scripts/fpat/eval/metric-catalog.md ("Versioning & lock-step contract").
// Any change to this module updates the catalog in the same change.
import { z } from 'zod';

import { DistributionSchema, DomainReportSchema } from './schema.mjs';

export const SCORECARD_SCHEMA_VERSION = '1.0.0';

// "Absent/null = not measured" convention for measured blocks.
const notMeasured = (schema) => schema.nullish();

// --- per-block schemas (each frozen metric block carries its own `source`) ---

export const OfficialBaselineSchema = z.object({
  closedFlowPackIssues: z.number().int().nonnegative(),
  mergedFlowPackPRs: z.number().int().nonnegative(),
  // Legitimately exceeds 1 (frozen cycle-0 value: 1.57) — unbounded ratio.
  issueToPrRatio: z.number().nullable(),
  byTypeLabel: z.record(z.string(), z.number().int().nonnegative()),
  asOf: z.string(),
  status: z.string(),
  source: z.string(),
});

export const HistoricalEnvelopeSchema = z.object({
  closedIssuesAllLabels: z.number().int().nonnegative(),
  mergedPRsAllLabels: z.number().int().nonnegative(),
  matchesOfficialBaseline: z.boolean(),
  status: z.string(),
  source: z.string(),
});

export const CycleTimesSchema = z.object({
  issueCycleTimeHours: DistributionSchema,
  prMergeTimeHours: DistributionSchema,
  source: z.string(),
});

export const FrozenPlanningAccuracySchema = z.object({
  asOf: z.string(),
  branchNaming: z.object({
    totalMergedPRs: z.number().int().nonnegative(),
    compliant: z.number().int().nonnegative(),
    complianceRate: z.number().min(0).max(1).nullable(),
    violationPRs: z.array(z.number().int().positive()),
  }),
  commitFormat: z.object({
    totalCommits: z.number().int().nonnegative(),
    compliant: z.number().int().nonnegative(),
    complianceRate: z.number().min(0).max(1).nullable(),
    caveat: z.string(), // ERA-MIXED qualifier travels with the value
  }),
  epicFanOut: z.object({
    epicsChecked: z.number().int().nonnegative(),
    exactlyFive: z.number().int().nonnegative(),
    perEpic: z.array(z.object({
      epic: z.number().int().positive(),
      subIssueCount: z.number().int().nonnegative().nullable(),
    })),
  }),
  prLinkage: z.object({
    totalMergedPRs: z.number().int().nonnegative(),
    withClosingKeyword: z.number().int().nonnegative(),
    complianceRate: z.number().min(0).max(1).nullable(),
    violationPRs: z.array(z.number().int().positive()),
  }),
  source: z.string(),
});

// Frozen tallies are a snapshot subset of schema.mjs WorkflowTallySchema
// (no `other` / `avgDurationHours` in the manifest) — modeled as frozen.
export const FrozenWorkflowTallySchema = z.object({
  total: z.number().int().nonnegative(),
  success: z.number().int().nonnegative(),
  skipped: z.number().int().nonnegative(),
  cancelled: z.number().int().nonnegative(),
  failure: z.number().int().nonnegative(),
  cancelRate: z.number().min(0).max(1).nullable(),
});

export const FrozenWorkflowReliabilitySchema = z.object({
  asOf: z.string(),
  until: z.string().nullable(),
  rawAggregate: FrozenWorkflowTallySchema,
  windowedAggregate: FrozenWorkflowTallySchema.nullable(),
  perWorkflowRaw: z.record(z.string(), FrozenWorkflowTallySchema),
  projectSyncCancellation: z.object({
    cancelled: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
    rate: z.number().min(0).max(1).nullable(),
  }),
  caveat: z.string(), // NON-STATIONARY qualifier travels with the values
  source: z.string(),
});

export const FrozenSignalQualitySchema = z.object({
  asOf: z.string(),
  labelCoverage: z.object({
    fpatLookingMissingFlowPack: z.object({
      issueCount: z.number().int().nonnegative(),
      prCount: z.number().int().nonnegative(),
      issueNumbers: z.array(z.number().int().positive()),
      prNumbers: z.array(z.number().int().positive()),
      caveat: z.string(), // HEURISTIC qualifier travels with the candidates
    }),
    flowPackMissingTaxonomy: z.object({
      issueCount: z.number().int().nonnegative(),
      prCount: z.number().int().nonnegative(),
      issueNumbers: z.array(z.number().int().positive()),
    }),
  }),
  runNoise: z.object({
    cancelledSuperseded: z.number().int().nonnegative(),
    cancelledNotSuperseded: z.number().int().nonnegative(),
    skippedSuperseded: z.number().int().nonnegative(),
    skippedNotSuperseded: z.number().int().nonnegative(),
  }),
  gateFalseNegatives: z.object({
    mergedBranchNamingViolations: z.number().int().nonnegative(),
    mergedLinkageViolations: z.number().int().nonnegative(),
    mainCommitFormatViolations: z.number().int().nonnegative(),
  }),
  source: z.string(),
});

// Board-derived sub-blocks are individually nullable (degraded-first, same as
// schema.mjs BoardConsistencyMetricsSchema): null = no project access at
// freeze time, not a clean board.
export const FrozenBoardConsistencySchema = z.object({
  asOf: z.string(),
  access: z.object({
    tokenSource: z.enum(['gh-auth', 'env:FPAT_PROJECT_TOKEN', 'none']),
    degraded: z.boolean(),
    probeError: z.string().nullable(),
  }),
  board: notMeasured(z.object({
    number: z.number().int().positive(),
    title: z.string(),
    itemCount: z.number().int().nonnegative(),
  })),
  fields: notMeasured(z.object({
    missingCount: z.number().int().nonnegative(),
    optionDriftCount: z.number().int().nonnegative(),
  })),
  membership: notMeasured(z.object({
    flowPackTotal: z.number().int().nonnegative(),
    onBoard: z.number().int().nonnegative(),
    flowPackNotOnBoard: z.array(z.object({
      number: z.number().int().positive().nullable(), // null for DraftIssues
      kind: z.string(),
    })),
    boardItemsNotFlowPackCount: z.number().int().nonnegative(),
  })),
  labelFieldSync: notMeasured(z.object({
    itemsChecked: z.number().int().nonnegative(),
    mismatchCount: z.number().int().nonnegative(),
    missingFieldValueCount: z.number().int().nonnegative(),
    caveat: z.string(), // item-kind split not measured at cycle-0 (#72)
  })),
  statusCoherence: notMeasured(z.object({
    itemsChecked: z.number().int().nonnegative(),
    closedNotDoneCount: z.number().int().nonnegative(),
    doneButOpenCount: z.number().int().nonnegative(),
    caveat: z.string(), // closed-not-Done is legal one-directional sync
  })),
  scoreGate: notMeasured(z.object({
    epicsChecked: z.number().int().nonnegative(),
    missingScoreEpics: z.array(z.number().int().positive()),
    belowGateOffBacklogCount: z.number().int().nonnegative(),
  })),
  source: z.string(),
});

// --- decision & rule blocks (recorded decisions, not audit outputs) ---

export const LabelGapDecisionsSchema = z.object({
  decision: z.string(),
  decidedOn: z.string(),
  detail: z.object({
    historicalGapPRs: z.array(z.number().int().positive()),
    disposableFixtureIssues: z.array(z.number().int().positive()),
    areaTaxonomyDrift: z.string(),
  }),
  effect: z.string(),
  refs: z.array(z.string()),
});

export const ParkedDecisionSchema = z.object({
  id: z.string(),
  status: z.string(),
  frozenBeforeValue: z.object({
    metric: z.string(),
    // Heterogeneous by construction (a count, a list of epics, a list of PRs).
    value: z.unknown(),
  }),
  rule: z.string(),
});

// --- scorecard metrics + envelope ---

export const ScorecardMetricsSchema = z.object({
  // The only benchmark baseline — always present on a scorecard.
  officialBaseline: OfficialBaselineSchema,
  historicalEnvelope: notMeasured(HistoricalEnvelopeSchema),
  cycleTimes: notMeasured(CycleTimesSchema),
  planningAccuracy: notMeasured(FrozenPlanningAccuracySchema),
  workflowReliability: notMeasured(FrozenWorkflowReliabilitySchema),
  signalQuality: notMeasured(FrozenSignalQualitySchema),
  boardConsistency: notMeasured(FrozenBoardConsistencySchema),
  labelGapDecisions: notMeasured(LabelGapDecisionsSchema),
  parkedDecisions: notMeasured(z.array(ParkedDecisionSchema)),
  // Comparison discipline always travels with a scorecard.
  comparisonRules: z.array(z.string()),
});

export const ScorecardSchema = DomainReportSchema.extend({
  domain: z.literal('baseline-manifest'),
  schemaVersion: z.literal(SCORECARD_SCHEMA_VERSION),
  metrics: ScorecardMetricsSchema,
});
