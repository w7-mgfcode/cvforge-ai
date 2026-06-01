import { z } from 'zod';

export const ContactLinkSchema = z.object({
  label: z.string(),
  value: z.string(),
  href: z.string(),
  iconType: z.enum(['phone', 'email', 'location', 'linkedin', 'github', 'custom'])
});

export const TechSkillItemSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  confidenceScore: z.number().min(0).max(100),
  categoryMarker: z.string()
});

export const ExperienceItemSchema = z.object({
  entityName: z.string().min(1, 'Company/Entity is required'),
  roleTitle: z.string().min(1, 'Role title is required'),
  temporalDuration: z.string().min(1, 'Duration is required'),
  geographicLocation: z.string(),
  bulletPoints: z.array(z.string()),
  associatedTechTags: z.array(z.string())
});

export const ProjectItemSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().min(1, 'Project description is required'),
  repositoryUrl: z.string().optional().or(z.literal('')),
  metricsEvidence: z.string().min(1, 'Metrics evidence is required')
});

export const CredentialItemSchema = z.object({
  title: z.string().min(1, 'Credential title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  attainedYear: z.string()
});

export const CVContentSchema = z.object({
  candidateIdentity: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    professionalHeadline: z.string().min(1, 'Professional headline is required'),
    biographicalSummary: z.string().min(1, 'Biographical summary is required')
  }),
  communicationChannels: z.array(ContactLinkSchema),
  skillsInventory: z.array(TechSkillItemSchema),
  employmentTimeline: z.array(ExperienceItemSchema),
  projectShowcase: z.array(ProjectItemSchema),
  credentialsLibrary: z.array(CredentialItemSchema)
});

export const CVDesignConfigSchema = z.object({
  activeTemplateId: z.string(),
  typographySelection: z.string(),
  globalDensityScale: z.enum(['comfortable', 'compact']),
  colorPaletteOverrides: z.record(z.string(), z.string())
});

export const CVDocumentSchema = z.object({
  content: CVContentSchema,
  design: CVDesignConfigSchema,
  metadata: z.object({
    documentRevision: z.number(),
    lastModifiedTimestamp: z.string()
  })
});

export type CVDocument = z.infer<typeof CVDocumentSchema>;
export type CVContent = z.infer<typeof CVContentSchema>;
export type CVDesignConfig = z.infer<typeof CVDesignConfigSchema>;
export type ContactLink = z.infer<typeof ContactLinkSchema>;
export type TechSkillItem = z.infer<typeof TechSkillItemSchema>;
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;
export type ProjectItem = z.infer<typeof ProjectItemSchema>;
export type CredentialItem = z.infer<typeof CredentialItemSchema>;
