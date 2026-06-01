import React, { useState } from 'react';
import { Database, FileText, Settings, ShieldCheck, ArrowRight } from 'lucide-react';
import { CVDocument } from '@/schemas/cv.schema';

interface ParserGraphViewProps {
  documentData: CVDocument;
}

export const ParserGraphView: React.FC<ParserGraphViewProps> = ({ documentData }) => {
  const [selectedNode, setSelectedNode] = useState<string>('raw');

  // Schema properties extracted from current documentData
  const nodes = {
    raw: {
      title: 'Raw Document Input',
      icon: FileText,
      color: 'text-indigo-400 border-indigo-500/50 bg-indigo-950/20',
      description: 'Unstructured, messy personal profile strings parsed via repository hooks.',
      output: `GÁBOR SZABÓ\nPython Developer | Production-Ready LLM Agents\n+36 70 391 6747 saborobag@gmail.com\nModel Context Protocol — 92% confidence\nForecastLabAI Senior Python Developer`
    },
    regex: {
      title: 'Entity Ingestion Node',
      icon: Database,
      color: 'text-orange-400 border-orange-500/50 bg-orange-950/20',
      description: 'Named Entity Recognition (NER) isolation loops parsing text blocks.',
      output: `{\n  fullName: "GÁBOR SZABÓ",\n  headline: "Python Developer | Production-Ready LLM Agents",\n  phone: "+36 70 391 6747",\n  email: "saborobag@gmail.com",\n  skills: [{ name: "Model Context Protocol", score: "92%" }]\n}`
    },
    zod: {
      title: 'Zod Validation Guard',
      icon: ShieldCheck,
      color: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/20',
      description: 'Checks lengths, formats, integer ranges, and strips incomplete attributes.',
      output: `CVContentSchema.parse({\n  candidateIdentity: {\n    fullName: "GÁBOR SZABÓ", // PASS: length <= 50\n    professionalHeadline: "Python Developer | Production-Ready LLM Agents"\n  },\n  communicationChannels: [\n    { label: "Phone", value: "+36 70 391 6747", iconType: "phone" } // PASS: matches phone pattern\n  ]\n})`
    },
    compiled: {
      title: 'Compiled Template Context',
      icon: Settings,
      color: 'text-pink-400 border-pink-500/50 bg-pink-950/20',
      description: 'Unified state payload compiled with Design Swatches and active margins.',
      output: JSON.stringify(
        {
          templateId: documentData.design.activeTemplateId,
          font: documentData.design.typographySelection,
          density: documentData.design.globalDensityScale,
          revisions: documentData.metadata.documentRevision,
          modified: documentData.metadata.lastModifiedTimestamp
        }, 
        null, 
        2
      )
    }
  };

  return (
    <div className="bg-workspace-card/50 p-6 rounded-lg border border-workspace-border space-y-6 text-slate-200">
      <div className="border-b border-workspace-border pb-3">
        <h3 className="text-sm font-semibold">Document Templatization Ingestion Trace</h3>
        <p className="text-[11px] text-slate-400 mt-1 leading-normal font-sans">
          Trace the transformation mapping unstructured resume details into structured, schema-validated visual nodes.
        </p>
      </div>

      {/* SVG Flow diagram */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch relative">
        {(Object.keys(nodes) as Array<keyof typeof nodes>).map((key, index) => {
          const Node = nodes[key];
          const isSelected = selectedNode === key;
          
          return (
            <div 
              key={key}
              onClick={() => setSelectedNode(key)}
              className={`p-4 rounded-lg border cursor-pointer transition-all flex flex-col justify-between select-none relative ${
                isSelected 
                  ? `${Node.color} ring-1 ring-offset-2 ring-offset-slate-900 ring-slate-400 shadow-lg scale-[1.02]` 
                  : 'bg-workspace-bg border-workspace-border hover:bg-slate-800/60 hover:border-slate-600 text-slate-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Node.icon className={`w-5 h-5 ${isSelected ? '' : 'text-slate-500'}`} />
                  <span className="text-[9px] font-mono opacity-50 uppercase">Step {index + 1}</span>
                </div>
                <h4 className="text-xs font-bold uppercase text-slate-200 leading-tight mb-1">{Node.title}</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{Node.description}</p>
              </div>

              {/* Arrow connector */}
              {index < 3 && (
                <div className="hidden md:flex absolute top-1/2 -right-3.5 -translate-y-1/2 z-20 pointer-events-none">
                  <ArrowRight className="w-5 h-5 text-workspace-border" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Output Console Log box */}
      <div className="bg-slate-950 rounded border border-workspace-border p-4 flex flex-col space-y-2 relative">
        <div className="flex justify-between items-center border-b border-workspace-border/50 pb-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Trace Console Log &bull; Node: {selectedNode.toUpperCase()}
          </span>
          <span className="text-[9px] font-mono text-slate-500">status: active</span>
        </div>
        <pre className="text-[10px] font-mono text-slate-300 leading-relaxed whitespace-pre-wrap select-text max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
          {nodes[selectedNode as keyof typeof nodes].output}
        </pre>
      </div>
    </div>
  );
};
