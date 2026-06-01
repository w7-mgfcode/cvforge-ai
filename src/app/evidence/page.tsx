import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Cpu, BookOpen, Layers, Terminal, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';

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
            ARCHITECTURAL EVIDENCE HUB
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Decoupled Document Templatization Case Study
          </h1>
          <p className="text-sm text-slate-400 font-sans leading-relaxed">
            Resumes are highly styling-sensitive, variable-length documents. Standard generators bundle styling with content, causing layout breakages. WorkflowCV Studio proves that separation of concerns solves print overflow and data integrity bugs.
          </p>
        </div>

        {/* 1. Architecture Flow Diagram (SVG) */}
        <section className="bg-workspace-card/50 p-6 rounded-xl border border-workspace-border space-y-4">
          <h2 className="text-md font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-workspace-accent" />
            <span>Decoupled Data Pipeline Architecture</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans leading-normal">
            The flow diagrams illustrate how the user&apos;s raw content feeds into Zod validations, scales styling variables, and compiles onto strict physical page bounds:
          </p>

          <div className="flex flex-col space-y-6 pt-4">
            
            {/* SVG Visual Model */}
            <div className="bg-slate-950 p-4 rounded border border-workspace-border flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] text-slate-400">
              
              {/* Block 1 */}
              <div className="p-3 border border-indigo-500/30 bg-indigo-950/10 rounded text-center w-full md:w-auto">
                <span className="text-indigo-400 font-bold block mb-1">Content (JSON)</span>
                <span>Name, Work History, Skills</span>
              </div>
              <div className="text-slate-600 font-bold text-sm select-none">&rarr;</div>

              {/* Block 2 */}
              <div className="p-3 border border-orange-500/30 bg-orange-950/10 rounded text-center w-full md:w-auto">
                <span className="text-orange-400 font-bold block mb-1">Design Tokens</span>
                <span>Padding, Colors, Fonts</span>
              </div>
              <div className="text-slate-600 font-bold text-sm select-none">&rarr;</div>

              {/* Block 3 */}
              <div className="p-3 border border-emerald-500/30 bg-emerald-950/10 rounded text-center w-full md:w-auto">
                <span className="text-emerald-400 font-bold block mb-1">Render Engine</span>
                <span>A4 Page compiler logic</span>
              </div>
              <div className="text-slate-600 font-bold text-sm select-none">&rarr;</div>

              {/* Block 4 */}
              <div className="p-3 border border-pink-500/30 bg-pink-950/10 rounded text-center w-full md:w-auto">
                <span className="text-pink-400 font-bold block mb-1">Print Driver</span>
                <span>Chromium PDF layout</span>
              </div>

            </div>

          </div>
        </section>

        {/* 2. Key Telemetry Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-workspace-card/50 p-6 rounded-xl border border-workspace-border space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Data Integrity Compliance</span>
            </h3>
            <ul className="text-xs text-slate-400 space-y-2 font-sans list-disc pl-4 leading-normal">
              <li>
                <span className="font-bold text-slate-200">Zod Contract Safety:</span> Strictly isolates input parameters, shielding the layout from missing properties.
              </li>
              <li>
                <span className="font-bold text-slate-200">Fact-Lock Safeguards:</span> AI optimization loops are bounded by system prompts that prevent hallucinated achievements or date shifts.
              </li>
            </ul>
          </div>

          <div className="bg-workspace-card/50 p-6 rounded-xl border border-workspace-border space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Print Compliance Auditing</span>
            </h3>
            <ul className="text-xs text-slate-400 space-y-2 font-sans list-disc pl-4 leading-normal">
              <li>
                <span className="font-bold text-slate-200">Visual Overflow Audits:</span> Employs runtime DOM measurements warning developers when text exceeds page limits ($1122px$ height bounds).
              </li>
              <li>
                <span className="font-bold text-slate-200">Print Override Sheets:</span> `@media print` directives automatically strip out UI components (buttons, sliders, sidebars) to compile pristine PDF sheets.
              </li>
            </ul>
          </div>

        </section>

        {/* 3. WCAG Accessibility & Standards */}
        <section className="bg-workspace-card/50 p-6 rounded-xl border border-workspace-border space-y-4">
          <h2 className="text-md font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-workspace-accent" />
            <span>WCAG 2.1 Accessibility Analytics</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            
            <div className="bg-slate-950 p-4 rounded border border-workspace-border flex items-start space-x-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-200 block">Workspace Contrast Ratio</span>
                <span className="text-slate-400 block text-[10px] mt-0.5">Slate/Indigo backdrop ensures 4.5:1 visibility.</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded border border-workspace-border flex items-start space-x-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-200 block">Document Print Contrast</span>
                <span className="text-slate-400 block text-[10px] mt-0.5">Pure black text on pure white sheet satisfies highest AAA standard.</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded border border-workspace-border flex items-start space-x-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-200 block">Responsive Viewports</span>
                <span className="text-slate-400 block text-[10px] mt-0.5">Flexible flex-grid structures maintain visual layout ratios at all zoom settings.</span>
              </div>
            </div>

          </div>
        </section>

        {/* 4. Declarative Schemas Code Snippet */}
        <section className="bg-workspace-card/50 p-6 rounded-xl border border-workspace-border space-y-4">
          <h2 className="text-md font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-workspace-accent" />
            <span>TypeScript/Zod Document Schema Contract</span>
          </h2>
          <div className="bg-slate-950 p-4 rounded border border-workspace-border">
            <pre className="text-[10px] font-mono text-slate-300 overflow-x-auto select-text leading-relaxed">
{`export const CVDocumentSchema = z.object({
  content: z.object({
    candidateIdentity: z.object({
      fullName: z.string().min(1),
      professionalHeadline: z.string().min(1),
      biographicalSummary: z.string().min(1)
    }),
    communicationChannels: z.array(ContactLinkSchema),
    skillsInventory: z.array(TechSkillItemSchema),
    employmentTimeline: z.array(ExperienceItemSchema)
  }),
  design: z.object({
    activeTemplateId: z.string(),
    typographySelection: z.string(),
    globalDensityScale: z.enum(['comfortable', 'compact']),
    colorPaletteOverrides: z.record(z.string(), z.string())
  })
});`}
            </pre>
          </div>
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
