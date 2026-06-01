import React from 'react';
import { CVContent, ContactLink } from '@/schemas/cv.schema';
import { User, Phone, Plus, Trash2 } from 'lucide-react';

interface BaseProfileFormProps {
  content: CVContent;
  onChange: (updatedContent: CVContent) => void;
}

export const BaseProfileForm: React.FC<BaseProfileFormProps> = ({ content, onChange }) => {
  const { candidateIdentity, communicationChannels } = content;

  const handleIdentityChange = (field: keyof typeof candidateIdentity, value: string) => {
    onChange({
      ...content,
      candidateIdentity: {
        ...candidateIdentity,
        [field]: value
      }
    });
  };

  const handleChannelChange = (index: number, field: keyof ContactLink, value: string) => {
    const updatedChannels = [...communicationChannels];
    updatedChannels[index] = {
      ...updatedChannels[index],
      [field]: value
    };
    onChange({
      ...content,
      communicationChannels: updatedChannels
    });
  };

  const addChannel = () => {
    onChange({
      ...content,
      communicationChannels: [
        ...communicationChannels,
        { label: 'Website', value: 'example.com', href: 'https://example.com', iconType: 'custom' }
      ]
    });
  };

  const removeChannel = (index: number) => {
    const updatedChannels = communicationChannels.filter((_, i) => i !== index);
    onChange({
      ...content,
      communicationChannels: updatedChannels
    });
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* Candidate Profile Details */}
      <div className="bg-workspace-card/50 p-4 rounded-lg border border-workspace-border space-y-4">
        <div className="flex items-center space-x-2 border-b border-workspace-border pb-2">
          <User className="w-4 h-4 text-workspace-accent" />
          <h3 className="text-sm font-semibold">Candidate Profile</h3>
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Full Legal Name</label>
          <input
            type="text"
            value={candidateIdentity.fullName}
            onChange={(e) => handleIdentityChange('fullName', e.target.value)}
            className="w-full bg-workspace-bg border border-workspace-border rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-workspace-accent"
            placeholder="e.g. GÁBOR SZABÓ"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Professional Headline</label>
          <input
            type="text"
            value={candidateIdentity.professionalHeadline}
            onChange={(e) => handleIdentityChange('professionalHeadline', e.target.value)}
            className="w-full bg-workspace-bg border border-workspace-border rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-workspace-accent"
            placeholder="e.g. Python Developer | Production-Ready LLM Agents"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Professional Abstract Summary</label>
          <textarea
            value={candidateIdentity.biographicalSummary}
            onChange={(e) => handleIdentityChange('biographicalSummary', e.target.value)}
            rows={4}
            className="w-full bg-workspace-bg border border-workspace-border rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-workspace-accent resize-none"
            placeholder="Summarize your professional profile and credentials..."
          />
        </div>
      </div>

      {/* Communication / Contact Channels */}
      <div className="bg-workspace-card/50 p-4 rounded-lg border border-workspace-border space-y-4">
        <div className="flex items-center justify-between border-b border-workspace-border pb-2">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-workspace-accent" />
            <h3 className="text-sm font-semibold">Contact Channels</h3>
          </div>
          <button
            onClick={addChannel}
            className="p-1 rounded bg-workspace-bg border border-workspace-border hover:bg-slate-800 text-slate-300 hover:text-white"
            title="Add contact channel"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {communicationChannels.map((channel, idx) => (
            <div key={idx} className="bg-workspace-bg p-3 rounded border border-workspace-border space-y-2 relative group">
              <button
                onClick={() => removeChannel(idx)}
                className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove channel"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Label</label>
                  <input
                    type="text"
                    value={channel.label}
                    onChange={(e) => handleChannelChange(idx, 'label', e.target.value)}
                    className="w-full bg-workspace-card border border-workspace-border rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Icon Link Type</label>
                  <select
                    value={channel.iconType}
                    onChange={(e) => handleChannelChange(idx, 'iconType', e.target.value as ContactLink['iconType'])}
                    className="w-full bg-workspace-card border border-workspace-border rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                    <option value="location">Location</option>
                    <option value="github">GitHub</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="custom">Custom (Web)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Display Value</label>
                <input
                  type="text"
                  value={channel.value}
                  onChange={(e) => handleChannelChange(idx, 'value', e.target.value)}
                  className="w-full bg-workspace-card border border-workspace-border rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                  placeholder="e.g. email@example.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">URL Hyperlink (href)</label>
                <input
                  type="text"
                  value={channel.href}
                  onChange={(e) => handleChannelChange(idx, 'href', e.target.value)}
                  className="w-full bg-workspace-card border border-workspace-border rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                  placeholder="e.g. mailto:email@example.com"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
