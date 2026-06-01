# PRODUCT DEVELOPMENT COMPREHENSIVE ARCHITECTURE CONTEXT

## WORKFLOWCV STUDIO (CVFORGE AI)

---

## 1. Executive Summary

WorkflowCV Studio (CVForge AI) is a portfolio-grade, production-ready AI engineering web application designed to demonstrate the conversion of unstructured, ambiguous career information into clean, design-system-driven, print-ready CV artifacts. Moving beyond traditional form-filling resume generators, this platform operates as a specialized design studio that treats resumes as structured documents decoupled into three distinct layers: data schema, visual design tokens, and layout compilation logic.

The technical architecture provides an interactive workspace featuring a live, print-accurate A4 canvas, a declarative design engine, a localized templatization pipeline, and an explainable AI assistant subsystem. Built using Next.js, React, TypeScript, and Tailwind CSS, the platform showcases repository-level discipline and Vercel-ready deployment configurations optimized for automated frontend pipelines.

---

## 2. Product Vision

The core mission of WorkflowCV Studio is to prove that highly styling-sensitive, variable-length personal information can be parsed, structured, and rendered onto strict physical page constraints without data truncation, overflow degradation, or visual inconsistency. By treating existing premium CV designs as concrete artifacts to be reverse-engineered, the platform introduces the concept of **Document Templatization**. It serves as a visual testament to advanced context engineering, schema enforcement, and precise layout-to-print compilation rules.

```
+---------------------------------------------------------------------------------+
|                                 WorkflowCV Studio                               |
+---------------------------------------------------------------------------------+
|  [Workflow Nav]  |            [Center Active Work Surface]          | [Controls] |
|                  |                                                  |            |
|  ( ) Raw Content |  +--------------------------------------------+  |  [Design]  |
|  ( ) Schema view |  | Page 1 (A4 Strict Bounds)                  |  |  Tokens    |
|  (x) Design Lab  |  | +----------------------------------------+ |  |  Spacing   |
|  ( ) Print Audit |  | | Header Element                         | |  |  Density   |
|                  |  | +----------------------------------------+ |  +------------+
|  [AI Workspace]  |  | | Left Column      | Right Column        | |  | [AI Tools] |
|  > Context Frame |  | | Metrics          | Summary             | |  | Optimize   |
|  > Critique Pass |  | | Skill Bars       | Experience          | |  | Tailor Job |
|  > Diff Review   |  | +------------------+---------------------+ |  | Match Keys |
|                  |  +--------------------------------------------+  |            |
+---------------------------------------------------------------------------------+

```

---

## 3. Target Users & Personas

### Persona Matrix

The application handles multi-layered end-user workflows across four target profiles:

| Persona | Primary Goal | Pain Point | Feature Need | Success Moment |
| --- | --- | --- | --- | --- |
| **Technical Candidate** | Generate a dense, high-credibility portfolio resume highlighting source repositories and certified cloud metrics. | Layouts break when adding technical tag arrays; poor print margins clip text. | Dynamic grid components for repository evidence and automated print boundary tests. | Exporting a pixel-perfect, 3-page A4 engineering dossier where no sections overflow. |
| **AI Workflows Engineer** | Showcase specialized prompt strategies, schema-first architectures, and strict pipeline compliance. | Existing builders rely on opaque, non-deterministic chat boxes that break formats. | Transparent prompt execution logs and a sandbox view tracking data mutations. | Reviewing a structured JSON serialization trace map transforming raw text into schemas. |
| **Recruitment Helper** | Maintain a clean, scalable library of target job profiles and reusable template wireframes. | Redoing typography scales and padding grids manually for different job applications. | Global design token sliders and dynamic layout variants. | Instantly switching an executive profile from a dense multi-column look to a cleanATS hybrid layout. |
| **Design-Driven Dev** | Control layout structures using source-managed code files without writing custom CSS overrides. | Opaque template builders that hide baseline grids and use absolute positioning elements. | Clear separation of `Content`, `Design`, and `Metadata` layers. | Extending the schema using TypeScript and observing automated component updates. |

---

## 4. Core Use Cases

