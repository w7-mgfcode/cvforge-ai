import React from 'react';

interface PageContainerProps {
  zoom: number; // 0.5 to 1.5
  children: React.ReactNode;
  pageCount: number;
}

export const PageContainer: React.FC<PageContainerProps> = ({ zoom, children, pageCount }) => {
  // A4 dimensions at 96 DPI: 794px width, 1122px height per page
  const pageHeight = 1122;
  const pageWidth = 794;
  const scaledPageWidth = pageWidth * zoom;
  const scaledPageHeight = pageHeight * pageCount * zoom;

  return (
    <div className="flex justify-center p-4 lg:p-6 overflow-auto h-full w-full bg-workspace-bg print:p-0 print:overflow-visible print:h-auto print:bg-white">
      <div
        className="a4-canvas-frame relative flex-shrink-0 print:w-[210mm] print:h-auto"
        style={{
          width: `${scaledPageWidth}px`,
          height: `${scaledPageHeight}px`,
        }}
      >
        {/* Zoom scaling wrapper */}
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            width: `${pageWidth}px`,
            height: `${pageHeight * pageCount}px`,
            transition: 'transform 0.15s ease-out'
          }}
          className="a4-canvas-scaler absolute left-0 top-0 print:relative print:transform-none"
        >
          <div className="a4-page-context relative w-full h-full shadow-2xl bg-white border border-slate-700 select-none print:shadow-none print:border-none">
            {/* Render actual content */}
            <div className="absolute inset-0 w-full h-full print:relative">
              {children}
            </div>

            {/* Page boundary guidelines overlay (hidden in final print) */}
            <div className="absolute inset-0 pointer-events-none print:hidden">
              {Array.from({ length: pageCount - 1 }).map((_, index) => {
                const topOffset = pageHeight * (index + 1);
                return (
                  <div
                    key={index}
                    className="absolute left-0 w-full flex items-center justify-between border-t border-dashed border-red-500 bg-red-500/5 h-6 -translate-y-3"
                    style={{ top: `${topOffset}px` }}
                  >
                    <span className="text-[10px] font-mono text-red-500 font-bold px-2 bg-workspace-bg/90 border border-red-500/20 rounded ml-4">
                      PAGE {index + 1} / {index + 2} BREAK
                    </span>
                    <span className="text-[10px] font-mono text-red-500 font-bold px-2 bg-workspace-bg/90 border border-red-500/20 rounded mr-4">
                      A4 Print Margin Cutoff
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
