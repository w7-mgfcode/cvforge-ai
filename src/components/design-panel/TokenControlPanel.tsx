import React from 'react';
import { CVDesignConfig } from '@/schemas/cv.schema';
import { Type, Layout, Palette, RefreshCw } from 'lucide-react';
import { templatesRegistry } from '@/lib/template-engine';

interface TokenControlPanelProps {
  design: CVDesignConfig;
  onChange: (updatedDesign: CVDesignConfig) => void;
}

export const TokenControlPanel: React.FC<TokenControlPanelProps> = ({ design, onChange }) => {
  
  const handleConfigChange = (field: keyof CVDesignConfig, value: CVDesignConfig[keyof CVDesignConfig]) => {
    onChange({
      ...design,
      [field]: value
    });
  };

  const handleColorChange = (key: string, value: string) => {
    onChange({
      ...design,
      colorPaletteOverrides: {
        ...design.colorPaletteOverrides,
        [key]: value
      }
    });
  };

  const resetDesignOverrides = () => {
    onChange({
      activeTemplateId: design.activeTemplateId,
      typographySelection: 'Montserrat',
      globalDensityScale: 'comfortable',
      colorPaletteOverrides: {}
    });
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* 1. Template Registry Select */}
      <div className="bg-workspace-card/50 p-4 rounded-lg border border-workspace-border space-y-3">
        <div className="flex items-center space-x-2 border-b border-workspace-border pb-2">
          <Layout className="w-4 h-4 text-workspace-accent" />
          <h3 className="text-sm font-semibold">Structural Layout Template</h3>
        </div>

        <div className="space-y-2">
          {templatesRegistry.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => handleConfigChange('activeTemplateId', tmpl.id)}
              className={`p-3 rounded border cursor-pointer select-none transition-all ${
                design.activeTemplateId === tmpl.id
                  ? 'bg-workspace-accent/15 border-workspace-accent text-white shadow-md'
                  : 'bg-workspace-bg border-workspace-border hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold">{tmpl.name}</span>
                <span className="text-[9px] font-mono opacity-60 uppercase">{tmpl.id}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{tmpl.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Global Styling Typography & Spacing */}
      <div className="bg-workspace-card/50 p-4 rounded-lg border border-workspace-border space-y-4">
        <div className="flex items-center space-x-2 border-b border-workspace-border pb-2">
          <Type className="w-4 h-4 text-workspace-accent" />
          <h3 className="text-sm font-semibold">Visual Typography</h3>
        </div>

        {/* Font selections */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Typography Font Family</label>
          <select
            value={design.typographySelection}
            onChange={(e) => handleConfigChange('typographySelection', e.target.value)}
            className="w-full bg-workspace-bg border border-workspace-border rounded px-3 py-2 text-sm text-slate-200 focus:outline-none"
          >
            <option value="Montserrat">Montserrat (Standard Editorial)</option>
            <option value="Inter">Inter (ATS Optimized)</option>
          </select>
        </div>

        {/* Density settings */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex justify-between items-center">
            <span>Spatial Spacing Density</span>
            <span className="text-[10px] uppercase font-bold text-workspace-accent">{design.globalDensityScale}</span>
          </label>
          <div className="grid grid-cols-2 gap-2 bg-workspace-bg p-1 rounded border border-workspace-border">
            <button
              onClick={() => handleConfigChange('globalDensityScale', 'comfortable')}
              className={`py-1 text-xs font-semibold rounded-sm transition-all ${
                design.globalDensityScale === 'comfortable'
                  ? 'bg-workspace-card text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Comfortable
            </button>
            <button
              onClick={() => handleConfigChange('globalDensityScale', 'compact')}
              className={`py-1 text-xs font-semibold rounded-sm transition-all ${
                design.globalDensityScale === 'compact'
                  ? 'bg-workspace-card text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Compact
            </button>
          </div>
        </div>
      </div>

      {/* 3. Color Token System Overrides */}
      <div className="bg-workspace-card/50 p-4 rounded-lg border border-workspace-border space-y-4">
        <div className="flex items-center justify-between border-b border-workspace-border pb-2">
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4 text-workspace-accent" />
            <h3 className="text-sm font-semibold">Brand Color Tokens</h3>
          </div>
          <button
            onClick={resetDesignOverrides}
            className="p-1 rounded bg-workspace-bg border border-workspace-border hover:bg-slate-800 text-slate-400 hover:text-white"
            title="Reset theme config"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold block">Primary Brand Accent</span>
              <span className="text-[10px] text-slate-400">Header tags and dominant titles</span>
            </div>
            <input
              type="color"
              value={(design.colorPaletteOverrides['primary'] as string) || '#0F172A'}
              onChange={(e) => handleColorChange('primary', e.target.value)}
              className="w-8 h-8 rounded border border-workspace-border bg-transparent cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold block">Secondary Accent Color</span>
              <span className="text-[10px] text-slate-400">Section boundaries and grid lines</span>
            </div>
            <input
              type="color"
              value={(design.colorPaletteOverrides['secondary'] as string) || '#1E3A8A'}
              onChange={(e) => handleColorChange('secondary', e.target.value)}
              className="w-8 h-8 rounded border border-workspace-border bg-transparent cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold block">Highlight Accent Swatch</span>
              <span className="text-[10px] text-slate-400">Progress metrics and bullet markers</span>
            </div>
            <input
              type="color"
              value={(design.colorPaletteOverrides['accent'] as string) || '#EA580C'}
              onChange={(e) => handleColorChange('accent', e.target.value)}
              className="w-8 h-8 rounded border border-workspace-border bg-transparent cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
