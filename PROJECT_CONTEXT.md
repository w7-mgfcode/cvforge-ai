# PROJECT CONTEXT - WORKFLOWCV STUDIO (CVFORGE AI)

## 1. Product Vision
WorkflowCV Studio is a portfolio-grade web application proving that highly styling-sensitive, variable-length career profiles can be parsed, validated, and rendered onto strict physical page constraints without data truncation or visual overflows. By treating resumes as structured documents decoupled into three distinct layers (Content, Design, and Metadata), it enforces clean data modeling, declarative styling, and precise print compilation.

## 2. Core Use Cases
* **UC-1: Reverse-Engineering Legacy Documents:** Maps unstructured career info into a structured, validated JSON schema.
* **UC-2: Print-Optimized Layout Synthesis:** Process and output documents that conform strictly to A4 page dimensions without clippings.
* **UC-3: Factual AI Tailoring Loop:** Safely optimizes wording and fits experiences for specific job descriptions via a side-by-side verification diff.
* **UC-4: Design Token Propagation:** Updates global styling (padding, colors, layout structures) instantly across the canvas via standard Tailwind/CSS configurations.

## 3. Personas
* **Technical Candidate:** Needs highly credible resumes detailing cloud metrics and GitHub repositories that print perfectly.
* **AI Workflows Engineer:** Seeks transparency in data mutation, logs, and prompt-driven layout compilations.
* **Recruitment Helper:** Prefers easy, instant layout template toggles (ATS vs Editorial) and global density adjustments.
* **Design-Driven Developer:** Wants full codebase control over layout stylesheets without custom hacks.

## 4. MVP Features
* Fully validated TypeScript/Zod schemas.
* Multi-page rendering checking for layout height constraints.
* Three custom template renders (Executive Technical Dossier, Clean ATS Hybrid, Visual AI Portfolio).
* Side-by-side simulated AI copilot panel with fact-locking rules.
* Print stylesheets hiding UI elements during Ctrl+P prints.
