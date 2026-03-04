# Project State: PACIFIQUE! Institucional

## Project Reference

**Core Value:** Comunicar credibilidade institucional da PACIFIQUE! (credenciada pelo CNJ e TJPE) e converter visitantes em leads via WhatsApp ou formulario de contato.

**Current Focus:** Executing Phase 1 plans — project scaffolded, design system active, navbar and WhatsApp FAB live.

## Current Position

**Phase:** 1 of 3 - Static Landing Page & WhatsApp Conversion
**Plan:** 2 of 4 (01-01 complete, next: 01-02)
**Status:** In progress

```
Progress: [##........] 8%
Phase 1:  [##........] 1/4 plans complete
Phase 2:  [..........] Not started
Phase 3:  [..........] Not started
```

## Performance Metrics

| Metric | Value |
|--------|-------|
| Phases completed | 0/3 |
| Requirements completed | 6/31 |
| Plans completed | 1/4 (Phase 1) |

| Phase | Plan | Duration | Tasks | Files |
|-------|------|----------|-------|-------|
| 01 | 01 | 4min | 2 | 24 |

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

**Last session:** 2026-03-04 - Executed 01-01-PLAN.md (project scaffold, design system, navbar, WhatsApp FAB)
**Stopped at:** Completed 01-01-PLAN.md
**Next action:** Execute 01-02-PLAN.md (Hero, Services, Nucleos, Team sections)

---
*State initialized: 2026-03-04*
*Last updated: 2026-03-04*
