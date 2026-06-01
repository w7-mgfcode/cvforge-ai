export interface DiffChunk {
  type: 'addition' | 'deletion' | 'normal';
  text: string;
}

export interface OptimizationResult {
  original: string;
  optimized: string;
  diffs: DiffChunk[];
}

/**
 * Generates a mock word-level diff between two text blocks for side-by-side display
 */
export const computeDiff = (original: string, optimized: string): DiffChunk[] => {
  // Simple word-based difference simulation for display purposes
  const origWords = original.split(/\s+/);
  const optWords = optimized.split(/\s+/);
  
  const diffs: DiffChunk[] = [];
  
  // Custom mock diff mapper based on content matching
  if (original.includes('responsible for maintaining')) {
    // Before: Developed backend features and automated testing suites using Python, PyTest, and Django.
    // After: Engineered high-performance backend pipelines and automated test matrices utilizing Python, PyTest, and Django, boosting coverage to 94%.
    return [
      { type: 'normal', text: 'Developed ' },
      { type: 'deletion', text: 'backend features ' },
      { type: 'addition', text: 'high-performance backend pipelines ' },
      { type: 'normal', text: 'and automated ' },
      { type: 'deletion', text: 'testing suites ' },
      { type: 'addition', text: 'test matrices utilizing ' },
      { type: 'normal', text: 'using Python, PyTest, and Django' },
      { type: 'addition', text: ', boosting test coverage to 94%' },
    ];
  }

  if (original.includes('Gábor Szabó') || original.includes('GÁBOR')) {
    return [
      { type: 'normal', text: 'Senior Systems Architect and Python Engineer with ' },
      { type: 'deletion', text: '8+ years ' },
      { type: 'addition', text: '8+ years of verified ' },
      { type: 'normal', text: 'experience specializing in systems automation, high-performance API structures, and ' },
      { type: 'addition', text: 'production-ready ' },
      { type: 'normal', text: 'LLM agent pipelines using Model Context Protocol.' }
    ];
  }
  
  // Default fallback diff (shows deletion of first half, addition of second half)
  const midpoint = Math.floor(origWords.length / 2);
  diffs.push({ type: 'normal', text: origWords.slice(0, midpoint).join(' ') + ' ' });
  diffs.push({ type: 'deletion', text: origWords.slice(midpoint).join(' ') + ' ' });
  diffs.push({ type: 'addition', text: optWords.slice(midpoint).join(' ') });
  
  return diffs;
};

/**
 * Optimizes a block of text based on user instructions and target keywords
 */
export const optimizeTextSection = async (
  text: string, 
  instruction: string
): Promise<OptimizationResult> => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  let optimized = text;
  const normalizedInstruction = instruction.toLowerCase();

  if (text.includes('Developed backend features')) {
    optimized = "Engineered high-performance backend pipelines and automated test matrices utilizing Python, PyTest, and Django, boosting test coverage to 94%.";
  } else if (text.includes('Senior Systems Architect')) {
    optimized = "Senior Systems Architect and Python Engineer with 8+ years of verified experience specializing in systems automation, high-performance API structures, and production-ready LLM agent pipelines using Model Context Protocol.";
  } else if (normalizedInstruction.includes('compact') || normalizedInstruction.includes('a4')) {
    // Generic optimization
    optimized = text.replace(/responsible for/g, 'Orchestrated')
                    .replace(/helped/g, 'Facilitated')
                    .replace(/built/g, 'Architected and deployed')
                    .replace(/used/g, 'Leveraged') + " Optimized response parameters to ensure A4 compliance.";
  } else {
    // Generic optimization
    optimized = text.replace(/responsible for/g, 'Orchestrated')
                    .replace(/helped/g, 'Facilitated')
                    .replace(/built/g, 'Architected and deployed')
                    .replace(/used/g, 'Leveraged');
  }

  return {
    original: text,
    optimized,
    diffs: computeDiff(text, optimized)
  };
};

/**
 * Match CV text against job requirements and identify gap keywords
 */
export const matchJobDescription = async (
  cvText: string,
  jobDescription: string
): Promise<{ matchedSkills: string[]; missingSkills: string[]; recommendation: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const jobLower = jobDescription.toLowerCase();
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  // Keywords base to check
  const skillKeywords = [
    { key: 'mcp', label: 'Model Context Protocol (MCP)' },
    { key: 'python', label: 'Python & FastAPI' },
    { key: 'docker', label: 'Docker & Kubernetes' },
    { key: 'redis', label: 'Redis Cache' },
    { key: 'postgresql', label: 'PostgreSQL DB' },
    { key: 'ci/cd', label: 'CI/CD Pipelines' },
    { key: 'aws', label: 'AWS Cloud Architecture' },
    { key: 'langchain', label: 'LangChain Orchestration' }
  ];

  skillKeywords.forEach(skill => {
    if (jobLower.includes(skill.key)) {
      if (cvText.toLowerCase().includes(skill.key)) {
        matchedSkills.push(skill.label);
      } else {
        missingSkills.push(skill.label);
      }
    }
  });

  // Provide custom smart recommendations
  let recommendation = "Your profile is highly aligned. Consider emphasizing your Model Context Protocol credentials.";
  if (missingSkills.length > 0) {
    recommendation = `We identified missing keywords: [${missingSkills.join(', ')}]. Consider adjusting your skills inventory and adding associated tag listings in your employment timeline.`;
  }

  return {
    matchedSkills,
    missingSkills,
    recommendation
  };
};
