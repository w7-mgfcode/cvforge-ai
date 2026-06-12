'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sampleCV } from '@/data/sample-cv';
import { loadDocument, saveDocument, type SaveResult } from '@/lib/storage';
import { CVDocument, CVContent, CVDesignConfig } from '@/schemas/cv.schema';
import { renderActiveTemplate } from '@/lib/template-engine';
import { LivePreviewCanvas } from '@/components/canvas/LivePreviewCanvas';
import { BaseProfileForm } from '@/components/editor/BaseProfileForm';
import { ExperienceForm } from '@/components/editor/ExperienceForm';
import { TokenControlPanel } from '@/components/design-panel/TokenControlPanel';
import { CopilotDiffPanel } from '@/components/ai-assistant/CopilotDiffPanel';
import { ParserGraphView } from '@/components/template-lab/ParserGraphView';
import { auditDocumentData } from '@/lib/print-validator';
import { 
  Layout, 
  Settings, 
  Cpu, 
  User, 
  FileText, 
  Sparkles, 
  Palette, 
  CheckCircle, 
  AlertTriangle,
  Award,
} from 'lucide-react';
import Link from 'next/link';

type CopilotUpdateField = keyof CVContent['candidateIdentity'] | 'employmentTimeline';
type CopilotUpdateValue = string | CVContent['employmentTimeline'];

// Mid-band of the researched 500ms–1s window (epic #131). Coalesces
// continuous typing into at most one storage write per window.
const AUTOSAVE_DEBOUNCE_MS = 750;

