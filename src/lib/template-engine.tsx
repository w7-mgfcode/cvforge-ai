import React from 'react';
import { CVDocument } from '@/schemas/cv.schema';
import { Globe, Phone, Mail, MapPin, Award, Briefcase, Code, Award as CertIcon } from 'lucide-react';

interface TemplateRendererProps {
  documentData: CVDocument;
}

// Inline SVGs to avoid barrel optimization build issues
const GithubIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const LinkedinIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

// Icon mapper utility
const ContactIcon = ({ type, className = "w-3 h-3" }: { type: string; className?: string }) => {
  switch (type) {
    case 'phone': return <Phone className={className} />;
    case 'email': return <Mail className={className} />;
    case 'location': return <MapPin className={className} />;
    case 'github': return <GithubIcon className={className} />;
    case 'linkedin': return <LinkedinIcon className={className} />;
    default: return <Globe className={className} />;
  }
};

// 1. Executive Technical Dossier Template
export const ExecutiveTechnicalDossierTemplate: React.FC<TemplateRendererProps> = ({ documentData }) => {
  const { content, design } = documentData;
  const isCompact = design.globalDensityScale === 'compact';

  // Layout spacing configs based on density scale
  const spacing = {
    padding: isCompact ? 'p-6' : 'p-8',
    sectionMargin: isCompact ? 'mb-4' : 'mb-6',
    itemGap: isCompact ? 'space-y-1.5' : 'space-y-3',
    headerPadding: isCompact ? 'pb-4 mb-4' : 'pb-6 mb-6',
  };

  const primaryColor = (design.colorPaletteOverrides['primary'] as string) || '#0F172A'; // Default deep slate
  const secondaryColor = (design.colorPaletteOverrides['secondary'] as string) || '#1E3A8A'; // Default navy
  const accentColor = (design.colorPaletteOverrides['accent'] as string) || '#EA580C'; // Default orange

  return (
    <div 
      className={`w-full h-full text-slate-800 bg-white ${spacing.padding}`}
      style={{ fontFamily: design.typographySelection === 'Montserrat' ? 'var(--font-montserrat)' : 'var(--font-inter)' }}
    >
      {/* Header Block */}
      <header className={`flex justify-between items-start border-b border-slate-200 ${spacing.headerPadding}`}>
        <div className="max-w-[70%]">
          <h1 className="text-2xl font-bold tracking-tight uppercase" style={{ color: primaryColor }}>
            {content.candidateIdentity.fullName}
          </h1>
          <h2 className="text-sm font-semibold tracking-wide mt-1" style={{ color: secondaryColor }}>
            {content.candidateIdentity.professionalHeadline}
          </h2>
        </div>
        <div className="flex flex-col space-y-1 items-end text-xs text-slate-600">
          {content.communicationChannels.map((channel, i) => (
            <div key={i} className="flex items-center space-x-1.5">
              <span style={{ color: secondaryColor }}>
                <ContactIcon type={channel.iconType} className="w-3.5 h-3.5" />
              </span>
              {channel.href ? (
                <a href={channel.href} target="_blank" rel="noreferrer" className="hover:underline hover:text-slate-800">
                  {channel.value}
                </a>
              ) : (
                <span>{channel.value}</span>
              )}
            </div>
          ))}
        </div>
      </header>

      {/* Main Structural Grid */}
      <main className="grid grid-cols-3 gap-6">
        {/* Left Side Rail Column (33%) */}
        <aside className="col-span-1 border-r border-slate-100 pr-4 space-y-5">
          {/* Skills Inventory */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 border-b border-slate-200 pb-1" style={{ color: secondaryColor }}>
              Technical Metrics
            </h3>
            <div className="space-y-2.5">
              {content.skillsInventory.map((skill, i) => (
                <div key={i} className="text-xs">
                  <div className="flex justify-between font-medium text-slate-700 mb-0.5">
                    <span>{skill.name}</span>
                    <span className="text-[10px] opacity-80">{skill.confidenceScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${skill.confidenceScore}%`,
                        backgroundColor: skill.confidenceScore >= 90 ? primaryColor : secondaryColor
                      }} 
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono italic">{skill.categoryMarker}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Credentials Library */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 border-b border-slate-200 pb-1" style={{ color: secondaryColor }}>
              Credentials
            </h3>
            <div className="space-y-2">
              {content.credentialsLibrary.map((cred, i) => (
                <div key={i} className="text-xs">
                  <div className="flex items-start space-x-1.5">
                    <CertIcon className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
                    <div>
                      <h4 className="font-semibold text-slate-800 leading-tight">{cred.title}</h4>
                      <p className="text-[10px] text-slate-500">{cred.issuer} &bull; {cred.attainedYear}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>

        {/* Right Main Column (67%) */}
        <section className="col-span-2 space-y-5">
          {/* Summary */}
          <section>
            <p className="text-[11px] leading-relaxed text-slate-600 font-medium italic">
              &quot;{content.candidateIdentity.biographicalSummary}&quot;
            </p>
          </section>

          {/* Employment History */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 border-b border-slate-200 pb-1" style={{ color: secondaryColor }}>
              Professional Timeline
            </h3>
            <div className={spacing.itemGap}>
              {content.employmentTimeline.map((job, i) => (
                <div key={i} className="text-xs border-b border-slate-50 pb-2 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 text-[12px]">{job.roleTitle}</h4>
                      <span className="text-[10px] font-semibold text-slate-500">{job.entityName}</span>
                    </div>
                    <div className="text-right text-[10px] text-slate-500">
                      <p className="font-medium">{job.temporalDuration}</p>
                      <p>{job.geographicLocation}</p>
                    </div>
                  </div>
                  
                  {/* Bullets */}
                  <ul className="list-disc pl-4 mt-1.5 space-y-1 text-slate-600 text-[10.5px] leading-snug">
                    {job.bulletPoints.map((bp, k) => (
                      <li key={k}>{bp}</li>
                    ))}
                  </ul>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.associatedTechTags.map((tag, k) => (
                      <span 
                        key={k} 
                        className="text-[9px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Project Showcase */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 border-b border-slate-200 pb-1" style={{ color: secondaryColor }}>
              Key Project Portfolio
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {content.projectShowcase.map((proj, i) => (
                <div key={i} className="text-xs bg-slate-50 p-2.5 rounded border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-slate-800 text-[11px] flex items-center space-x-1">
                        <Code className="w-3.5 h-3.5 text-slate-600" />
                        <span>{proj.title}</span>
                      </h4>
                      {proj.repositoryUrl && (
                        <a 
                          href={proj.repositoryUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[10px] flex items-center text-slate-500 hover:text-slate-800 underline"
                        >
                          <GithubIcon className="w-3 h-3 mr-1" />
                          <span>Code</span>
                        </a>
                      )}
                    </div>
                    <p className="text-slate-600 text-[10px] leading-relaxed mb-1.5">{proj.description}</p>
                  </div>
                  <div className="text-[9px] font-semibold flex items-center px-1.5 py-0.5 bg-orange-50 text-orange-700 rounded border border-orange-100 self-start">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1.5 animate-pulse" />
                    <span>Evidence: {proj.metricsEvidence}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
};

// 2. Clean ATS Hybrid Template
export const CleanATSHybridTemplate: React.FC<TemplateRendererProps> = ({ documentData }) => {
  const { content, design } = documentData;
  const isCompact = design.globalDensityScale === 'compact';

  const spacing = {
    padding: isCompact ? 'p-6' : 'p-8',
    sectionMargin: isCompact ? 'mb-4' : 'mb-6',
    itemGap: isCompact ? 'space-y-2' : 'space-y-4',
  };

  return (
    <div 
      className={`w-full h-full text-slate-900 bg-white ${spacing.padding} space-y-4`}
      style={{ fontFamily: 'var(--font-inter)' }} // Standard Inter for clean parsing
    >
      {/* ATS Header (Centered, simple text) */}
      <header className="text-center border-b-2 border-slate-800 pb-3">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 uppercase">
          {content.candidateIdentity.fullName}
        </h1>
        <p className="text-sm font-semibold text-slate-700 mt-0.5">
          {content.candidateIdentity.professionalHeadline}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-2 font-mono">
          {content.communicationChannels.map((channel, i) => (
            <span key={i} className="flex items-center space-x-1">
              <span>{channel.label}:</span>
              <span className="font-semibold text-slate-800">{channel.value}</span>
              {i < content.communicationChannels.length - 1 && <span className="text-slate-300 ml-2">&bull;</span>}
            </span>
          ))}
        </div>
      </header>

      {/* Abstract Summary */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-0.5 mb-1.5 text-slate-900">
          Professional Abstract
        </h3>
        <p className="text-xs leading-relaxed text-slate-700">
          {content.candidateIdentity.biographicalSummary}
        </p>
      </section>

      {/* Employment Timeline */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-0.5 mb-2 text-slate-900">
          Professional Experience
        </h3>
        <div className={spacing.itemGap}>
          {content.employmentTimeline.map((job, i) => (
            <div key={i} className="text-xs">
              <div className="flex justify-between font-bold text-slate-950">
                <span>{job.roleTitle} | {job.entityName}</span>
                <span className="font-mono font-medium text-slate-600">{job.temporalDuration}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium mb-1">{job.geographicLocation}</div>
              <ul className="list-disc pl-5 space-y-0.5 text-slate-700 leading-snug">
                {job.bulletPoints.map((bp, k) => (
                  <li key={k}>{bp}</li>
                ))}
              </ul>
              <div className="mt-1.5 text-[10px] font-mono text-slate-600">
                <span className="font-bold text-slate-700">Technologies Utilized:</span> {job.associatedTechTags.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Matrix */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-0.5 mb-2 text-slate-900">
          Skills Inventory
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          {content.skillsInventory.map((skill, i) => (
            <div key={i} className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="font-semibold text-slate-800">{skill.name}</span>
              <span className="text-slate-500 font-mono">{skill.confidenceScore}% ({skill.categoryMarker})</span>
            </div>
          ))}
        </div>
      </section>

      {/* Project Showcase */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-0.5 mb-2 text-slate-900">
          Technical Projects
        </h3>
        <div className="space-y-2">
          {content.projectShowcase.map((proj, i) => (
            <div key={i} className="text-xs">
              <div className="flex justify-between font-bold text-slate-950">
                <span>{proj.title}</span>
                {proj.repositoryUrl && <span className="font-mono font-medium text-slate-500">{proj.repositoryUrl}</span>}
              </div>
              <p className="text-slate-700 leading-relaxed mt-0.5">{proj.description}</p>
              <div className="text-[10px] font-mono text-slate-600 mt-0.5">
                <span className="font-bold text-slate-700">Performance Metrics:</span> {proj.metricsEvidence}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Credentials */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-0.5 mb-2 text-slate-900">
          Certifications & Education
        </h3>
        <div className="grid grid-cols-2 gap-4 text-xs">
          {content.credentialsLibrary.map((cred, i) => (
            <div key={i} className="flex justify-between items-start">
              <div>
                <span className="font-bold text-slate-800">{cred.title}</span>
                <span className="text-slate-500 block text-[10px]">{cred.issuer}</span>
              </div>
              <span className="font-mono text-slate-600">{cred.attainedYear}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// 3. Visual AI Portfolio Template
export const VisualAIPortfolioTemplate: React.FC<TemplateRendererProps> = ({ documentData }) => {
  const { content, design } = documentData;
  const isCompact = design.globalDensityScale === 'compact';

  const spacing = {
    padding: isCompact ? 'p-5' : 'p-7',
    itemGap: isCompact ? 'space-y-2' : 'space-y-4',
  };

  const accentColor = design.colorPaletteOverrides.accent || '#2563EB'; // Blue accent

  return (
    <div 
      className={`w-full h-full text-slate-800 bg-white ${spacing.padding}`}
      style={{ fontFamily: 'var(--font-montserrat)' }}
    >
      {/* Tech Portfolio Header */}
      <header className="bg-slate-900 text-white rounded-lg p-5 mb-5 flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-orange-500/20 rounded-full blur-xl" />
        <div className="z-10">
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
            {content.candidateIdentity.fullName}
          </h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mt-1">
            {content.candidateIdentity.professionalHeadline}
          </p>
        </div>
        <div className="text-[10px] font-mono text-slate-400 space-y-1 z-10 text-right">
          {content.communicationChannels.map((channel, i) => (
            <div key={i} className="flex items-center justify-end space-x-1.5">
              <span>{channel.value}</span>
              <ContactIcon type={channel.iconType} className="w-3.5 h-3.5 text-indigo-400" />
            </div>
          ))}
        </div>
      </header>

      {/* Abstract */}
      <section className="mb-4">
        <p className="text-xs leading-relaxed text-slate-600 border-l-2 border-indigo-500 pl-3 italic">
          {content.candidateIdentity.biographicalSummary}
        </p>
      </section>

      <main className="grid grid-cols-5 gap-5">
        {/* Main Column (60%) */}
        <div className="col-span-3 space-y-4">
          {/* Projects Portfolio Cards */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center space-x-1.5">
              <Code className="w-4 h-4 text-indigo-600" />
              <span>Architectural Evidence</span>
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {content.projectShowcase.map((proj, i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-md border border-slate-200 p-3 shadow-sm hover:shadow-md transition-all hover:border-indigo-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-slate-800 text-[11px]">{proj.title}</h4>
                      {proj.repositoryUrl && (
                        <a href={proj.repositoryUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 text-[10px] flex items-center">
                          <GithubIcon className="w-3 h-3 mr-0.5" /> Code
                        </a>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal mb-2">{proj.description}</p>
                  </div>
                  <div 
                    className="text-[9px] font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-100 self-start flex items-center"
                    style={{ borderColor: `${accentColor}20`, color: accentColor, backgroundColor: `${accentColor}08` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: accentColor }} />
                    {proj.metricsEvidence}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline Experience */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center space-x-1.5">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Career Architecture</span>
            </h3>
            <div className="relative pl-3 border-l border-slate-200 space-y-3.5">
              {content.employmentTimeline.map((job, i) => (
                <div key={i} className="text-xs relative">
                  {/* Timeline point indicator */}
                  <div className="absolute -left-[16.5px] top-1.5 w-2 h-2 rounded-full border border-indigo-600 bg-white" />
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-bold text-slate-800 text-[11.5px] leading-tight">{job.roleTitle}</h4>
                      <p className="text-[10px] text-indigo-600 font-semibold">{job.entityName}</p>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 whitespace-nowrap">{job.temporalDuration}</span>
                  </div>
                  <ul className="list-disc pl-4 text-[10px] text-slate-500 space-y-0.5 leading-relaxed">
                    {job.bulletPoints.map((bp, k) => (
                      <li key={k}>{bp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (40%) */}
        <div className="col-span-2 space-y-4">
          {/* Skill Badges / Ratings */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Skills Registry</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {content.skillsInventory.map((skill, i) => (
                <div 
                  key={i} 
                  className="text-[10px] bg-slate-50 border border-slate-200 px-2 py-1 rounded flex items-center justify-between w-full"
                >
                  <span className="font-semibold text-slate-700">{skill.name}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-[9px] font-mono bg-indigo-50 text-indigo-700 px-1 rounded">{skill.confidenceScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Credentials */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center space-x-1.5">
              <CertIcon className="w-4 h-4 text-indigo-600" />
              <span>Verifications</span>
            </h3>
            <div className="space-y-2">
              {content.credentialsLibrary.map((cred, i) => (
                <div key={i} className="text-xs bg-slate-50 p-2.5 rounded border border-slate-200/80">
                  <span className="font-bold text-slate-800 text-[10.5px] leading-tight block">{cred.title}</span>
                  <div className="flex justify-between items-center text-[9px] text-slate-400 mt-1">
                    <span>{cred.issuer}</span>
                    <span className="font-mono">{cred.attainedYear}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

// Layout templates registry mapper
export const templatesRegistry = [
  {
    id: 'dossier',
    name: 'Executive Technical Dossier',
    description: 'Split-column timeline layout with technical metrics and certifications side-rail.',
    component: ExecutiveTechnicalDossierTemplate,
  },
  {
    id: 'ats',
    name: 'Clean ATS Hybrid',
    description: 'Minimal single-column structure optimized for automated resume parser systems.',
    component: CleanATSHybridTemplate,
  },
  {
    id: 'visual',
    name: 'Visual AI Portfolio',
    description: 'Modern developer card design featuring cloud engineering highlight blocks.',
    component: VisualAIPortfolioTemplate,
  },
];

// Helper to render active template based on document structure
export const renderActiveTemplate = (documentData: CVDocument) => {
  const templateId = documentData.design.activeTemplateId;
  const template = templatesRegistry.find(t => t.id === templateId) || templatesRegistry[0];
  const TemplateComponent = template.component;
  return <TemplateComponent documentData={documentData} />;
};
