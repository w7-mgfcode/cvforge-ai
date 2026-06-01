import { CVDocument } from '@/schemas/cv.schema';

export const sampleCV: CVDocument = {
  content: {
    candidateIdentity: {
      fullName: "GÁBOR SZABÓ",
      professionalHeadline: "Python Developer | Production-Ready LLM Agents",
      biographicalSummary: "Senior Systems Architect and Python Engineer with 8+ years of experience specializing in systems automation, high-performance API structures, and production-ready LLM agent pipelines using Model Context Protocol."
    },
    communicationChannels: [
      {
        label: "Phone",
        value: "+36 70 391 6747",
        href: "tel:+36703916747",
        iconType: "phone"
      },
      {
        label: "Email",
        value: "saborobag@gmail.com",
        href: "mailto:saborobag@gmail.com",
        iconType: "email"
      },
      {
        label: "Location",
        value: "Budapest, Hungary",
        href: "https://maps.google.com/?q=Budapest",
        iconType: "location"
      },
      {
        label: "GitHub",
        value: "github.com/w7-mgfcode",
        href: "https://github.com/w7-mgfcode",
        iconType: "github"
      },
      {
        label: "LinkedIn",
        value: "linkedin.com/in/gabor-szabo-sys",
        href: "https://linkedin.com",
        iconType: "linkedin"
      }
    ],
    skillsInventory: [
      {
        name: "Model Context Protocol",
        confidenceScore: 92,
        categoryMarker: "AI & Agentic Systems"
      },
      {
        name: "Python & FastAPI",
        confidenceScore: 95,
        categoryMarker: "Backend Development"
      },
      {
        name: "LLM Orchestration & LangChain",
        confidenceScore: 88,
        categoryMarker: "AI & Agentic Systems"
      },
      {
        name: "Docker & Kubernetes",
        confidenceScore: 85,
        categoryMarker: "Cloud & DevOps"
      },
      {
        name: "PostgreSQL & Redis",
        confidenceScore: 90,
        categoryMarker: "Databases & Caching"
      },
      {
        name: "CI/CD & GitHub Actions",
        confidenceScore: 87,
        categoryMarker: "Cloud & DevOps"
      }
    ],
    employmentTimeline: [
      {
        entityName: "ForecastLabAI",
        roleTitle: "Senior Python Developer",
        temporalDuration: "2024 - Present",
        geographicLocation: "Budapest, Hungary (Remote)",
        bulletPoints: [
          "Architected and deployed production-ready LLM agent systems integrating custom Model Context Protocol (MCP) servers.",
          "Optimized systems automation backend using FastAPI and Redis, cutting job queue processing times by 40%.",
          "Led a team of 3 developers in building data-scraping pipelines that ingest unstructured financial reports into clean JSON vectors."
        ],
        associatedTechTags: ["Python", "FastAPI", "MCP", "Redis", "LangChain"]
      },
      {
        entityName: "AutomationFlow Corp",
        roleTitle: "Systems Integration Engineer",
        temporalDuration: "2021 - 2024",
        geographicLocation: "Budapest, Hungary",
        bulletPoints: [
          "Built custom CI/CD automation workflows and orchestration scripts, saving 15 engineering hours weekly.",
          "Integrated high-load telemetry databases in PostgreSQL, managing 5M+ daily requests with 99.9% uptime.",
          "Refactored legacy Monolith architectures into Dockerized microservices."
        ],
        associatedTechTags: ["Docker", "PostgreSQL", "CI/CD", "Python", "Kubernetes"]
      },
      {
        entityName: "TechGrid Solutions",
        roleTitle: "Software Developer",
        temporalDuration: "2018 - 2021",
        geographicLocation: "Szeged, Hungary",
        bulletPoints: [
          "Developed backend features and automated testing suites using Python, PyTest, and Django.",
          "Collaborated with design teams to translate UI/UX Figma assets into modular HTML/CSS views.",
          "Maintained database replication pipelines and optimized SQL queries."
        ],
        associatedTechTags: ["Python", "Django", "SQL", "Docker", "Git"]
      }
    ],
    projectShowcase: [
      {
        title: "Model Context Protocol Server Hub",
        description: "Open-source MCP servers enabling secure file system reads, automated command line executions, and external tool integrations.",
        repositoryUrl: "https://github.com/w7-mgfcode/mcp-server-hub",
        metricsEvidence: "Used by 120+ developers; standard MCP integration"
      },
      {
        title: "LLM Agentic Document Parser",
        description: "A localized pipeline that isolates document text nodes, feeds clean chunks to semantic models, and validates parsed schemas.",
        repositoryUrl: "https://github.com/w7-mgfcode/llm-doc-parser",
        metricsEvidence: "99.2% parsing accuracy on multi-page PDF documents"
      }
    ],
    credentialsLibrary: [
      {
        title: "Model Context Protocol: Advanced Topics",
        issuer: "AI Developer Guild",
        attainedYear: "2026"
      },
      {
        title: "Certified Kubernetes Administrator (CKA)",
        issuer: "The Linux Foundation",
        attainedYear: "2023"
      },
      {
        title: "Python Senior Developer Specialist",
        issuer: "Python Software Foundation Affiliate",
        attainedYear: "2020"
      }
    ]
  },
  design: {
    activeTemplateId: "dossier",
    typographySelection: "Montserrat",
    globalDensityScale: "comfortable",
    colorPaletteOverrides: {}
  },
  metadata: {
    documentRevision: 1,
    lastModifiedTimestamp: "2026-06-01T07:00:00Z"
  }
};
