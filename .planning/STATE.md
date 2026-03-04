# Project State: PACIFIQUE! Institucional

## Project Reference

**Core Value:** Comunicar credibilidade institucional da PACIFIQUE! (credenciada pelo CNJ e TJPE) e converter visitantes em leads via WhatsApp ou formulario de contato.

**Current Focus:** Executing Phase 1 plans — hero, services, nuclei, and team sections live.

## Current Position

**Phase:** 1 of 3 - Static Landing Page & WhatsApp Conversion
**Plan:** 3 of 4 (01-01, 01-02 complete, next: 01-03)
**Status:** In progress

```
Progress: [####......] 17%
Phase 1:  [#####.....] 2/4 plans complete
Phase 2:  [..........] Not started
Phase 3:  [..........] Not started
```

## Performance Metrics

| Metric | Value |
|--------|-------|
| Phases completed | 0/3 |
| Requirements completed | 12/31 |
| Plans completed | 2/4 (Phase 1) |

| Phase | Plan | Duration | Tasks | Files |
|-------|------|----------|-------|-------|
| 01 | 01 | 4min | 2 | 24 |
| 01 | 02 | 3min | 2 | 8 |

## Accumulated Context

### Key Decisions
| Decision | Rationale |
|----------|-----------|
| Next.js 16 monolith | SSG for static content + Server Actions for lead capture in single codebase (updated: v16.1.6, not 15) |
| Tailwind CSS v4 | Mobile-first utility CSS with design system tokens via CSS custom properties |
| Merriweather for headings | Placeholder serif font, swappable via --font-heading-family CSS variable |
| text-body #595959 | Darkened from #6B6B6B for WCAG AA contrast on lavender background |
| Drizzle ORM + Turso (SQLite) | Lightweight DB for low-volume lead persistence (10-50/month) |
| Resend + React Email | Transactional email with free tier sufficient for landing page volume |
| React Hook Form + Zod | Shared validation schema client/server for type-safe form handling |
| 2-phase content split | Static content ships first with WhatsApp CTA; lead capture second |
| Icon mapping pattern | Resolve string icon names from constants to Lucide components via Record<string, LucideIcon> |
| Hero standalone section | Hero uses custom section (not SectionWrapper) for 2-column layout with illustration placeholder |
| Card variant system | 4 variants (default, nucleus, team, dark) via const object for type-safe selection |

### Research Insights
- Static-first architecture: 95% server-rendered HTML, only form + nav need client JS
- LGPD goes beyond checkbox: consent versioning, data retention policy, "tipo de interesse" is potentially sensitive data
- WhatsApp is primary conversion for Brazilian audience (70%+ mobile traffic)
- wa.me deep link format works cross-platform, no library needed
- Legal credibility signals (CNJ/TJPE badges, precise citations, CNPJ in footer) are competitive differentiator
- Email deliverability: must configure SPF/DKIM/DMARC before Phase 2

### TODOs
- Content creation with founding lawyers (Nucleos descriptions, bios, FAQ, Privacy Policy)
- Verify package versions before setup (Next.js 15, Tailwind v4, Drizzle, Resend)
- Confirm WhatsApp number (personal vs Business account)
- Determine email sending domain (pacifique.com.br vs bmadvocacia.com.br)

### Blockers
- None currently

## Session Continuity

**Last session:** 2026-03-04 - Executed 01-02-PLAN.md (Hero, Services, Nucleos, Team sections)
**Stopped at:** Completed 01-02-PLAN.md
**Next action:** Execute 01-03-PLAN.md (Fontes Normativas, Vantagens, Como Funciona, Comparativo sections)

---
*State initialized: 2026-03-04*
*Last updated: 2026-03-04*
