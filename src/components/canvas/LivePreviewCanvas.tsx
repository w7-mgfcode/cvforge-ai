import React, { useRef, useState, useEffect } from 'react';
import { PageContainer } from './PageContainer';
import { CVDocument } from '@/schemas/cv.schema';
import { ZoomIn, ZoomOut, Maximize2, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

interface LivePreviewCanvasProps {
  documentData: CVDocument;
  zoom: number;
  setZoom: (zoom: number) => void;
  pageCount: number;
  setPageCount: (count: number) => void;
  renderTemplate: (data: CVDocument) => React.ReactNode;
  onTightenDensity?: () => void;
}

export const LivePreviewCanvas: React.FC<LivePreviewCanvasProps> = ({
  documentData,
  zoom,
  setZoom,
  pageCount,
  setPageCount,
  renderTemplate,
  onTightenDensity
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [overflowPixels, setOverflowPixels] = useState<number>(0);
  const [isMeasuring, setIsMeasuring] = useState(false);

  // Measure content scroll height relative to target height constraints
  useEffect(() => {
    setIsMeasuring(true);
    const timer = setTimeout(() => {
      if (contentRef.current) {
        const element = contentRef.current;
        const scrollHeight = element.scrollHeight;
        const targetHeight = pageCount * 1122;
        const diff = scrollHeight - targetHeight;
        setOverflowPixels(diff > 0 ? diff : 0);
      }
      setIsMeasuring(false);
    }, 250); // debounce measurement updates to prevent paint loops

    return () => clearTimeout(timer);
  }, [documentData, pageCount]);

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.1, 1.5));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.1, 0.5));
  const handleZoomReset = () => setZoom(1.0);

  return (
    <div className="flex flex-col h-full min-w-0 bg-workspace-bg border-r border-workspace-border print:border-none print:bg-white">
      {/* Zoom and Page controls toolbar (hidden in print) */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-workspace-card border-b border-workspace-border print:hidden select-none">
        <div className="flex min-w-0 items-center space-x-2">
          <FileText className="w-5 h-5 text-workspace-accent" />
          <span className="truncate text-sm font-semibold text-slate-200">A4 Live Document Canvas</span>
        </div>

        {/* Page Limit Toggles */}
        <div className="flex flex-shrink-0 items-center space-x-1 bg-workspace-bg p-1 rounded-md border border-workspace-border">
          <button
            onClick={() => setPageCount(1)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              pageCount === 1 
                ? 'bg-workspace-accent text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1 Page
          </button>
          <button
            onClick={() => setPageCount(2)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              pageCount === 2 
                ? 'bg-workspace-accent text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2 Pages
          </button>
          <button
            onClick={() => setPageCount(3)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              pageCount === 3 
                ? 'bg-workspace-accent text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3 Pages
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex flex-shrink-0 items-center space-x-2">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="p-1.5 rounded bg-workspace-bg border border-workspace-border hover:bg-slate-800 text-slate-300 disabled:opacity-50"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-300 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 1.5}
            className="p-1.5 rounded bg-workspace-bg border border-workspace-border hover:bg-slate-800 text-slate-300 disabled:opacity-50"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomReset}
            className="p-1.5 rounded bg-workspace-bg border border-workspace-border hover:bg-slate-800 text-slate-300"
            title="Reset Zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Overflow Notification Banner (hidden in print) */}
      {overflowPixels > 0 && !isMeasuring && (
        <div className="flex items-center justify-between px-6 py-3 bg-red-950/80 border-b border-red-900 text-red-200 print:hidden transition-all duration-300 animate-pulse">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-red-400">PRINT COMPLIANCE ALERT: Sizing Overflow Detected</p>
              <p className="text-xs text-red-300">
                Content extends <span className="font-bold text-red-200 underline">{overflowPixels}px</span> past the page safety margin. It will clip on print outputs.
              </p>
            </div>
          </div>
          {onTightenDensity && documentData.design.globalDensityScale === 'comfortable' && (
            <button
              onClick={onTightenDensity}
              className="ml-4 px-3 py-1 bg-red-800 hover:bg-red-700 text-red-100 rounded text-xs font-semibold shadow-md transition-all flex-shrink-0"
            >
              Tighten Density Scale
            </button>
          )}
        </div>
      )}

      {overflowPixels === 0 && !isMeasuring && (
        <div className="flex items-center px-6 py-2 bg-emerald-950/30 border-b border-emerald-900/40 text-emerald-300 print:hidden text-xs">
          <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
          All content is fitted within print safety margins. 100% compliant.
        </div>
      )}

      {/* Main Canvas Scroll Area */}
      <div className="flex-1 min-h-0 overflow-auto bg-slate-950/40 print:overflow-visible print:bg-white">
        <PageContainer zoom={zoom} pageCount={pageCount}>
          <div ref={contentRef} className="w-full h-full text-slate-900 print:relative">
            {renderTemplate(documentData)}
          </div>
        </PageContainer>
      </div>
    </div>
  );
};
