# AGENTS.md

## Project Overview

This repository is a Next.js 14 App Router application for WorkflowCV Studio / CVForge AI. It models CV content with TypeScript and Zod, renders print-bounded A4 resume templates, and exposes an interactive studio for editing content, design tokens, print previews, and simulated AI tailoring.

## Build and Test Commands

- `npm run dev` - Start the local Next.js development server from the repository root.
- `npm run build` - Build the production app and run Next.js type checks.
- `npm run lint` - Run the configured Next.js ESLint checks.

## Code Style

- Use TypeScript and React function components. Put browser-interactive pages or components behind `'use client'` only when they use client state, effects, or event handlers.
- Use the `@/` import alias for code under `src/`.
- Keep CV data contracts in `src/schemas/cv.schema.ts` and update sample data, forms, template rendering, and validators when schema shape changes.
- Prefer Tailwind classes and existing theme tokens from `tailwind.config.ts` over one-off colors or inline styles.
- Use `lucide-react` icons for interface controls when an appropriate icon exists.

## Architecture Notes

- Routes live in `src/app/`; shared UI is organized under `src/components/`.
- `src/app/studio/page.tsx` owns the main `CVDocument` state and passes content/design changes into editor, canvas, design panel, and copilot components.
- Template rendering belongs in `src/lib/template-engine.tsx`; print and layout checks belong in `src/lib/print-validator.ts`.
- Print behavior depends on `src/styles/print.css`, `.a4-page-context`, and A4 sizing assumptions documented in `DESIGN.md`. Preserve print-only visibility rules when changing layout.
- Product and design intent is documented in `PROJECT_CONTEXT.md` and `DESIGN.md`; keep UI changes aligned with those files or update the docs in the same change.

## Testing Expectations

- There is no dedicated test script in `package.json` yet. For code changes, run `npm run lint` and `npm run build` before completion when feasible.
- For UI, template, or print changes, manually verify `/studio` in the browser and check print preview behavior around A4 page bounds.
- For schema changes, validate that `src/data/sample-cv.ts` still conforms and that editor forms handle the changed fields.

## Validation Before Completion

- Run `npm run lint` after changing TypeScript, React, Tailwind, or config files.
- Run `npm run build` after changes that affect routing, imports, schemas, rendering logic, or Next.js configuration.
- Mention any validation command that could not be run and why.

## Security and Secrets

- Do not commit `.env` files, credentials, tokens, generated secrets, or private candidate data.
- Keep sample CV content fictional or sanitized unless the user explicitly supplies approved content.

## Repository-Specific Rules

- Treat A4 print fidelity as a core requirement: avoid changes that allow overflowing, clipped, or hidden resume content without an explicit warning or mitigation.
- Keep UI controls dense and work-focused; this is a document studio, not a marketing site.
- Avoid adding dependencies unless they materially reduce implementation risk or match an existing project pattern.
