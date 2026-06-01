import React, { useState } from 'react';
import { CVContent, ExperienceItem, ProjectItem, TechSkillItem, CredentialItem } from '@/schemas/cv.schema';
import { Briefcase, Code, Award, GraduationCap, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface ExperienceFormProps {
  content: CVContent;
  onChange: (updatedContent: CVContent) => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ content, onChange }) => {
  const [activeFormTab, setActiveFormTab] = useState<'work' | 'projects' | 'skills' | 'certs'>('work');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // --- Employment Actions ---
  const handleWorkChange = (index: number, field: keyof ExperienceItem, value: ExperienceItem[keyof ExperienceItem]) => {
    const updated = [...content.employmentTimeline];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...content, employmentTimeline: updated });
  };

  const addWork = () => {
    const newItem: ExperienceItem = {
      entityName: 'New Corporation',
      roleTitle: 'Software Engineer',
      temporalDuration: '2026 - Present',
      geographicLocation: 'Remote',
      bulletPoints: ['Deploys system automation structures and APIs.'],
      associatedTechTags: ['React', 'TypeScript']
    };
    onChange({
      ...content,
      employmentTimeline: [newItem, ...content.employmentTimeline]
    });
    setExpandedIndex(0);
  };

  const removeWork = (index: number) => {
    onChange({
      ...content,
      employmentTimeline: content.employmentTimeline.filter((_, i) => i !== index)
    });
    setExpandedIndex(null);
  };

  const handleBulletChange = (workIdx: number, bulletIdx: number, value: string) => {
    const updatedWork = [...content.employmentTimeline];
    const updatedBullets = [...updatedWork[workIdx].bulletPoints];
    updatedBullets[bulletIdx] = value;
    updatedWork[workIdx] = { ...updatedWork[workIdx], bulletPoints: updatedBullets };
    onChange({ ...content, employmentTimeline: updatedWork });
  };

  const addBullet = (workIdx: number) => {
    const updatedWork = [...content.employmentTimeline];
    updatedWork[workIdx] = {
      ...updatedWork[workIdx],
      bulletPoints: [...updatedWork[workIdx].bulletPoints, 'Added professional achievement details.']
    };
    onChange({ ...content, employmentTimeline: updatedWork });
  };

  const removeBullet = (workIdx: number, bulletIdx: number) => {
    const updatedWork = [...content.employmentTimeline];
    const updatedBullets = updatedWork[workIdx].bulletPoints.filter((_, i) => i !== bulletIdx);
    updatedWork[workIdx] = { ...updatedWork[workIdx], bulletPoints: updatedBullets };
    onChange({ ...content, employmentTimeline: updatedWork });
  };

  const handleTagsChange = (workIdx: number, tagsString: string) => {
    const updatedWork = [...content.employmentTimeline];
    const tagsArray = tagsString.split(',').map(t => t.trim()).filter(Boolean);
    updatedWork[workIdx] = { ...updatedWork[workIdx], associatedTechTags: tagsArray };
    onChange({ ...content, employmentTimeline: updatedWork });
  };

  // --- Project Actions ---
  const handleProjectChange = (index: number, field: keyof ProjectItem, value: ProjectItem[keyof ProjectItem]) => {
    const updated = [...content.projectShowcase];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...content, projectShowcase: updated });
  };

  const addProject = () => {
    const newItem: ProjectItem = {
      title: 'New Project App',
      description: 'A platform that handles and visualizes system metadata.',
      repositoryUrl: 'https://github.com',
      metricsEvidence: '100% test coverage'
    };
    onChange({
      ...content,
      projectShowcase: [newItem, ...content.projectShowcase]
    });
  };

  const removeProject = (index: number) => {
    onChange({
      ...content,
      projectShowcase: content.projectShowcase.filter((_, i) => i !== index)
    });
  };

  // --- Skills Actions ---
  const handleSkillChange = (index: number, field: keyof TechSkillItem, value: TechSkillItem[keyof TechSkillItem]) => {
    const updated = [...content.skillsInventory];
    if (field === 'confidenceScore') {
      updated[index] = { ...updated[index], [field]: Number(value) };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    onChange({ ...content, skillsInventory: updated });
  };

  const addSkill = () => {
    const newItem: TechSkillItem = {
      name: 'New Core Skill',
      confidenceScore: 80,
      categoryMarker: 'General Core'
    };
    onChange({
      ...content,
      skillsInventory: [...content.skillsInventory, newItem]
    });
  };

  const removeSkill = (index: number) => {
    onChange({
      ...content,
      skillsInventory: content.skillsInventory.filter((_, i) => i !== index)
    });
  };

  // --- Certification Actions ---
  const handleCertChange = (index: number, field: keyof CredentialItem, value: CredentialItem[keyof CredentialItem]) => {
    const updated = [...content.credentialsLibrary];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...content, credentialsLibrary: updated });
  };

  const addCert = () => {
    const newItem: CredentialItem = {
      title: 'Certified Developer Specialist',
      issuer: 'Platform Authority',
      attainedYear: '2026'
    };
    onChange({
      ...content,
      credentialsLibrary: [...content.credentialsLibrary, newItem]
    });
  };

  const removeCert = (index: number) => {
    onChange({
      ...content,
      credentialsLibrary: content.credentialsLibrary.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-4 text-slate-200">
      {/* Tab Navigation */}
      <div className="flex bg-workspace-bg p-1 rounded-md border border-workspace-border">
        {(
          [
            { id: 'work', label: 'Timeline', icon: Briefcase },
            { id: 'projects', label: 'Projects', icon: Code },
            { id: 'skills', label: 'Skills', icon: Award },
            { id: 'certs', label: 'Credentials', icon: GraduationCap }
          ] as const
        ).map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveFormTab(tab.id); setExpandedIndex(0); }}
            className={`flex-1 py-1.5 flex flex-col items-center justify-center rounded-sm text-[10px] font-semibold transition-all ${
              activeFormTab === tab.id
                ? 'bg-workspace-card text-workspace-accent border border-workspace-border'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5 mb-0.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 1. Work Timeline Section */}
      {activeFormTab === 'work' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-1">
            <span className="text-xs font-semibold text-slate-400">Work Timeline History</span>
            <button
              onClick={addWork}
              className="flex items-center space-x-1 px-2.5 py-1 bg-workspace-accent hover:bg-workspace-accentHover text-xs font-semibold text-white rounded transition-all shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Work</span>
            </button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {content.employmentTimeline.map((job, idx) => (
              <div key={idx} className="bg-workspace-card/50 rounded-lg border border-workspace-border overflow-hidden">
                {/* Header item bar */}
                <div 
                  onClick={() => toggleExpand(idx)}
                  className="flex items-center justify-between p-3 bg-workspace-card/90 cursor-pointer select-none border-b border-workspace-border/40 hover:bg-slate-800/80"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-xs font-bold truncate">{job.roleTitle}</p>
                    <p className="text-[10px] text-slate-400 truncate">{job.entityName} &bull; {job.temporalDuration}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); removeWork(idx); }}
                      className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {expandedIndex === idx ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Collapsible Content */}
                {expandedIndex === idx && (
                  <div className="p-3.5 space-y-3 bg-workspace-bg/10">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Entity/Company</label>
                        <input
                          type="text"
                          value={job.entityName}
                          onChange={(e) => handleWorkChange(idx, 'entityName', e.target.value)}
                          className="w-full bg-workspace-bg border border-workspace-border rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Role Title</label>
                        <input
                          type="text"
                          value={job.roleTitle}
                          onChange={(e) => handleWorkChange(idx, 'roleTitle', e.target.value)}
                          className="w-full bg-workspace-bg border border-workspace-border rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Duration</label>
                        <input
                          type="text"
                          value={job.temporalDuration}
                          onChange={(e) => handleWorkChange(idx, 'temporalDuration', e.target.value)}
                          className="w-full bg-workspace-bg border border-workspace-border rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                          placeholder="e.g. 2024 - Present"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Location</label>
                        <input
                          type="text"
                          value={job.geographicLocation}
                          onChange={(e) => handleWorkChange(idx, 'geographicLocation', e.target.value)}
                          className="w-full bg-workspace-bg border border-workspace-border rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Associated Tech Tags */}
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Tech Tags (Comma separated)</label>
                      <input
                        type="text"
                        value={job.associatedTechTags.join(', ')}
                        onChange={(e) => handleTagsChange(idx, e.target.value)}
                        className="w-full bg-workspace-bg border border-workspace-border rounded px-2.5 py-1 text-xs text-slate-200 font-mono focus:outline-none"
                        placeholder="e.g. React, Docker, Python"
                      />
                    </div>

                    {/* Bullet Achievements Manager */}
                    <div className="space-y-1.5 border-t border-workspace-border/30 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-semibold text-slate-400">Achievements / Bullet Points</span>
                        <button
                          onClick={() => addBullet(idx)}
                          className="text-[9px] font-semibold text-workspace-accent hover:underline flex items-center"
                        >
                          <Plus className="w-3 h-3 mr-0.5" /> Add Point
                        </button>
                      </div>
                      <div className="space-y-2">
                        {job.bulletPoints.map((bp, bIdx) => (
                          <div key={bIdx} className="flex items-start space-x-1.5 relative group/bp">
                            <textarea
                              value={bp}
                              onChange={(e) => handleBulletChange(idx, bIdx, e.target.value)}
                              rows={2}
                              className="w-full bg-workspace-bg border border-workspace-border rounded px-2 py-1 text-xs text-slate-200 focus:outline-none resize-none"
                            />
                            <button
                              onClick={() => removeBullet(idx, bIdx)}
                              className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded flex-shrink-0 mt-1 opacity-0 group-hover/bp:opacity-100 transition-opacity"
                              title="Delete point"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Projects Showcase Section */}
      {activeFormTab === 'projects' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-1">
            <span className="text-xs font-semibold text-slate-400">Portfolio Project Cards</span>
            <button
              onClick={addProject}
              className="flex items-center space-x-1 px-2.5 py-1 bg-workspace-accent hover:bg-workspace-accentHover text-xs font-semibold text-white rounded transition-all shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Card</span>
            </button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {content.projectShowcase.map((proj, idx) => (
              <div key={idx} className="bg-workspace-card/40 p-3 rounded-lg border border-workspace-border space-y-3 relative group">
                <button
                  onClick={() => removeProject(idx)}
                  className="absolute top-2.5 right-2.5 p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Project Title</label>
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => handleProjectChange(idx, 'title', e.target.value)}
                    className="w-[85%] bg-workspace-bg border border-workspace-border rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Project Description</label>
                  <textarea
                    value={proj.description}
                    onChange={(e) => handleProjectChange(idx, 'description', e.target.value)}
                    rows={2}
                    className="w-full bg-workspace-bg border border-workspace-border rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Repository URL</label>
                    <input
                      type="text"
                      value={proj.repositoryUrl}
                      onChange={(e) => handleProjectChange(idx, 'repositoryUrl', e.target.value)}
                      className="w-full bg-workspace-bg border border-workspace-border rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Factual Metric Evidence</label>
                    <input
                      type="text"
                      value={proj.metricsEvidence}
                      onChange={(e) => handleProjectChange(idx, 'metricsEvidence', e.target.value)}
                      className="w-full bg-workspace-bg border border-workspace-border rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                      placeholder="e.g. 99% accuracy"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Skills Matrix Section */}
      {activeFormTab === 'skills' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-1">
            <span className="text-xs font-semibold text-slate-400">Technical Skills Registry</span>
            <button
              onClick={addSkill}
              className="flex items-center space-x-1 px-2.5 py-1 bg-workspace-accent hover:bg-workspace-accentHover text-xs font-semibold text-white rounded transition-all shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {content.skillsInventory.map((skill, idx) => (
              <div key={idx} className="bg-workspace-card/30 p-2.5 rounded-lg border border-workspace-border flex items-center justify-between space-x-2 relative group">
                <div className="flex-1 min-w-0 grid grid-cols-5 gap-2">
                  <div className="col-span-2">
                    <label className="block text-[8px] uppercase tracking-wide text-slate-500">Skill Name</label>
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => handleSkillChange(idx, 'name', e.target.value)}
                      className="w-full bg-workspace-bg border border-workspace-border rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[8px] uppercase tracking-wide text-slate-500">Level %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={skill.confidenceScore}
                      onChange={(e) => handleSkillChange(idx, 'confidenceScore', e.target.value)}
                      className="w-full bg-workspace-bg border border-workspace-border rounded px-1.5 py-1 text-xs text-slate-200 text-center focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[8px] uppercase tracking-wide text-slate-500">Category Tag</label>
                    <input
                      type="text"
                      value={skill.categoryMarker}
                      onChange={(e) => handleSkillChange(idx, 'categoryMarker', e.target.value)}
                      className="w-full bg-workspace-bg border border-workspace-border rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => removeSkill(idx)}
                  className="p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 self-end mb-1"
                  title="Remove Skill"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Credentials & Education Section */}
      {activeFormTab === 'certs' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-1">
            <span className="text-xs font-semibold text-slate-400">Credentials & Certifications</span>
            <button
              onClick={addCert}
              className="flex items-center space-x-1 px-2.5 py-1 bg-workspace-accent hover:bg-workspace-accentHover text-xs font-semibold text-white rounded transition-all shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Credential</span>
            </button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {content.credentialsLibrary.map((cred, idx) => (
              <div key={idx} className="bg-workspace-card/40 p-3 rounded-lg border border-workspace-border space-y-2 relative group">
                <button
                  onClick={() => removeCert(idx)}
                  className="absolute top-2.5 right-2.5 p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Credential Name/Title</label>
                  <input
                    type="text"
                    value={cred.title}
                    onChange={(e) => handleCertChange(idx, 'title', e.target.value)}
                    className="w-[85%] bg-workspace-bg border border-workspace-border rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Issuer</label>
                    <input
                      type="text"
                      value={cred.issuer}
                      onChange={(e) => handleCertChange(idx, 'issuer', e.target.value)}
                      className="w-full bg-workspace-bg border border-workspace-border rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Attained Year</label>
                    <input
                      type="text"
                      value={cred.attainedYear}
                      onChange={(e) => handleCertChange(idx, 'attainedYear', e.target.value)}
                      className="w-full bg-workspace-bg border border-workspace-border rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                      placeholder="e.g. 2026"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