* **UC-1: Reverse-Engineering Legacy Documents:** A user uploads or pastes raw, mixed-language resume structures (such as Gábor Szabó's 2026 systems automation portfolio documents). The platform maps these values into a validated JSON schema without losing data properties.
* **UC-2: Print-Optimized Layout Synthesis:** A user selects a dense layout structure (e.g., Executive Technical Dossier). The layout processor scales spacing rules dynamically, calculates height parameters, and checks element contrast before running the system print driver.
* **UC-3: Factual AI Tailoring Loop:** A user applies the built-in AI panel to adapt an experience timeline for a target job description. The engine scans the input, updates phrasing metrics, identifies missing project code repositories, and outputs a clear before-and-after change log.
* **UC-4: Design Token Propagation:** A user alters global layout properties (e.g., changing standard section padding from `16px` to `12px` or altering accent color weight) via the right-side control center. The layout shifts instantly across the A4 render surface using standard CSS variables.

---

## 5. Templatization Theory

The foundational architecture of this platform relies on the strict principle of **Document Templatization**. Traditional document management applications blend layout metadata, stylistic presentation rules, and textual values into a single unstructured data container. When structural layout files change, personal content attributes get lost or scrambled.

```
+-----------------------------------------------------------------------------+
| LEGACY ARCHITECTURE (Tightly Coupled)                                       |
| Content String + Inline CSS Weights + Position Anchors = Single Opaque File |
+-----------------------------------------------------------------------------+
                                      ▼
+-----------------------------------------------------------------------------+
| TEMPLATIZATION ARCHITECTURE (Decoupled Layering)                             |
| [Content Schema (Pure JSON)] + [Design Tokens (CSS Vars)] = Render Engine   |
+-----------------------------------------------------------------------------+

```

Templatization extracts style metadata from content arrays, turning specific personal details into abstract functional nodes. A concrete data node (e.g., `"Gábor Szabó"`) becomes a template key (`{{candidate.fullName}}`) tied to strict placeholder properties and filling rules.

### Layer Separation Architecture

* **The Content Layer:** Standardized JSON objects containing verifiable history items, link arrays, tech skill matrices, and baseline credentials. It remains unaware of typography selections, base grid heights, column layouts, or color rules.
* **The Design Layer:** A system schema defining component density scales, primary/secondary style sets, layout grid parameters, page margins, and fonts. It maps values onto underlying CSS custom properties.
* **The Metadata Layer:** Operational configuration states storing runtime variables like target print output dimensions (e.g., standard A4 or US Letter), explicit layout validation warnings, and tracking records for changes made by the AI engine.

---

## 6. Reverse-Engineered Template System

Using the source documents of Gábor Szabó as input models, the application breaks down concrete elements into system placeholders, content instructions, and formatting tokens:

### Transformation Logic Mapping Table

| Concrete Input Value | Extracted Structural Schema Key | Automated Filling Instruction | Target UI/Print token Constraints |
| --- | --- | --- | --- |
| **"GÁBOR SZABÓ"**<br> | `candidate.fullName` | Enter the candidate’s full legal or professional name. Render using uppercase styling rules only if required by the layout. | Max length: 50 characters. Scale down font size dynamically if value overflows header cell box. |
| **"Python Developer | Production-Ready LLM Agents"**<br> | `candidate.headline` | Write a single-line positioning statement optimized for the role. Group core strengths using a pipe separator (`|`). | Max length: 120 characters. Prevent text wrapping on page header element. |
| **"Model Context Protocol — 92%"**<br> | `skills[n].name`, `skills[n].level` | Use skill scores as visual indicators of confidence, not as certifications. Use with care to maintain accurate descriptions. | Map percentage integers directly to CSS layout width values (`style={{ width: '${level}%' }}`). |
| **"ForecastLabAI..."** | `portfolioProjects[n].title`, `portfolioProjects[n].description` | Outline the platform architecture as concrete proof of skill. State the exact tech stack used and include public repository paths. | Prevent internal page breaks inside card layout wrappers (`page-break-inside: avoid`). |
| **"+36 70 391 6747"** | `contact.phone` | Enter valid international contact numbers including country codes. | Validate matching format expressions; use standard vector icon glyphs for display grid. |
| **"saborobag@gmail.com"** | `contact.email` | Store candidate's primary electronic mail address. | Must validate via internet standard email expressions; generate system protocol action anchors (`mailto:`). |
| **"[github.com/w7-mgfcode]()"** | `links.github` | Public reference path linking directly to source repository footprint tracks. | Enforce link verification rules; ensure safe destination anchor target attributes (`target="_blank"`). |
| **"Model Context Protocol: Advanced Topics"** | `certifications[n].name` | Exact verified title of professional qualification credential achieved by candidate. | Group items into multi-column sub-grids; style typography sub-elements uniformly. |

---

## 7. Feature Map

```
                     +---------------------------+
                     |    WorkflowCV Studio      |
                     +-------------+-------------+
                                   |
       +---------------------------+---------------------------+
       |                           |                           |
+------v------+             +------v------+             +------v------+
| Live Canvas |             | Data Editor |             | Design Panel|
+-------------+             +-------------+             +-------------+
| Page Guides |             | Form Inputs |             | Token Engine|
| Zoom Layer  |             | JSON View   |             | Color System|
| Audit Box   |             | Schema Guard|             | Density Map |
+-------------+             +-------------+             +-------------+
       |                           |                           |
       +---------------------------+---------------------------+
                                   |
       +---------------------------+---------------------------+
       |                           |                           |
+------v------+             +------v------+             +------v------+
| AI Lab Workspace          | Export Hub  |             | Portfolio Layer
+-------------+             +-------------+             +-------------+
| Optimization|             | PDF Target  |             | Architecture|
| Diff Tracker|             | Layout Audit|             | Case Studies|
| Safe Filter |             | Sizing Check|             | Token Logs  |
+-------------+             +-------------+             +-------------+

```

### Module Breakdown

* **A. Live CV Canvas:** Displays a layout preview mimicking exact physical A4 paper bounds ($210\text{mm} \times 297\text{mm}$). Features active layout markers, interactive spacing lines, zoom adjustment scales ($50\%$ to $150\%$), and dynamic cross-page flow monitors.
* **B. Structured Data Editor:** A multi-step input panel backed by validation schemas. Includes field management loops, inline text formatting toggles, and live text parsers that update data structures without page refreshes.
* **C. Design Control Panel:** Provides structural management inputs allowing users to override baseline visual properties. Includes system font selectors, section spacing maps, padding controls, color theme swatches, and global layout options.
* **D. AI Assistant Panel:** An advanced processing component that handles content optimization tasks. Includes action-verb translators, job requirement alignment matching tools, and clear text comparison views.
* **E. Templatization Lab:** A specialized visual dashboard mapping out data extraction phases. Displays the transformation pipeline from raw resume strings into structured schema trees, placeholder nodes, and compiled layouts.
* **F. Design System Zone / Stitch Integration:** Synchronizes global visual controls with file storage pipelines. Exports project style parameters directly to design system files (`DESIGN.md`) used by automated agent processes.
* **G. Export / Print Center:** Manages generation parameters for physical outputs. Triggers the browser's printing subsystem with optimized print styles and checks layouts for page overflow bugs before exporting.
* **H. Portfolio Evidence Page:** A public dashboard showcasing system architecture parameters, development notes, tool integration strategies, and the design decisions behind the platform.

---

## 8. MVP Scope

The Initial Minimum Viable Product focuses on delivering a robust, single-repository client application that includes the core templatization pipeline and handles production-grade document rendering tasks:

* **Data Models:** Full TypeScript/Zod structures covering the decoupled personal context layers.
* **Template Support:** Three distinct responsive structural system components:
1. *Executive Technical Dossier:* Multi-page timeline layout featuring dedicated metric bars.
2. *Clean ATS Hybrid:* Minimal single-column style optimized for automated applicant processing loops.
3. *Visual AI Portfolio:* A modern layout using highlight card containers for cloud architectural evidence.
* **Editing Interface:** Interactive split-screen panel showing input forms on the left and a live A4 preview canvas on the right.
* **Design Controls:** Primary style variables exposed via standard design token controls (font sizes, padding depths, column balance parameters).
* **AI Tooling:** Local mock-based processing system supporting key features like text improvement and structural data mapping.
* **Print Subsystem:** Production-grade CSS print rules with custom page-break controls optimized for Chromium engines.

---

## 9. Post-MVP Roadmap

Following initial validation phases, development targets high-scale extension objectives:

* **Phase 2: Database Persistence Integration:** Introduce multi-tenant database integration (Supabase/PostgreSQL) with user authentication, secure asset storage pipelines, and active document change tracking systems.
* **Phase 3: Live Model Integrations:** Replace simulated AI tasks with production endpoints (OpenAI API / Gemini SDK) featuring token stream processing and automated verification prompts.
* **Phase 4: Automated Testing Pipelines:** Deploy automated visual regression tests (Playwright) that scan output components at multiple zoom depths to detect print overflow bugs.
* **Phase 5: Dynamic Canvas Interactions:** Add direct click-to-edit typography wrappers and drag-and-drop handles for reordering document sections straight on the preview surface.

---

## 10. Information Architecture

The application runs as a modern single-page workflow workspace with a unified state structure:

```
[ App Root Context Router ]
  ├── /studio - Core Workspace Route
  │     ├── Left Workflow Navigation Bar
  │     │     ├── Workspace Editor Active State
  │     │     ├── Templatization Lab Dashboard Active State
  │     │     └── Architectural Analytics Panel Active State
  │     │
  │     ├── Center Workspace Render Grid
  │     │     └── A4 Document Container Element [Calculated Size Guide]
  │     │           ├── Layout Wrapper Directive [ATS / Dossier / Visual]
  │     │           └── Page Canvas Partitions [1..n Pages with Target Height Breaks]
  │     │
  │     └── Right Global Control Sidebar Drawer
  │           ├── Tab A: Structural Content Input Layout Controls
  │           ├── Tab B: Visual System Property Value Swatches (Tokens)
  │           └── Tab C: AI Copilot System Interaction Logs
  │
  └── /evidence - Public Portfolio Documentation Dashboard

```

---

## 11. UI/UX Design Direction

The interface uses a highly polished dark-mode workspace wrapper contrasting with a clean, light-mode document rendering area to mimic real-world design studio environments:

* **App Workspace Canvas:** Premium deep-slate base layout layer (`#0F172A`) highlighted with cool slate secondary accents (`#1E293B`).
* **Document Preview Layer:** Pure white background containers (`#FFFFFF`) utilizing dark neutral text (`#1E293B`) to ensure maximum visual contrast and meet strict accessibility standards.
* **Platform System Accents:** High-credibility engineering accents (electric indigo `#2563EB`) paired with safety highlights inspired by reference resume layouts (orange tones `#EA580C`).
* **Interface Layout Grid:** Balanced arrangement with clear navigation sidebars, center workspace areas, and flexible control properties to ensure clear hierarchy.

---

## 12. Design Tokens

### Color Tokens Matrix

```json
{
  "theme": {
    "workspace": {
      "bg-primary": "#0F172A",
      "bg-secondary": "#1E293B",
      "border-muted": "#334155",
      "accent-blue": "#2563EB"
    },
    "document": {
      "palette-dossier": {
        "primary-slate": "#0F172A",
        "secondary-blue": "#1E3A8A",
        "accent-orange": "#EA580C",
        "text-main": "#1E293B",
        "text-muted": "#475569",
        "bg-light": "#F8FAFC",
        "bg-tint": "#F0F4F8",
        "border-color": "#E2E8F0"
      }
    }
  }
}

```

### Layout and Spatial Densities

* **Canvas Page Height Boundaries:** Fixed sizing targets ($297\text{mm}$ or exactly $1122\text{px}$ based on a baseline $96\text{DPI}$ render profile).
* **Typography Scale Properties:** Primary headings styled at `24pt`, section structural dividers at `11pt`, content blocks at `8.5pt`, and footer notes at `7pt`.
* **Density Mapping Presets:**
* *Comfortable:* Content row padding set to `16px`, margins at `24px`, item rows separated by `12px`.
* *Compact:* Padding condensed to `10px`, margins to `16px`, items rows separated by `6px`.

---

## 13. DESIGN.md Draft

This declaration acts as the primary layout configuration file for design agent workflows:

```markdown
# DESIGN SYSTEM DEFINITION (DOCUMENT ARCHITECTURE)

## Visual Standards Baseline
* Design Philosophy: Editorial engineering design system maximizing data density without visual confusion.
* Core Colors: Deep Slate (#0F172A), Navy Blue (#1E3A8A), Vivid Orange (#EA580C) indicators.
* Typography Base: Primary rendering family Montserrat, fallback Sans-Serif.

## Layout Configuration Variables
* Base Sizing Guide: Standard A4 ($210mm \times 297mm$), zero print crop bleed vectors.
* Column Layout Profiles: Left Column side rail mapped to 33% width footprint, Main Right Column content rail consuming 67% area.

## Structural Validation Directives
* Sizing Overflow Protections: Element overflow clipping triggers a warning to the user; text must scale down or move safely to the next canvas page container.
* Media Query Print Rules: When executing background printing, strip out all interface elements and display only the target document container.
```

---

## 14. Data Schema Proposal

The underlying application data model is managed via a strict, split-column TypeScript object structure using Zod syntax for automated runtime enforcement:

```typescript
import { z } from 'zod';

export const ContactLinkSchema = z.object({
  label: z.string(),
  value: z.string(),
  href: z.string().url(),
  iconType: z.enum(['phone', 'email', 'location', 'linkedin', 'github', 'custom'])
});

export const TechSkillItemSchema = z.object({
  name: z.string().min(1),
  confidenceScore: z.number().min(0).max(100),
  categoryMarker: z.string()
});

export const ExperienceItemSchema = z.object({
  entityName: z.string().min(1),
  roleTitle: z.string().min(1),
  temporalDuration: z.string(),
  geographicLocation: z.string(),
  bulletPoints: z.array(z.string()),
  associatedTechTags: z.array(z.string())
});

export const CVContentSchema = z.object({
  candidateIdentity: z.object({
    fullName: z.string().min(1),
    professionalHeadline: z.string().min(1),
    biographicalSummary: z.string().min(1)
  }),
  communicationChannels: z.array(ContactLinkSchema),
  skillsInventory: z.array(TechSkillItemSchema),
  employmentTimeline: z.array(ExperienceItemSchema),
  projectShowcase: z.array(z.object({
    title: z.string(),
    description: z.string(),
    repositoryUrl: z.string().url().optional(),
    metricsEvidence: z.string()
  })),
  credentialsLibrary: z.array(z.object({
    title: z.string(),
    issuer: z.string(),
    attainedYear: z.string()
  }))
});

export const CVDesignConfigSchema = z.object({
  activeTemplateId: z.string(),
  typographySelection: z.string(),
  globalDensityScale: z.enum(['comfortable', 'compact']),
  colorPaletteOverrides: z.record(z.string())
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

```

---

## 15. Template Engine Proposal

The platform's template engine functions as a pure presentation layer that accepts validated data schemas and maps them onto structured React layout components.

```
             +-----------------------------------------+
             |       Template Registry Manager         |
             +--------------------+--------------------+
                                  |
         +------------------------+------------------------+
         |                        |                        |
+--------v--------+      +--------v--------+      +--------v--------+
| Technical Engine|      |ATS Hybrid Engine|      | Visual AI Engine|
+-----------------+      +-----------------+      +-----------------+
| Left Side Rail  |      | Clean Full Width|      | Highlight Cards |
| Dynamic Metrics |      | Tabular Timeline|      | Project Grids   |
| Multi-Page Grid |      | Simple Dividers |      | Dark Accents    |
+-----------------+      +-----------------+      +-----------------+

```

### Pure Function Implementation Example

```tsx
interface TemplateRendererProps {
  documentData: z.infer<typeof CVDocumentSchema>;
}

export const ExecutiveTechnicalDossierTemplate: React.FC<TemplateRendererProps> = ({ documentData }) => {
  const { content, design } = documentData;
  
  return (
    <div className={`a4-page-context font-${design.typographySelection} layout-dossier density-${design.globalDensityScale}`}>
      {/* Document Header Partition Block */}
      <header className="header-element-wrapper">
        <div className="header-left-rail">
          <h1>{content.candidateIdentity.fullName}</h1>
          <h2>{content.candidateIdentity.professionalHeadline}</h2>
        </div>
        <div className="header-right-contact-card">
          {content.communicationChannels.map((channel, index) => (
            <div key={index} className="contact-row-node">
              <span className="icon-marker">{channel.label}</span>
              <a href={channel.href} target="_blank" rel="noreferrer">{channel.value}</a>
            </div>
          ))}
        </div>
      </header>

      {/* Primary Structural Grid */}
      <main className="main-content-layout-body">
        <aside className="left-side-rail-column">
          <section className="skills-inventory-block">
            <h3>Technical Metrics</h3>
            {content.skillsInventory.map((skill, index) => (
              <div key={index} className="skill-progress-bar-wrapper">
                <div className="skill-label-text">{skill.name}</div>
                <div className="bar-outer-track">
                  <div className="bar-inner-fill" style={{ width: `${skill.confidenceScore}%` }} />
                </div>
              </div>
            ))}
          </section>
        </aside>

        <section className="right-main-content-column">
          <section className="summary-abstract-box">
            <p>{content.candidateIdentity.biographicalSummary}</p>
          </section>
          {/* Loop over structural historical timelines safely */}
        </section>
      </main>
    </div>
  );
};

```

---

## 16. AI Assistant Workflow Design

To prevent opaque text generation and handle content adjustments safely, the AI panel implements a structured execution process:

```
[ User Action: Optimize text ] ──> [ Content Frame Isolation ] 
                                           │
[ Review / Commit Output ] <── [ Interactive Diff Display ] <── [ Safety Filter Analysis ]

```

### Safety and Validation Guardrails

* **Factual Content Lock:** The engine uses strict system prompts that prevent it from inventing or modifying foundational data points such as employment dates, job titles, institutions, or project results.
* **Factual Humility Enforcement:** The module analyzes text inputs for inflated claims and flags phrases that cannot be verified against source material.
* **Interactive Comparison View:** Edits are presented in side-by-side comparison tables, allowing users to review and approve all content updates before changes are committed.

---

## 17. Print-Ready Architecture

Achieving true print optimization requires applying absolute dimensional constraints to browser-driven styling processes:

```css
/* Core Styling Rules for Print Layouts */
@media print {
  body {
    background-color: #ffffff !important;
    color: #000000 !important;
    padding: 0 !important;
    margin: 0 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Strip all user interface elements during generation */
  .app-navigation-sidebar,
  .control-drawer-sidebar,
  .action-toast-notifications,
  .canvas-zoom-controls-toolbar {
    display: none !important;
  }

  .container-canvas-wrapper {
    width: 210mm !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
  }
}

@page {
  size: A4;
  margin: 0;
}

.a4-page-partition {
  width: 210mm;
  height: 296mm;
  overflow: hidden;
  box-sizing: border-box;
  page-break-after: always;
  page-break-inside: avoid;
  display: flex;
  flex-direction: column;
}

```

### Layout Checker Subsystem

The layout component tracks element usage across page boundaries using DOM node visibility loops. If computed layout heights exceed standard multi-page limits ($1122\text{px}$ per A4 container block), the layout checker alerts the user via a status panel:

```
+-------------------------------------------------------------------------+
| [!] PRINT COMPLIANCE ALERT: Sizing Overflow Detected on Page Container 2|
| > Content layer elements currently extend 42px past print safety line.  |
| [ Action: Tighten Spacing Density ]   [ Action: Edit Text Block Size ]  |
+-------------------------------------------------------------------------+

```

---

## 18. GitHub Repository Structure

```
cvforge-ai/
├── README.md                          # Application Setup Guide
├── DESIGN.md                          # Design Tokens Definition File
├── PROJECT_CONTEXT.md                 # Product Framework Definitions
├── ARCHITECTURE.md                    # Core Technical Architecture Blueprints
├── TEMPLATE_ENGINE.md                 # Layout Rendering Instructions
├── AI_WORKFLOW.md                     # AI Panel Interface Guidelines
├── PRINT_READINESS.md                 # Document Print Requirements Guide
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── src/
│   ├── app/                           # Next.js Application Architecture Routing
│   │   ├── layout.tsx                 # Base Layout Setup
│   │   ├── page.tsx                   # Product Landing Page Interface Component
│   │   ├── studio/                    # Unified Core Editing Workspace
│   │   │   └── page.tsx               # Main Workspace Container Component
│   │   └── evidence/                  # Public Technical Documentation Layer
│   │       └── page.tsx               # System Metrics Showcase Component
│   ├── components/                    # Modular Interface Blocks
│   │   ├── canvas/                    # A4 Render Workspace Elements
│   │   │   ├── PageContainer.tsx      # Handles Strict Dimensional Sizing Tasks
│   │   │   └── LivePreviewCanvas.tsx  # Layout Compilation Module
│   │   ├── editor/                    # Standard Data Form Modules
│   │   │   ├── BaseProfileForm.tsx    # General Candidate Identity Fields
│   │   │   └── ExperienceForm.tsx     # Handles Historical Timeline Inputs
│   │   ├── design-panel/              # Structural Visual Adjusters
│   │   │   └── TokenControlPanel.tsx  # Dynamic Style Property Sliders
│   │   ├── ai-assistant/              # Optimization Workspace Blocks
│   │   │   └── CopilotDiffPanel.tsx   # Text Comparison Interfaces
│   │   ├── template-lab/              # Templatization Visualization Elements
│   │   │   └── ParserGraphView.tsx    # Step-by-Step Data Graph Dashboards
│   │   └── ui/                        # Low-Level shadcn Presentation Elements
│   ├── data/                          # Seed Content Storage Layer
│   │   ├── sample-cv.ts               # Default Candidate Context Record (Gábor Szabó)
│   │   └── templates/                 # Layout Rendering Modules Registry
│   ├── schemas/                       # Automated Contract Guards
│   │   └── cv.schema.ts               # Complete Framework Validation Rules
│   ├── lib/                           # Underlying Utility Libraries
│   │   ├── template-engine.ts         # Pure Layout Mapping Utilities
│   │   ├── print-validator.ts         # Size and Overflow Checking Calculators
│   │   └── ai/                        # Internal Mock API Core Controllers
│   └── styles/                        # Unified Styling Directives
│       ├── globals.css                # Standard Base Styles Definition
│       └── print.css                  # Print Layout Formatter Rules
└── public/
    └── assets/                        # Shared Static Visual Resources

```

---

## 19. Vercel Deployment Plan

The frontend repository is optimized for quick hosting deployment using Vercel workflows connected directly to GitHub repositories:

```
[ Git Push to GitHub main branch ]
               │
               ▼
[ Vercel Pipeline Triggered ]
               │
               ├──> Execution Loop: npm run build (Runs Next.js Static Optimization)
               ├──> Type Guarding: tsc --noEmit Validation Pass
               └──> Formatter Verification: Next.js Linter Checks
               │
               ▼
[ Production Release Generated ] ──> Edge Infrastructure Matrix Activated

```

### Static Build Optimization Variables

* **Static Asset Output Optimization:** The layout configuration forces static export builds (`output: 'export'`) for simple client architectures or sets up server-side execution paths when managing complex token routes.
* **Asset Management Strategy:** Image dependencies are handled via optimized rendering frameworks or bundled as inline vector blocks to ensure instant loading.

---

## 20. Testing & Validation Strategy

The application maintains production reliability using a multi-tiered automated verification matrix:

```
+--------------------------------------------------------------------------+
| TEST SUITE HIERARCHY                                                     |
+--------------------------------------------------------------------------+
| 1. Structural Schema Unit Testing (Zod Validation Bounds Check)          |
|    └─ Output target: Validate string parsing integrity                   |
|                                                                          |
| 2. Visual Regression Audit Routines (Playwright Layout Check)            |
|    └─ Output target: Validate page elements do not trigger overflows     |
|                                                                          |
| 3. Print Subsystem Content Verification Run                              |
|    └─ Output target: Confirm proper layout styling inside print contexts |
+--------------------------------------------------------------------------+

```

* **Zod Schema Unit Tests:** Validate that input parsers correctly process messy data objects and drop incomplete content properties before data reaches layout rendering steps.
* **Playwright Visual Audits:** Automate workspace viewport rendering tasks at multiple viewport widths to confirm layout stability and catch alignment errors.
* **Print Simulation Tests:** Mock standard device print layouts inside test environments to check that text containers stay inside safe page bounding boxes.

---

## 21. Recruiter Portfolio Storytelling Layer

To function as an effective professional showcase, the application includes a visible technical analytics view. Recruiters can toggle an interactive debug layer that transforms the clean design studio into an architectural case study:

```
+-------------------------------------------------------------------------+
| [ ARCHITECTURE HUD ] TYPE: Nex.js Static Framework Core                 |
| Data Integrity State: Schema Validated via Zod Rules  [ 100% Secure ]   |
| CSS Print Strategy: Mapped via Media Print Overrides  [ Verified ]     |
| Context Ingestion Flow: Unstructured Data Block ──> Schema Parser JSON  |
+-------------------------------------------------------------------------+

```

This presentation layout highlights your technical decisions, showing skills in state isolation, cross-platform design layout systems, explicit data parsing, and clean repository structures.

---

## 22. Stitch Prompt Pack

These contextual prompt sets guide design agent workflows when modifying workspace modules:

### 1. Main Landing Page Layout Generation

```text
Context Flag: Mapped to / route base structure view layout layer
Design Target: Build an authoritative, design-focused marketing showcase page for WorkflowCV Studio. 
Visual Theme Constraints: Deep-slate workspace background canvas configuration, crisp white preview card graphics containers, minimalist vector layout typography markers.
Functional Core: Display clear step-by-step processing animations illustrating the document templatization pipeline. Include direct interactive links pointing to the core editing workspace.

```

### 2. Main Studio Workflow Canvas Interface

```text
Context Flag: Mapped to /studio core editing page layer workspace
Design Target: Layout a production-ready application workspace layout split partition grid.
Visual Theme Constraints: Left rail input navigation dashboard elements, absolute center display grid showing the target A4 canvas bounds, right rail adjustment sidebar containing layout property swatches.
Functional Core: Connect the form control components directly to the document state router. Ensure the live preview canvas updates instantly as values are modified.

```

---

## 23. Antigravity Execution Plan

When running within automated execution spaces like Google Antigravity 2.0, the layout processor uses a precise multi-phase construction plan to avoid code conflicts:

```
+-------------------------------------------------------------------------+
| ANTIGRAVITY INITIALIZATION SEQUENCE                                     |
+-------------------------------------------------------------------------+
| Phase 1: Initialize documentation definitions and design system values  |
|          (PROJECT_CONTEXT.md, DESIGN.md)                                |
|                                                                         |
| Phase 2: Setup foundational type definitions and parsing rules         |
|          (cv.schema.ts)                                                 |
|                                                                         |
| Phase 3: Construct core data engine layers and output render wrappers   |
|          (template-engine.ts, print.css)                                |
|                                                                         |
| Phase 4: Build user-facing workspace views and connection hooks         |
+-------------------------------------------------------------------------+

```

---

## 24. First 10 Development Tasks

These discrete, actionable task cards guide initial implementation phases:

1. **Task 1 — Setup Repository Boilerplate:** Create the system repository architecture using modern Next.js and TypeScript project initializers.
2. **Task 2 — Schema Validation Layer:** Add the Zod contract guards file (`src/schemas/cv.schema.ts`) to validate content inputs.
3. **Task 3 — Seed Context Payload:** Build out the seed data structures using real-world asset references (`src/data/sample-cv.ts`).
4. **Task 4 — Global Global Typography Profiles:** Implement the foundational styling directives (`src/styles/globals.css`) and design token variable mappings.
5. **Task 5 — Strict A4 Page Container Wrapper:** Create the base structural page-frame component enforcing strict physical layout parameters.
6. **Task 6 — Dossier Template Component:** Build out the Executive Technical Dossier layout engine mapping values onto split-column views.
7. **Task 7 — Clean Input Form Grid:** Assemble the interactive form panel updating context data elements via standard field loops.
8. **Task 8 — Media Print Integration Stylesheet:** Create the specific print formatting stylesheet (`src/styles/print.css`) with page-break overrides.
9. **Task 9 — Simulated AI Editing Interface:** Wire up the text optimization sidebar component featuring clear mock-driven before-and-after text comparison grids.
10. **Task 10 — Verification Pipeline Deployment:** Link the codebase framework onto Vercel integration hooks to ensure automated production build testing.

---

## 25. Definition of Done

A development sprint checkpoint is completed only when meeting all quality criteria:

* **Type Safety Enforcement:** The build script completes successfully without TypeScript errors or validation warnings (`tsc --noEmit` pass).
* **Schema Validity Proof:** Input parsers process nested data values safely and handle missing properties cleanly without runtime exceptions.
* **Print Presentation Layout Success:** The output document prints perfectly on standard A4 layout surfaces without clipped items or unwanted page overflows.
* **Visual Contrast Adherence:** Text readability scores pass baseline accessibility tests on both interface surfaces and light document previews.
* **Repository Structural Cleanliness:** Component files are organized cleanly within appropriate feature folders, avoiding tightly coupled dependencies or inline style overrides.
* **Deployment Integration Validation:** Code commits trigger clean automated build processes on target hosting environments.
