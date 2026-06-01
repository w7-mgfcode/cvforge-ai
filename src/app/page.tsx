import React from 'react';
import Link from 'next/link';
import { ArrowRight, Cpu, Eye, Sparkles, Layers, Sliders, CheckSquare, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-workspace-bg text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Decorative Blur Vectors */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex justify-between items-center z-10 border-b border-workspace-border/40">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-workspace-accent animate-pulse" />
          <span className="text-sm font-bold tracking-widest text-slate-100 font-mono">CVFORGE // AI</span>
        </div>
        <div className="flex items-center space-x-6 text-xs font-semibold text-slate-400">
          <Link href="/evidence" className="hover:text-slate-200 transition-colors">
            Architectural HUD
          </Link>
          <a 
            href="https://github.com/w7-mgfcode" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-slate-200 transition-colors"
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Main Hero Showcase */}
      <main className="max-w-7xl w-full mx-auto px-6 py-12 flex-1 flex flex-col items-center justify-center z-10 relative">
        
        {/* Subtle Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700/60 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-[10px] font-bold text-slate-300 font-mono tracking-wider">A4 PRINT-BOUNDED GENERATION PIPELINE</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-center tracking-tight max-w-4xl text-white">
          Structured Document <span className="bg-gradient-to-r from-workspace-accent to-orange-500 bg-clip-text text-transparent">Templatization</span>
        </h1>
        <p className="text-sm md:text-md text-slate-400 text-center max-w-2xl mt-4 leading-relaxed font-sans">
          Stop writing custom CSS overrides for resume sections. Decouple career summaries into structured content layers, global design swatches, and pixel-accurate print compilation.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full max-w-md">
          <Link
            href="/studio"
            className="w-full sm:w-auto px-6 py-3 bg-workspace-accent hover:bg-workspace-accentHover text-sm font-semibold text-white rounded shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 group"
          >
            <span>Enter AI Design Studio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/evidence"
            className="w-full sm:w-auto px-6 py-3 bg-workspace-card border border-workspace-border hover:bg-slate-800 text-sm font-semibold text-slate-200 hover:text-white rounded transition-all flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4 text-slate-400" />
            <span>Review Architecture HUD</span>
          </Link>
        </div>

        {/* Visual Pipeline Showcase */}
        <div className="mt-16 w-full max-w-5xl bg-workspace-card/50 rounded-xl border border-workspace-border p-6 shadow-2xl relative">
          <div className="absolute top-3 left-4 flex space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <div className="absolute top-3 right-4 font-mono text-[9px] text-slate-500 font-semibold">
            pipeline_visualizer.sh
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
            
            {/* Step 1 */}
            <div className="p-4 rounded border border-workspace-border bg-workspace-bg flex flex-col justify-between hover:border-slate-600 transition-all">
              <div>
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center mb-3">
                  <span className="text-xs font-bold text-slate-300 font-mono">01</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">Legacy Parser</h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Ingests unstructured, ambiguous text strings or resume documents.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-workspace-border/50 text-[9px] font-mono text-slate-500">
                INPUT: raw_text.txt
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded border border-workspace-border bg-workspace-bg flex flex-col justify-between hover:border-slate-600 transition-all">
              <div>
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center mb-3">
                  <span className="text-xs font-bold text-workspace-accent font-mono">02</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center">
                  <Layers className="w-3.5 h-3.5 text-workspace-accent mr-1.5" />
                  <span>Zod Schema</span>
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Validates properties mapping entries to structured JSON nodes.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-workspace-border/50 text-[9px] font-mono text-workspace-accent font-semibold">
                STATUS: verified.json
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded border border-workspace-border bg-workspace-bg flex flex-col justify-between hover:border-slate-600 transition-all">
              <div>
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center mb-3">
                  <span className="text-xs font-bold text-orange-500 font-mono">03</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center">
                  <Sliders className="w-3.5 h-3.5 text-orange-500 mr-1.5" />
                  <span>Tokens Map</span>
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Binds properties to CSS custom variables, fonts, and grid scales.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-workspace-border/50 text-[9px] font-mono text-orange-400 font-semibold">
                TOKENS: DESIGN.md
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded border border-workspace-border bg-workspace-bg flex flex-col justify-between hover:border-slate-600 transition-all">
              <div>
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center mb-3">
                  <span className="text-xs font-bold text-emerald-500 font-mono">04</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
                  <span>A4 Print</span>
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Compiles data structures to strict-sized, print-accurate templates.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-workspace-border/50 text-[9px] font-mono text-emerald-400 font-semibold flex items-center">
                <Zap className="w-3 h-3 text-emerald-500 mr-1 animate-pulse" />
                <span>EXPORT READY</span>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-6 text-center z-10 border-t border-workspace-border/20">
        <p className="text-[10px] text-slate-500 font-mono">
          &copy; 2026 CVFORGE AI - PRODUCTION FRONTEND PIPELINE ENGINE. LICENSED UNDER REPOSITORY-LEVEL STANDARDS.
        </p>
      </footer>
    </div>
  );
}
