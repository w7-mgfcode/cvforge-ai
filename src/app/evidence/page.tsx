import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ClipboardCheck,
  Cpu,
  Download,
  HardDrive,
  Layers,
  Printer,
  Save,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

/**
 * Static product-evidence page. Every claim here is backed by code in this
 * repository or a recorded report under docs/reports/ — keep it that way:
 * persistence is local to the browser (no server, no cloud, no accounts),
 * the copilot is simulated, and delivery-process evidence stays a footnote.
 */

const SAFETY_CONTRACT = [
  {
    title: 'Versioned envelope',
    body: 'The document is stored wrapped in { schemaVersion: 1, savedAt, doc } — the envelope versions independently of the CV schema, so persistence can evolve without touching CVDocumentSchema.',
  },
  {
    title: 'Fail-safe loading',
    body: 'Missing key, invalid JSON, wrong envelope shape or version, or a schema-invalid document all resolve to the sample-CV fallback without throwing. No stored payload can crash the studio.',
  },
  {
    title: 'No silent data destruction',
    body: 'A payload that fails validation is preserved verbatim under a backup key before the fallback renders. A merely missing key writes no backup.',
  },
  {
    title: 'Last-write-wins guard',
    body: 'Every write stamps a fresh ISO-8601 savedAt; a write is refused (skipped-newer) when storage already holds a strictly newer one — e.g. written by another tab — and the studio re-hydrates once so the newer document is never shadowed.',
  },
  {
    title: 'Honest degradation',
    body: 'A one-time write/remove probe detects blocked or zero-quota storage (e.g. private browsing). The module flips into flagged no-op mode, a warning states changes are memory-only, and editing keeps working.',
  },
  {
    title: 'One subscription seam',
    body: 'UI save-status surfaces bind exclusively to subscribeSaveState(), which replays the current state synchronously on subscribe. No component reaches into persistence internals.',
  },
];

const GATE_STEPS = [
  {
    step: 'Fresh profile',
    proof: 'Empty storage hydrates the sample CV; a v1 envelope is written; no backup key appears.',
  },
  {
    step: 'Edit → reload',
    proof: 'Identity and timeline edits survive a full page reload, both in the stored envelope and in the rendered page.',
  },
  {
    step: 'Export → reset → import',
    proof: 'The exported JSON, re-imported after a reset, restores a deep-equal document — content, design, and metadata.',
  },
  {
    step: 'Corrupt payload',
    proof: 'A truncated stored payload causes no crash: sample fallback renders, the original bytes are preserved under the backup key, console stays clean.',
  },
  {
    step: 'Print ×3 templates',
    proof: 'Print-to-PDF of the persisted document on all three templates: single A4 page, résumé content only, zero workspace chrome.',
  },
];

