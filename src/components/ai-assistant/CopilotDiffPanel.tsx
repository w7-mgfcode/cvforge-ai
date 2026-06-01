import React, { useState } from 'react';
import { optimizeTextSection, matchJobDescription, OptimizationResult } from '@/lib/ai/copilot';
import { Sparkles, Check, AlertCircle, RefreshCw, Send } from 'lucide-react';
import { CVContent, CVDocument } from '@/schemas/cv.schema';

interface CopilotDiffPanelProps {
  documentData: CVDocument;
  onUpdateContent: (
    updatedField: 'biographicalSummary' | 'employmentTimeline',
    value: string | CVContent['employmentTimeline']
  ) => void;
}

export const CopilotDiffPanel: React.FC<CopilotDiffPanelProps> = ({ documentData, onUpdateContent }) => {
  const [mode, setMode] = useState<'optimize' | 'match'>('optimize');
  const [instruction, setInstruction] = useState('Optimize for high-credibility systems automation verbs');
  const [targetSection, setTargetSection] = useState<'summary' | 'experience'>('summary');
  
  // State for text optimization
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);

  // State for job matching
  const [jobDescription, setJobDescription] = useState('Looking for a Python Developer experienced in Model Context Protocol, FastAPI, Docker, and AWS.');
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<{ matchedSkills: string[]; missingSkills: string[]; recommendation: string } | null>(null);

  const handleOptimize = async () => {
    setLoading(true);
    setResult(null);
    try {
      const textToOptimize = targetSection === 'summary' 
        ? documentData.content.candidateIdentity.biographicalSummary 
        : documentData.content.employmentTimeline[2]?.bulletPoints[0] || ''; // Focus on job 3 first bullet
      
      const res = await optimizeTextSection(textToOptimize, instruction);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = () => {
    if (!result) return;
    if (targetSection === 'summary') {
      onUpdateContent('biographicalSummary', result.optimized);
    } else {
      // Update first bullet of third job entry (just as example)
      const updatedTimeline = [...documentData.content.employmentTimeline];
      if (updatedTimeline[2]) {
        const updatedBullets = [...updatedTimeline[2].bulletPoints];
        updatedBullets[0] = result.optimized;
        updatedTimeline[2] = { ...updatedTimeline[2], bulletPoints: updatedBullets };
        onUpdateContent('employmentTimeline', updatedTimeline);
      }
    }
    setResult(null);
  };

  const handleMatch = async () => {
    setMatchLoading(true);
    setMatchResult(null);
    try {
      // Gather all text in the CV to scan
      const cvText = JSON.stringify(documentData.content);
      const res = await matchJobDescription(cvText, jobDescription);
      setMatchResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setMatchLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-slate-200">
      {/* Tab Switcher */}
      <div className="flex bg-workspace-bg p-1 rounded-md border border-workspace-border">
        <button
          onClick={() => setMode('optimize')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-sm transition-all flex items-center justify-center space-x-1.5 ${
            mode === 'optimize' ? 'bg-workspace-card text-white border border-workspace-border' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Factual Optimizer</span>
        </button>
        <button
          onClick={() => setMode('match')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-sm transition-all flex items-center justify-center space-x-1.5 ${
            mode === 'match' ? 'bg-workspace-card text-white border border-workspace-border' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Job Match Checker</span>
        </button>
      </div>

      {/* 1. Optimize Mode UI */}
      {mode === 'optimize' && (
        <div className="bg-workspace-card/50 p-4 rounded-lg border border-workspace-border space-y-4">
          <div className="flex items-center space-x-2 border-b border-workspace-border pb-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-semibold">Language Optimization Engine</h3>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Target Section</label>
            <div className="grid grid-cols-2 gap-2 bg-workspace-bg p-1 rounded border border-workspace-border">
              <button
                onClick={() => { setTargetSection('summary'); setResult(null); }}
                className={`py-1 text-xs rounded transition-all ${
                  targetSection === 'summary' ? 'bg-workspace-card text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Profile Summary
              </button>
              <button
                onClick={() => { setTargetSection('experience'); setResult(null); }}
                className={`py-1 text-xs rounded transition-all ${
                  targetSection === 'experience' ? 'bg-workspace-card text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Timeline Bullets
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Tailoring Prompt</label>
            <input
              type="text"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              className="w-full bg-workspace-bg border border-workspace-border rounded px-3 py-2 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          <button
            onClick={handleOptimize}
            disabled={loading}
            className="w-full py-2 bg-workspace-accent hover:bg-workspace-accentHover text-xs font-semibold text-white rounded transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Factual Diff...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Optimize Content</span>
              </>
            )}
          </button>

          {/* Render Diff Results */}
          {result && (
            <div className="space-y-3 pt-3 border-t border-workspace-border/50 animate-fadeIn">
              <div className="bg-workspace-bg p-3 rounded border border-workspace-border space-y-2">
                <span className="text-[9px] font-bold uppercase text-orange-400 tracking-wider">Before / After Comparison Review</span>
                
                <div className="text-[10px] bg-slate-950 p-2.5 rounded font-mono leading-relaxed select-text overflow-y-auto max-h-[150px]">
                  {result.diffs.map((chunk, i) => {
                    if (chunk.type === 'addition') {
                      return <span key={i} className="bg-emerald-950/80 text-emerald-300 underline font-semibold px-0.5">{chunk.text}</span>;
                    }
                    if (chunk.type === 'deletion') {
                      return <span key={i} className="bg-red-950/80 text-red-400 line-through px-0.5 opacity-60">{chunk.text}</span>;
                    }
                    return <span key={i} className="text-slate-300">{chunk.text}</span>;
                  })}
                </div>

                <div className="flex items-center space-x-2 text-[9px] text-slate-400">
                  <AlertCircle className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                  <span>Factual Content Lock enabled: Job titles, metrics, and dates have been preserved.</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCommit}
                  className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-all flex items-center justify-center space-x-1 shadow"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Commit Optimization</span>
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-all border border-workspace-border"
                >
                  Discard
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Job Match Mode UI */}
      {mode === 'match' && (
        <div className="bg-workspace-card/50 p-4 rounded-lg border border-workspace-border space-y-4">
          <div className="flex items-center space-x-2 border-b border-workspace-border pb-2">
            <Send className="w-4 h-4 text-workspace-accent" />
            <h3 className="text-sm font-semibold">Job Description Key Matcher</h3>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Target Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
              className="w-full bg-workspace-bg border border-workspace-border rounded px-3 py-2 text-xs text-slate-200 focus:outline-none resize-none font-sans"
              placeholder="Paste the job posting description copy here..."
            />
          </div>

          <button
            onClick={handleMatch}
            disabled={matchLoading}
            className="w-full py-2 bg-workspace-accent hover:bg-workspace-accentHover text-xs font-semibold text-white rounded transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {matchLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Scanning Key Markers...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Audit Alignment Match</span>
              </>
            )}
          </button>

          {/* Render Job Match Results */}
          {matchResult && (
            <div className="space-y-3 pt-3 border-t border-workspace-border/50 animate-fadeIn">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-emerald-950/20 border border-emerald-900/60 p-2.5 rounded">
                  <span className="text-[8px] font-bold uppercase text-emerald-400 tracking-wider block mb-1">Matched Keywords</span>
                  {matchResult.matchedSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {matchResult.matchedSkills.map((s, idx) => (
                        <span key={idx} className="text-[8.5px] px-1.5 py-0.5 bg-emerald-900 text-emerald-200 font-semibold rounded-sm">
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[9px] text-slate-500 italic">None matched</span>
                  )}
                </div>

                <div className="bg-red-950/20 border border-red-900/60 p-2.5 rounded">
                  <span className="text-[8px] font-bold uppercase text-red-400 tracking-wider block mb-1">Missing Keywords</span>
                  {matchResult.missingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {matchResult.missingSkills.map((s, idx) => (
                        <span key={idx} className="text-[8.5px] px-1.5 py-0.5 bg-red-900 text-red-200 font-semibold rounded-sm">
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[9px] text-slate-500 italic">None missing</span>
                  )}
                </div>
              </div>

              <div className="bg-workspace-bg p-3 rounded border border-workspace-border space-y-1 text-[10px]">
                <span className="font-bold text-workspace-accent block">System Optimization Advice</span>
                <p className="text-slate-300 leading-normal font-sans">{matchResult.recommendation}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