export default function StudioPage() {
  // Centralized CVDocument State
  const [cvData, setCvData] = useState<CVDocument>(sampleCV);

  // Persistence hydration flag — saves must never run before this is true
  // (a pre-hydration save would clobber a stored document with sampleCV)
  const [hydrated, setHydrated] = useState(false);

  // One-shot post-mount hydration. The page is statically pre-rendered with
  // sampleCV (output: 'export'), so storage is read only inside this effect —
  // a render-time read would cause a hydration mismatch.
  useEffect(() => {
    const result = loadDocument();
    if (result.source === 'storage') {
      setCvData(result.doc);
    }
    setHydrated(true);
  }, []);

  // Pending-save handoff to the flush path: the document waiting on the
  // debounce timer and the live timer id, so hiding the tab can persist
  // immediately without racing a duplicate write.
  const pendingDocRef = useRef<CVDocument | null>(null);
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Latest save outcome, kept for epic #133's trust surfaces to consume.
  const lastSaveResultRef = useRef<SaveResult | null>(null);

  // One skipped-newer re-hydration per conflict episode, reset by the next
  // successful save — without this guard, storage that keeps winning (e.g.
  // a poisoned future savedAt) would re-hydrate in a loop.
  const conflictRehydratedRef = useRef(false);

  // Applied to every saveDocument() result (debounce and flush paths). On
  // skipped-newer — a strictly newer write exists, e.g. from another tab —
  // re-hydrate from storage once so the newer document is never silently
  // clobbered; after the single retry, keep the local document. An
  // 'unavailable' result needs no reaction: editing stays fully functional
  // in memory and the storage module already published the save state.
  // Touches only refs and the stable setCvData, so the identity is stable
  // and the once-mounted flush listener can close over it safely.
  const handleSaveResult = useCallback((result: SaveResult) => {
    lastSaveResultRef.current = result;
    if (result.status === 'saved') {
      conflictRehydratedRef.current = false;
      return;
    }
    if (result.status === 'skipped-newer' && !conflictRehydratedRef.current) {
      conflictRehydratedRef.current = true;
      const loaded = loadDocument();
      if (loaded.source === 'storage') {
        setCvData(loaded.doc);
      }
    }
  }, []);

  // Debounced autosave: persist cvData one debounce window after the last
  // change, gated by hydration. Cleanup cancels the pending timer on every
  // cvData change and on unmount, so continuous typing coalesces into at
  // most one write per window and no write outlives the page.
  useEffect(() => {
    if (!hydrated) {
      return;
    }
    pendingDocRef.current = cvData;
    const timer = setTimeout(() => {
      pendingDocRef.current = null;
      flushTimerRef.current = null;
      handleSaveResult(saveDocument(cvData));
    }, AUTOSAVE_DEBOUNCE_MS);
    flushTimerRef.current = timer;
    return () => clearTimeout(timer);
  }, [cvData, hydrated, handleSaveResult]);

  // Flush the pending save the moment the tab is hidden or the page is
  // unloading/entering bfcache. The timer is cancelled before the write so
  // flush and debounce can never double-save. Deliberately no beforeunload
  // (unreliable, bfcache-hostile, being phased out).
  useEffect(() => {
    const flushPendingSave = () => {
      if (pendingDocRef.current === null) {
        return;
      }
      if (flushTimerRef.current !== null) {
        clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }
      const doc = pendingDocRef.current;
      pendingDocRef.current = null;
      handleSaveResult(saveDocument(doc));
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushPendingSave();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', flushPendingSave);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', flushPendingSave);
    };
  }, [handleSaveResult]);

  // Navigation States
  const [activeWorkflow, setActiveWorkflow] = useState<'editor' | 'lab' | 'hud'>('editor');
  const [editorTab, setEditorTab] = useState<'identity' | 'timeline'>('identity');
  const [drawerTab, setDrawerTab] = useState<'design' | 'ai'>('design');

  // Canvas zoom/page limits state
  const [zoom, setZoom] = useState(0.72);
  const [pageCount, setPageCount] = useState(2);

  // Spacing scales tightened callbacks
  const handleTightenDensity = () => {
    updateDesign({
      ...cvData.design,
      globalDensityScale: 'compact'
    });
  };

  const updateContent = (updatedContent: CVContent) => {
    setCvData(prev => ({
      ...prev,
      content: updatedContent,
      metadata: {
        documentRevision: prev.metadata.documentRevision + 1,
        lastModifiedTimestamp: new Date().toISOString()
      }
    }));
  };

  const updateDesign = (updatedDesign: CVDesignConfig) => {
    setCvData(prev => ({
      ...prev,
      design: updatedDesign,
      metadata: {
        documentRevision: prev.metadata.documentRevision + 1,
        lastModifiedTimestamp: new Date().toISOString()
      }
    }));
  };

  const updateField = (field: CopilotUpdateField, value: CopilotUpdateValue) => {
    setCvData(prev => {
      const newContent = { ...prev.content };
      if (field === 'biographicalSummary' || field === 'fullName' || field === 'professionalHeadline') {
        newContent.candidateIdentity = {
          ...newContent.candidateIdentity,
          [field]: value as string
        };
      } else if (field === 'employmentTimeline') {
        newContent.employmentTimeline = value as CVContent['employmentTimeline'];
      }
      return {
        ...prev,
        content: newContent,
        metadata: {
          documentRevision: prev.metadata.documentRevision + 1,
          lastModifiedTimestamp: new Date().toISOString()
        }
      };
    });
  };

  // Pre-audit reports
  const auditReport = auditDocumentData(cvData);

  return (
    <div className="h-screen w-screen bg-workspace-bg flex overflow-hidden select-none print:block print:h-auto print:w-auto print:bg-white print:overflow-visible">
      
      {/* 1. LEFT WORKFLOW NAVIGATION BAR (64px / w-16) */}
      <nav className="w-16 bg-workspace-bg border-r border-workspace-border flex flex-col justify-between items-center py-4 flex-shrink-0 z-20 print:hidden">
        <div className="flex flex-col items-center space-y-6 w-full">
          {/* Logo link */}
          <Link href="/" className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-workspace-accent transition-colors" title="Back to Home">
            <Cpu className="w-5 h-5 animate-pulse" />
          </Link>

          {/* Workflow Toggle Buttons */}
          <div className="flex flex-col space-y-3 w-full px-2">
            <button
              onClick={() => setActiveWorkflow('editor')}
              className={`p-3 rounded-lg flex flex-col items-center justify-center transition-all ${
                activeWorkflow === 'editor'
                  ? 'bg-workspace-accent text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
              title="A4 Design Studio"
            >
              <Layout className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveWorkflow('lab')}
              className={`p-3 rounded-lg flex flex-col items-center justify-center transition-all ${
                activeWorkflow === 'lab'
                  ? 'bg-workspace-accent text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
              title="Ingestion Inferences Lab"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveWorkflow('hud')}
              className={`p-3 rounded-lg flex flex-col items-center justify-center transition-all ${
                activeWorkflow === 'hud'
                  ? 'bg-workspace-accent text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
              title="Recruiter Analytics Telemetry HUD"
            >
              <Award className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User revision counter */}
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold font-mono text-slate-400">
            r{cvData.metadata.documentRevision}
          </div>
        </div>
      </nav>

      {/* 2. CENTER ACTIVE WORKFLOW LAYOUT PANEL */}
      <div className="flex-1 flex overflow-hidden print:block print:overflow-visible">
        
        {/* WORKFLOW VIEW A: STUDIO EDITOR */}
        {activeWorkflow === 'editor' && (
          <div className="flex-1 flex overflow-hidden print:block print:overflow-visible">
            
            {/* Left Inputs Section (w-[30%]) */}
            <div className="w-[320px] 2xl:w-[360px] bg-slate-900/60 border-r border-workspace-border flex flex-col flex-shrink-0 print:hidden">
              <div className="px-5 py-4 border-b border-workspace-border/50 flex justify-between items-center bg-slate-900/90">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Content Schemas</span>
                <span className="text-[9px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60">Zod Validated</span>
              </div>

              {/* Sub-tab navigation */}
              <div className="grid grid-cols-2 bg-slate-950 border-b border-workspace-border">
                <button
                  onClick={() => setEditorTab('identity')}
                  className={`py-2 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    editorTab === 'identity' ? 'text-workspace-accent border-b-2 border-workspace-accent bg-slate-900/40' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>General Profile</span>
                </button>
                <button
                  onClick={() => setEditorTab('timeline')}
                  className={`py-2 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    editorTab === 'timeline' ? 'text-workspace-accent border-b-2 border-workspace-accent bg-slate-900/40' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Timelines & Lists</span>
                </button>
              </div>

              {/* Form Render Scroll container */}
              <div className="flex-1 overflow-y-auto p-5">
                {editorTab === 'identity' ? (
                  <BaseProfileForm content={cvData.content} onChange={updateContent} />
                ) : (
                  <ExperienceForm content={cvData.content} onChange={updateContent} />
                )}
              </div>
            </div>

            {/* Middle Preview Sheet Canvas */}
            <div className="min-w-0 flex-1 bg-slate-950 flex flex-col justify-between overflow-hidden print:block print:bg-white print:overflow-visible">
              <div className="flex-1 overflow-hidden print:block print:overflow-visible">
                <LivePreviewCanvas
                  documentData={cvData}
                  zoom={zoom}
                  setZoom={setZoom}
                  pageCount={pageCount}
                  setPageCount={setPageCount}
                  renderTemplate={renderActiveTemplate}
                  onTightenDensity={handleTightenDensity}
                />
              </div>

              {/* Native Print command trigger footer (hidden in print) */}
              <div className="px-6 py-3 border-t border-workspace-border bg-workspace-card/90 flex justify-between items-center print:hidden">
                <div className="flex items-center space-x-4 text-[10px] font-mono text-slate-500">
                  <span>DPI Target: 96 DPI</span>
                  <span>Dimensions: 210mm x 297mm</span>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold shadow-md hover:shadow-emerald-950/20 transition-all"
                >
                  Compile & Export PDF
                </button>
              </div>
            </div>

            {/* Right Tools Drawer Sidebar (w-[26%]) */}
            <div className="w-[300px] 2xl:w-[340px] bg-slate-900/60 border-l border-workspace-border flex flex-col flex-shrink-0 print:hidden">
              <div className="px-5 py-4 border-b border-workspace-border/50 flex justify-between items-center bg-slate-900/90">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Design & Inference</span>
                <span className="text-[9px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60">Declarative</span>
              </div>

              {/* Tab toggles */}
              <div className="grid grid-cols-2 bg-slate-950 border-b border-workspace-border">
                <button
                  onClick={() => setDrawerTab('design')}
                  className={`py-2 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    drawerTab === 'design' ? 'text-workspace-accent border-b-2 border-workspace-accent bg-slate-900/40' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Design System</span>
                </button>
                <button
                  onClick={() => setDrawerTab('ai')}
                  className={`py-2 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    drawerTab === 'ai' ? 'text-workspace-accent border-b-2 border-workspace-accent bg-slate-900/40' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Copilot</span>
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-5">
                {drawerTab === 'design' ? (
                  <TokenControlPanel design={cvData.design} onChange={updateDesign} />
                ) : (
                  <CopilotDiffPanel documentData={cvData} onUpdateContent={updateField} />
                )}
              </div>
            </div>

          </div>
        )}

        {/* WORKFLOW VIEW B: TEMPLATIZATION LAB */}
        {activeWorkflow === 'lab' && (
          <div className="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto print:hidden">
            <ParserGraphView documentData={cvData} />
          </div>
        )}

        {/* WORKFLOW VIEW C: RECRUITER ANALYTICS Telemetry HUD */}
        {activeWorkflow === 'hud' && (
          <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto space-y-6 print:hidden">
            <div className="bg-workspace-card border border-workspace-border rounded-xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
              <div className="border-b border-workspace-border pb-4 mb-4">
                <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Award className="w-5 h-5 text-workspace-accent" />
                  <span>Architectural Telemetry Analytics HUD</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 leading-normal font-sans">
                  This interface provides an explainable verification layer showing how CVForge AI solves styling overflows and schema validations.
                </p>
              </div>

              {/* Grid HUD Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-workspace-bg p-4 rounded border border-workspace-border">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Framework Core</span>
                  <span className="text-xs font-bold text-slate-200 mt-1 block">Next.js static export</span>
                </div>
                <div className="bg-workspace-bg p-4 rounded border border-workspace-border">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">State Isolation</span>
                  <span className="text-xs font-bold text-slate-200 mt-1 block">Decoupled layers</span>
                </div>
                <div className="bg-workspace-bg p-4 rounded border border-workspace-border">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Validation Engine</span>
                  <span className="text-xs font-bold text-slate-200 mt-1 block flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-1.5 flex-shrink-0" />
                    <span>100% Zod Compliant</span>
                  </span>
                </div>
                <div className="bg-workspace-bg p-4 rounded border border-workspace-border">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Contrast Compliance</span>
                  <span className="text-xs font-bold text-slate-200 mt-1 block flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-1.5 flex-shrink-0" />
                    <span>Pass (WCAG AA)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Static Auditing Report */}
            <div className="bg-workspace-card border border-workspace-border rounded-xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-semibold text-slate-300">Active Document Audit Inspection</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded border border-workspace-border text-center">
                  <span className="text-2xl font-mono font-extrabold text-slate-200">{auditReport.metrics.totalCharCount}</span>
                  <span className="text-[9px] text-slate-500 uppercase block tracking-wider mt-1 font-semibold">Total Character Load</span>
                </div>
                <div className="bg-slate-950 p-4 rounded border border-workspace-border text-center">
                  <span className="text-2xl font-mono font-extrabold text-slate-200">{auditReport.metrics.skillDensity}</span>
                  <span className="text-[9px] text-slate-500 uppercase block tracking-wider mt-1 font-semibold">Skills Logged</span>
                </div>
                <div className="bg-slate-950 p-4 rounded border border-workspace-border text-center">
                  <span className="text-2xl font-mono font-extrabold text-slate-200">{auditReport.metrics.timelineBreadth}</span>
                  <span className="text-[9px] text-slate-500 uppercase block tracking-wider mt-1 font-semibold">Work Milestones</span>
                </div>
              </div>

              {/* Output Warnings List */}
              <div className="bg-workspace-bg p-4 rounded border border-workspace-border space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block border-b border-workspace-border pb-1.5">
                  Compilation Warning Logs ({auditReport.warnings.length})
                </span>
                
                {auditReport.warnings.length > 0 ? (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {auditReport.warnings.map((warn, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-yellow-300 bg-yellow-950/20 border border-yellow-900/60 p-2.5 rounded">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="font-sans leading-normal">{warn}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-900/60 p-2.5 rounded">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>No layout warnings detected. Layout metrics are perfectly balanced.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