export default function EvidencePage() {
  return (
    <div className="min-h-screen bg-workspace-bg text-slate-100 flex flex-col justify-between select-none">

      {/* Header */}
      <header className="max-w-6xl w-full mx-auto px-6 py-6 flex justify-between items-center border-b border-workspace-border/40">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-workspace-accent animate-pulse" />
          <span className="text-sm font-bold tracking-widest text-slate-100 font-mono">CVFORGE // CASE STUDY</span>
        </div>
        <Link
          href="/studio"
          className="text-xs font-semibold px-4 py-2 bg-workspace-accent hover:bg-workspace-accentHover text-white rounded transition-all flex items-center space-x-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Studio</span>
        </Link>
      </header>

      {/* Main Body */}
      <main className="max-w-4xl w-full mx-auto px-6 py-12 flex-1 space-y-12">

        {/* Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 bg-slate-800 rounded border border-slate-700/60 text-workspace-accent text-[10px] font-bold font-mono tracking-wider">
            PRODUCT EVIDENCE HUB
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Schema-Driven, Print-Safe, Persistent CV Workspaces
          </h1>
          <p className="text-sm text-slate-400 font-sans leading-relaxed">
            Résumés are styling-sensitive, variable-length documents. WorkflowCV Studio decouples content, design tokens, and rendering against strict A4 page bounds — and now persists the whole workspace in the browser through a versioned, fail-safe storage contract, with release-gate evidence behind it. The app is statically exported: there is no server, no account, and no cloud sync. Persistence is local to your browser.
          </p>
        </div>

        {/* 1. Architecture Flow Diagram */}
        <section className="bg-workspace-card/50 p-6 rounded-xl border border-workspace-border space-y-4">
          <h2 className="text-md font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-workspace-accent" />
            <span>Decoupled Data Pipeline Architecture</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans leading-normal">
            User content feeds a Zod-validated document, design tokens scale styling declaratively, and the render engine compiles onto strict physical page bounds:
          </p>

          <div className="bg-slate-950 p-4 rounded border border-workspace-border flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] text-slate-400">
            <div className="p-3 border border-indigo-500/30 bg-indigo-950/10 rounded text-center w-full md:w-auto">
              <span className="text-indigo-400 font-bold block mb-1">Content (JSON)</span>
              <span>Name, Work History, Skills</span>
            </div>
            <div className="text-slate-600 font-bold text-sm select-none">&rarr;</div>
            <div className="p-3 border border-orange-500/30 bg-orange-950/10 rounded text-center w-full md:w-auto">
              <span className="text-orange-400 font-bold block mb-1">Design Tokens</span>
              <span>Padding, Colors, Fonts</span>
            </div>
            <div className="text-slate-600 font-bold text-sm select-none">&rarr;</div>
            <div className="p-3 border border-emerald-500/30 bg-emerald-950/10 rounded text-center w-full md:w-auto">
              <span className="text-emerald-400 font-bold block mb-1">Render Engine</span>
              <span>A4 Page compiler logic</span>
            </div>
            <div className="text-slate-600 font-bold text-sm select-none">&rarr;</div>
            <div className="p-3 border border-pink-500/30 bg-pink-950/10 rounded text-center w-full md:w-auto">
              <span className="text-pink-400 font-bold block mb-1">Print Driver</span>
              <span>Chromium PDF layout</span>
            </div>
          </div>

          {/* Persistence loop strip */}
          <div className="bg-slate-950 p-4 rounded border border-workspace-border flex flex-col md:flex-row items-center justify-center gap-4 font-mono text-[10px] text-slate-400">
            <div className="p-3 border border-sky-500/30 bg-sky-950/10 rounded text-center w-full md:w-auto">
              <span className="text-sky-400 font-bold block mb-1">localStorage Envelope</span>
              <span>{'{ schemaVersion: 1, savedAt, doc }'}</span>
            </div>
            <div className="text-slate-600 font-bold text-sm select-none">&harr;</div>
            <div className="p-3 border border-indigo-500/30 bg-indigo-950/10 rounded text-center w-full md:w-auto">
              <span className="text-indigo-400 font-bold block mb-1">CVDocument State</span>
              <span>Studio in-memory document</span>
            </div>
            <div className="text-slate-600 font-bold text-sm select-none">&harr;</div>
            <div className="p-3 border border-emerald-500/30 bg-emerald-950/10 rounded text-center w-full md:w-auto">
              <span className="text-emerald-400 font-bold block mb-1">JSON Export File</span>
              <span>Same v1 envelope, re-importable</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            The render pipeline stays one-way; the persistence loop sits beside it. Export and autosave build the envelope at one shared construction site, so an exported file is always re-parseable by the load path.
          </p>
        </section>

        {/* 2. Persistent Workspace Evidence */}
        <section className="bg-workspace-card/50 p-6 rounded-xl border border-workspace-border space-y-4">
          <h2 className="text-md font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <HardDrive className="w-4 h-4 text-workspace-accent" />
            <span>Persistent Workspace Evidence</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans leading-normal">
            Each behavior below is verified in a real browser with recorded expected-vs-actual evidence (<span className="font-mono text-[10px]">docs/reports/2026-06-12/</span>):
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            <div className="bg-slate-950 p-4 rounded border border-workspace-border space-y-2">
              <h3 className="font-bold text-slate-200 flex items-center space-x-1.5">
                <Save className="w-3.5 h-3.5 text-emerald-500" />
                <span>Autosave</span>
              </h3>
              <ul className="text-slate-400 space-y-1.5 list-disc pl-4 leading-normal">
                <li>Hydrates once post-mount; saves are gated so a pre-hydration write can never clobber a stored document with the sample.</li>
                <li>750&nbsp;ms debounce coalesces continuous typing into at most one write per window — proven with a 21-keystroke type-storm.</li>
                <li>Pending saves flush the moment the tab is hidden (<span className="font-mono text-[10px]">visibilitychange</span>) or the page unloads (<span className="font-mono text-[10px]">pagehide</span>) — deliberately no <span className="font-mono text-[10px]">beforeunload</span>.</li>
                <li>Edits survive a full reload, including a hide-flush inside the debounce window.</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded border border-workspace-border space-y-2">
              <h3 className="font-bold text-slate-200 flex items-center space-x-1.5">
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                <span>JSON Round-Trip</span>
              </h3>
              <ul className="text-slate-400 space-y-1.5 list-disc pl-4 leading-normal">
                <li>Export downloads the document in the same v1 envelope; export → reset → import restores a deep-equal document.</li>
                <li>Import replaces the whole document only after an explicit confirmation; cancel and failure leave it untouched.</li>
                <li>Invalid files surface as typed inline errors — invalid JSON, wrong version, wrong envelope shape, schema-invalid document, unreadable file — each with the first failing field path.</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded border border-workspace-border space-y-2">
              <h3 className="font-bold text-slate-200 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Trust Surfaces</span>
              </h3>
              <ul className="text-slate-400 space-y-1.5 list-disc pl-4 leading-normal">
                <li>A save-state badge tracks the full lifecycle: idle, saving, saved, error, unavailable.</li>
                <li>A confirm-gated reset-to-sample escape hatch clears both storage keys and restores the sample document.</li>
                <li>When storage is unusable, a persistent non-blocking banner states changes are kept in memory only — the studio keeps working.</li>
              </ul>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 font-mono">
            Scope: one document per browser profile, persisted locally. No accounts, no cloud storage, no cross-device or live multi-tab sync, no revision history — the savedAt guard prevents silent overwrites between tabs, nothing more.
          </p>
        </section>

        {/* 3. Storage Safety Contract */}
        <section className="bg-workspace-card/50 p-6 rounded-xl border border-workspace-border space-y-4">
          <h2 className="text-md font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-workspace-accent" />
            <span>Storage Safety Contract</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans leading-normal">
            The persistence module (<span className="font-mono text-[10px]">src/lib/storage.ts</span>) never throws into the UI. Its failure taxonomy was exercised case-by-case against the real module in a real browser:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            {SAFETY_CONTRACT.map((item) => (
              <div key={item.title} className="bg-slate-950 p-4 rounded border border-workspace-border flex items-start space-x-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-200 block">{item.title}</span>
                  <span className="text-slate-400 block text-[11px] mt-0.5 leading-normal">{item.body}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Release Gate Proof */}
        <section className="bg-workspace-card/50 p-6 rounded-xl border border-workspace-border space-y-4">
          <h2 className="text-md font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <ClipboardCheck className="w-4 h-4 text-workspace-accent" />
            <span>Release Gate Proof</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans leading-normal">
            Before the persistence capability was declared done, a five-step gate scenario ran in one continuous real-browser session against the final build — verdict: <span className="font-bold text-emerald-400">PASSED</span> (<span className="font-mono text-[10px]">docs/reports/2026-06-12/persistence-release-gate.md</span>):
          </p>
          <div className="bg-slate-950 rounded border border-workspace-border divide-y divide-workspace-border/60">
            {GATE_STEPS.map((row, i) => (
              <div key={row.step} className="flex items-start space-x-3 p-3 text-xs font-sans">
                <span className="font-mono text-[10px] text-slate-600 font-bold mt-0.5 flex-shrink-0 w-4 text-right">{i + 1}</span>
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="font-bold text-slate-200 block">{row.step}</span>
                  <span className="text-slate-400 block text-[11px] mt-0.5 leading-normal">{row.proof}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Print Compliance */}
        <section className="bg-workspace-card/50 p-6 rounded-xl border border-workspace-border space-y-4">
          <h2 className="text-md font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Printer className="w-4 h-4 text-workspace-accent" />
            <span>Print Compliance Auditing</span>
          </h2>
          <ul className="text-xs text-slate-400 space-y-2 font-sans list-disc pl-4 leading-normal">
            <li>
              <span className="font-bold text-slate-200">Visual Overflow Audits:</span> runtime DOM measurements warn when rendered content exceeds the physical page bounds (1122px height per A4 page at 96 DPI), backed by static content-length heuristics.
            </li>
            <li>
              <span className="font-bold text-slate-200">Print Override Sheets:</span> <span className="font-mono text-[10px]">@media print</span> directives strip all workspace UI (buttons, sidebars, navigation) so the printed sheet contains the résumé only — pure black text on a pure white page.
            </li>
            <li>
              <span className="font-bold text-slate-200">Persistence Chrome Audit:</span> every persistence element — save badge, export/import controls, open reset confirm, visible storage warning, inline import error — carries <span className="font-mono text-[10px]">print:hidden</span>. Audited in the worst-case maximum-chrome state across all three templates: zero leaks into the printed PDF.
            </li>
            <li>
              <span className="font-bold text-slate-200">A4 Re-Verification:</span> after the persistence work landed, the persisted document was re-checked per template (Dossier, ATS, Visual) — compliance HUD clean, print-to-PDF within a single A4 page.
            </li>
          </ul>
        </section>

        {/* 6. Schema + Envelope Contract */}
        <section className="bg-workspace-card/50 p-6 rounded-xl border border-workspace-border space-y-4">
          <h2 className="text-md font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-workspace-accent" />
            <span>TypeScript/Zod Document &amp; Storage Contract</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans leading-normal">
            The storage envelope wraps the document without changing the document contract — <span className="font-mono text-[10px]">CVDocumentSchema</span> stayed untouched by the persistence work:
          </p>
          <div className="bg-slate-950 p-4 rounded border border-workspace-border">
            <pre className="text-[10px] font-mono text-slate-300 overflow-x-auto select-text leading-relaxed">
{`// src/schemas/cv.schema.ts — the document contract (unchanged)
export const CVDocumentSchema = z.object({
  content: CVContentSchema,      // identity, contact channels, skills,
                                 // employment timeline, projects, credentials
  design: CVDesignConfigSchema,  // template, typography, density, colors
  metadata: z.object({
    documentRevision: z.number(),
    lastModifiedTimestamp: z.string()
  })
});

// src/lib/storage.ts — persistence wraps it in a versioned envelope
export interface StorageEnvelope {
  schemaVersion: number;  // envelope shape version, currently 1
  savedAt: string;        // ISO-8601 — drives the last-write-wins guard
  doc: CVDocument;        // validated with CVDocumentSchema on every load
}

export const EnvelopeShellSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  savedAt: z.string(),
  doc: z.unknown()        // inner document validated separately
});`}
            </pre>
          </div>
        </section>

        {/* 7. Delivery evidence footnote */}
        <section className="bg-workspace-card/50 p-6 rounded-xl border border-workspace-border space-y-3">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <BookOpen className="w-4 h-4 text-workspace-accent" />
            <span>Delivery Evidence</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans leading-normal">
            The capabilities above shipped through an internal, issue-gated delivery workflow with its own measurement system: a frozen baseline manifest, an identically-instrumented follow-up readout (deltas reported as data — no improvement verdicts are drawn from a single comparison), and an automated rollup gate verifying every closure. That material documents delivery discipline, not product features; it lives under <span className="font-mono text-[10px]">docs/reports/</span>.
          </p>
        </section>

      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto px-6 py-6 text-center border-t border-workspace-border/20">
        <p className="text-[10px] text-slate-500 font-mono">
          &copy; 2026 CVFORGE AI - PRODUCTION WEB APPLICATION PORTFOLIO AND TELEMETRY HUD.
        </p>
      </footer>
    </div>
  );
}
