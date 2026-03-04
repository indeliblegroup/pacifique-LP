---
phase: 01-static-landing-page-whatsapp-conversion
plan: 01
subsystem: ui
tags: [next.js, tailwind-v4, design-system, navbar, whatsapp, react]

# Dependency graph
requires: []
provides:
  - Next.js 16 project scaffold with Tailwind v4 design tokens
  - Reusable SectionWrapper component with alternating backgrounds
  - Sticky navbar with desktop horizontal links and mobile hamburger menu
  - WhatsApp floating action button with wa.me deep link
  - Shared constants (nav items, WhatsApp number, nuclei data, team data, FAQ data)
  - Page skeleton with all section IDs for anchor navigation
affects: [01-02-PLAN, 01-03-PLAN, 01-04-PLAN]

# Tech tracking
tech-stack:
  added: [next.js 16.1.6, react 19.2.3, tailwindcss 4.2.1, lucide-react 0.577.0, sharp 0.34.5, typescript 5.9.3]
  patterns: [server-components-by-default, tailwind-v4-theme-tokens, section-wrapper-alternating-bg, smooth-scroll-anchor-nav]

key-files:
  created:
    - src/app/layout.tsx
    - src/app/globals.css
    - src/app/page.tsx
    - src/app/not-found.tsx
    - src/lib/constants.ts
    - src/components/ui/section-wrapper.tsx
    - src/components/navbar.tsx
    - src/components/whatsapp-fab.tsx
    - postcss.config.mjs
    - package.json
    - tsconfig.json
  modified: []

key-decisions:
  - "Merged navbar and WhatsApp FAB into Task 1 commit since page.tsx imports require them for build"
  - "Used Merriweather serif font for headings as placeholder, swappable via --font-heading-family CSS variable"
  - "Darkened text-body to #595959 from #6B6B6B for WCAG 2.1 AA contrast on lavender background"
  - "Added overflow-x-hidden on body as safety net against horizontal scroll on mobile"

patterns-established:
  - "SectionWrapper: reusable section wrapper with id, variant (white/lavender), consistent spacing and max-width"
  - "Design tokens via @theme: all colors from CLAUDE.md palette available as Tailwind utilities (bg-primary, text-text-body, bg-bg-lavender, etc.)"
  - "Constants-driven data: all content data (nav items, nuclei, team, FAQ) centralized in src/lib/constants.ts"
  - "Server components by default: only navbar uses 'use client' for scroll spy and hamburger state"

requirements-completed: [HERO-02, HERO-03, CONV-01, RESP-01, RESP-04, COMP-03]

# Metrics
duration: 4min
completed: 2026-03-04
---

# Phase 1 Plan 01: Project Scaffold & Design System Summary

**Next.js 16 project with Tailwind v4 design tokens, sticky navbar with mobile hamburger menu, WhatsApp floating button, and page skeleton with 10 navigable sections**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-04T16:15:42Z
- **Completed:** 2026-03-04T16:20:10Z
- **Tasks:** 2
- **Files modified:** 24

## Accomplishments
- Next.js 16.1.6 project scaffolded with Tailwind v4 @theme design tokens matching full PACIFIQUE! brand palette
- Sticky navbar with desktop horizontal links, mobile hamburger toggle (44x44px touch target), IntersectionObserver scroll spy, and smooth scroll anchor navigation
- WhatsApp floating action button (bottom-right, z-50) with pre-filled message linking to wa.me/5581987900892
- Page skeleton with all 10 section IDs (hero, sobre, nucleos, equipe, fontes-normativas, vantagens, como-funciona, comparativo, faq, contato) using SectionWrapper with alternating white/lavender backgrounds
- Complete constants file with typed data for nav items, nuclei (7), team members (4), and FAQ (8 questions in pt-BR)
- Branded 404 page with PACIFIQUE! styling and back-to-home link

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Next.js 16 project with Tailwind v4 design system** - `b55a0c1` (feat)
2. **Task 2: Build sticky navbar with hamburger menu and WhatsApp floating button** - included in `b55a0c1` (both components were necessarily created in Task 1 since page.tsx imports them)

## Files Created/Modified
- `src/app/layout.tsx` - Root layout with pt-BR, Inter + Merriweather fonts, scroll-smooth, metadata
- `src/app/globals.css` - Tailwind v4 @theme with all PACIFIQUE! design tokens + prefers-reduced-motion
- `src/app/page.tsx` - Page with Navbar, all placeholder sections using SectionWrapper, Footer, WhatsAppFab
- `src/app/not-found.tsx` - Branded 404 page
- `src/lib/constants.ts` - All shared data: nav items, WhatsApp config, nuclei, team, FAQ with TypeScript types
- `src/components/ui/section-wrapper.tsx` - Reusable section wrapper with alternating bg-white/bg-lavender
- `src/components/navbar.tsx` - Client component: sticky nav, desktop links, mobile hamburger, scroll spy
- `src/components/whatsapp-fab.tsx` - Server component: fixed WhatsApp button with wa.me deep link
- `postcss.config.mjs` - Tailwind v4 PostCSS config
- `package.json` - Project dependencies (next, react, tailwindcss, lucide-react, sharp)
- `tsconfig.json` - TypeScript config with @/* path alias

## Decisions Made
- Merged Tasks 1 and 2 into a single commit because page.tsx imports both Navbar and WhatsAppFab, making them required for a passing build at any commit point
- Used Merriweather as heading font placeholder (easily swappable via --font-heading-family CSS variable per research open question #1)
- Darkened text-body from #6B6B6B to #595959 for WCAG AA contrast ratio on lavender background (per research pitfall #4)
- Added overflow-x-hidden on body element as safety net for mobile horizontal scroll prevention (per research pitfall #6)
- Used 100dvh in 404 page for dynamic viewport height (per research pitfall #2 regarding iOS Safari)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Moved conflicting files during scaffolding**
- **Found during:** Task 1 (project scaffolding)
- **Issue:** `pnpm create next-app` refused to scaffold in a directory containing .planning/ and CLAUDE.md
- **Fix:** Temporarily moved .planning/ and CLAUDE.md to /tmp, scaffolded, then restored them
- **Files modified:** None (temporary move only)
- **Verification:** All files restored correctly, build passes
- **Committed in:** b55a0c1

**2. [Rule 3 - Blocking] Fixed .gitignore ignoring .planning directory**
- **Found during:** Task 1 (commit preparation)
- **Issue:** Scaffolder's .gitignore merged with existing one, resulting in .planning/ being ignored by git
- **Fix:** Removed .planning/ line from .gitignore so planning files remain tracked
- **Files modified:** .gitignore
- **Verification:** .planning/ files visible to git
- **Committed in:** b55a0c1

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both auto-fixes necessary for project scaffolding to complete. No scope creep.

## Issues Encountered
- Scaffolder conflict with existing files required temporary file relocation (resolved, see deviations above)

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Project foundation complete: all section IDs wired, navigation works, design tokens active
- Plans 02-04 can drop in section content components directly into the existing page structure
- All content data (nuclei, team, FAQ) is centralized in constants.ts, ready for component consumption

---
*Phase: 01-static-landing-page-whatsapp-conversion*
*Completed: 2026-03-04*
