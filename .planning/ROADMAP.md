# Roadmap: PACIFIQUE! Institucional

**Created:** 2026-03-04
**Depth:** Quick
**Phases:** 3
**Coverage:** 31/31 v1 requirements mapped

## Phases

- [ ] **Phase 1: Static Landing Page & WhatsApp Conversion** - All content sections, navigation, responsive layout, and WhatsApp CTA delivering a complete, deployable page with primary conversion path
- [ ] **Phase 2: Lead Capture & LGPD Compliance** - Contact form, backend API, database persistence, email notifications, LGPD consent flow, and anti-spam protection
- [ ] **Phase 3: SEO, Accessibility & Performance Verification** - Schema.org structured data, WCAG 2.1 AA audit, Core Web Vitals verification, and SEO metadata

## Phase Details

### Phase 1: Static Landing Page & WhatsApp Conversion
**Goal**: Visitors can browse all PACIFIQUE! institutional content on any device and initiate contact via WhatsApp
**Depends on**: Nothing (first phase)
**Requirements**: HERO-01, HERO-02, HERO-03, INST-01, INST-02, INST-03, INST-04, INST-05, INST-06, INST-07, INST-08, INST-09, INST-10, CONV-01, RESP-01, RESP-02, RESP-03, RESP-04, COMP-03
**Success Criteria** (what must be TRUE):
  1. Visitor sees hero section with PACIFIQUE! brand identity (purple/mauve palette, sketch illustrations, CNJ/TJPE credentials) above the fold on both mobile and desktop
  2. Visitor navigates between all content sections (O que fazemos, Nucleos, Quem Somos, Fontes Normativas, Vantagens, Como Funciona, Beneficios, FAQ, Footer) via sticky menu with smooth scroll
  3. Visitor on mobile accesses all sections via hamburger menu without horizontal overflow at any viewport from 375px to 1440px
  4. Visitor taps floating WhatsApp button from any section and is directed to WhatsApp with pre-filled message, working on iOS Safari, Android Chrome, and desktop
  5. Page is served over HTTPS
**Plans:** 4 plans

Plans:
- [x] 01-01-PLAN.md — Project scaffold, design system, navbar, WhatsApp FAB, section wrapper
- [ ] 01-02-PLAN.md — Hero, Services (O que fazemos), Nucleos de Atuacao, Quem Somos sections
- [ ] 01-03-PLAN.md — Fontes Normativas, Vantagens, Como Funciona (flowchart), Comparativo sections
- [ ] 01-04-PLAN.md — FAQ accordion, Footer, final page integration and visual verification

### Phase 2: Lead Capture & LGPD Compliance
**Goal**: Visitors can submit contact information via form, which persists to database and notifies the PACIFIQUE! team by email, with full LGPD compliance
**Depends on**: Phase 1
**Requirements**: CONV-02, CONV-03, BACK-01, BACK-02, BACK-03, BACK-04, COMP-01, COMP-02
**Success Criteria** (what must be TRUE):
  1. Visitor fills out contact form (name, email, phone, area of interest from 7 nucleos, message) and sees clear success confirmation after submission
  2. Visitor sees per-field validation errors in Portuguese when submitting incomplete or invalid data
  3. PACIFIQUE! team receives email notification with lead details when a form is submitted, and the lead is persisted in the database with timestamp
  4. Visitor can read the Privacy Policy (Politica de Privacidade) page linked from both the form's LGPD consent checkbox and the footer
  5. Spam submissions via honeypot field are silently rejected; server-side validation rejects malformed data with 400 error
**Plans**: TBD

### Phase 3: SEO, Accessibility & Performance Verification
**Goal**: Page meets production quality standards for search engine visibility, accessibility compliance, and loading performance
**Depends on**: Phase 1, Phase 2
**Requirements**: HERO-04, COMP-04, COMP-05, COMP-06
**Success Criteria** (what must be TRUE):
  1. Page loads with LCP under 2.5 seconds and CLS under 0.1 on mobile connection
  2. Page implements complete SEO metadata (title, meta description, Open Graph tags, canonical URL) and Schema.org structured data (LegalService + Organization + LocalBusiness) that validates in Google Rich Results Test
  3. Page achieves WCAG 2.1 Level AA compliance: minimum 4.5:1 contrast ratio, proper heading hierarchy, alt text on images, visible focus indicators, skip-to-content link, and ARIA labels on interactive elements
**Plans**: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Static Landing Page & WhatsApp Conversion | 1/4 | In Progress | - |
| 2. Lead Capture & LGPD Compliance | 0/? | Not started | - |
| 3. SEO, Accessibility & Performance Verification | 0/? | Not started | - |

---
*Roadmap created: 2026-03-04*
*Last updated: 2026-03-04*
