import { CVDocument } from '@/schemas/cv.schema';

export interface LayoutAuditReport {
  isCompliant: boolean;
  overflowPixels: number;
  warnings: string[];
  metrics: {
    totalCharCount: number;
    skillDensity: number;
    timelineBreadth: number;
    documentRevision: number;
  };
}

/**
 * Calculates page-bounds overflow in pixels.
 * A4 Page size target height: 1122px (297mm @ 96 DPI)
 */
export const calculateOverflow = (scrollHeight: number, pageCount: number): number => {
  const targetHeight = pageCount * 1122;
  return scrollHeight > targetHeight ? scrollHeight - targetHeight : 0;
};

/**
 * Performs a static analysis of the CVDocument state to evaluate layout safety
 */
export const auditDocumentData = (doc: CVDocument): LayoutAuditReport => {
  const warnings: string[] = [];
  const content = doc.content;

  // 1. Check title lengths
  if (content.candidateIdentity.fullName.length > 50) {
    warnings.push('Candidate name exceeds 50 characters; text scaling overrides may be active.');
  }

  if (content.candidateIdentity.professionalHeadline.length > 120) {
    warnings.push('Headline statement exceeds 120 characters; wrap rules might cause vertical expansion.');
  }

  // 2. Check timeline entries
  if (content.employmentTimeline.length > 5) {
    warnings.push('Timeline contains more than 5 historical records; recommended to use compact spacing scale.');
  }

  // 3. Count bullets
  let totalBullets = 0;
  content.employmentTimeline.forEach(job => {
    totalBullets += job.bulletPoints.length;
    if (job.bulletPoints.length > 5) {
      warnings.push(`Timeline entity "${job.entityName}" has ${job.bulletPoints.length} achievements; exceeding 5 points is prone to overflow.`);
    }
  });

  if (totalBullets > 18) {
    warnings.push(`Timeline contains ${totalBullets} total achievement bullets; compact spacing is recommended for print safety.`);
  }

  // Calculate metrics
  const totalCharCount = 
    content.candidateIdentity.fullName.length +
    content.candidateIdentity.professionalHeadline.length +
    content.candidateIdentity.biographicalSummary.length +
    content.employmentTimeline.reduce((acc, job) => 
      acc + job.roleTitle.length + job.entityName.length + job.bulletPoints.reduce((sum, bp) => sum + bp.length, 0)
    , 0);

  return {
    isCompliant: warnings.length === 0,
    overflowPixels: 0, // Dynamic browser height checked in LivePreviewCanvas
    warnings,
    metrics: {
      totalCharCount,
      skillDensity: content.skillsInventory.length,
      timelineBreadth: content.employmentTimeline.length,
      documentRevision: doc.metadata.documentRevision
    }
  };
};
