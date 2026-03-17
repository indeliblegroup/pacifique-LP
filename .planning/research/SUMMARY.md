# Project Research Summary

**Project:** PACIFIQUE! Institutional Landing Page
**Domain:** Professional legal services website (Brazilian mediation/conciliation chamber)
**Researched:** 2026-03-04
**Confidence:** HIGH

## Executive Summary

PACIFIQUE! is an institutional landing page for a private mediation/conciliation chamber in Recife, Brazil. The research reveals a straightforward technical implementation (single-page landing + lead capture backend) but significant domain complexity around credibility signaling, legal compliance (LGPD), and mobile-first design for a WhatsApp-heavy Brazilian audience.

The recommended approach is a Next.js 15 monolith with static site generation for content sections and Server Actions for lead capture. The architecture follows a "static-first with islands of interactivity" pattern: 95% of the page is zero-JavaScript server-rendered HTML, with only the contact form and navigation requiring client-side code. This maximizes Core Web Vitals performance, which is critical for SEO and mobile users on 3G/4G connections. The stack is deliberately simple: Next.js handles both frontend and backend, SQLite via Turso for lead persistence, and Resend for email notifications.

Key risks center on domain-specific pitfalls rather than technical complexity. LGPD compliance goes far beyond a consent checkbox -- it requires data retention policies, consent versioning, and careful handling of the "tipo de interesse" field which reveals sensitive legal dispute categories. The design must balance professional legal credibility (precise CNJ/TJPE credential citations, visible CNPJ/OAB registrations) with approachability (hand-drawn illustrations, plain Portuguese, "Nao complique, PACIFIQUE!" positioning). The WhatsApp floating button is the primary conversion mechanism and must work flawlessly across iOS Safari, Android Chrome, and desktop. Mobile-first is non-negotiable: 70%+ of Brazilian traffic is mobile, and the 7 Nucleos de Atuacao must not stack into endless scroll.

## Key Findings

### Recommended Stack

The stack is optimized for a static landing page with a single backend operation (lead capture). Next.js 15 serves as the full-stack framework, handling both SSG for static content and API Routes/Server Actions for the form submission endpoint. This eliminates the need for separate frontend and backend codebases.

**Core technologies:**
- **Next.js 15 (App Router)**: Full-stack framework with SSG for landing page sections and API routes for lead capture. Single codebase handles both frontend and backend needs.
- **React 19**: UI library shipping with Next.js 15. Server Components reduce client-side bundle. Only the form and navigation require client-side JavaScript.
- **Tailwind CSS v4**: Utility-first styling with design system tokens (purple/mauve palette, spacing, typography) defined via CSS custom properties. Mobile-first by default.
- **Drizzle ORM + Turso (SQLite)**: Lightweight database for lead persistence. Turso provides hosted SQLite with HTTP API. No infrastructure management required.
- **Resend + React Email**: Modern transactional email API with React-based templates. Free tier (3000 emails/month) more than sufficient for landing page notification volume.
- **React Hook Form + Zod**: Form state management and validation. Shared Zod schema between client and server ensures consistent validation.
- **TypeScript 5.6**: Type safety across the stack. Non-negotiable per project requirements.

**Why not Astro?** While Astro would deliver better static performance, it requires a separate backend server for API routes, email sending, and database access. Next.js handles all of this in one codebase with zero additional infrastructure.

**Why SQLite over PostgreSQL?** A local mediation chamber will receive 10-50 leads per month. PostgreSQL infrastructure is operational overhead for zero benefit at this scale. Turso provides hosted SQLite that scales far beyond this project's needs.

### Expected Features

The feature set divides cleanly into static content (no backend dependencies) and dynamic lead capture (requires backend integration). This natural split drives the phase structure.

**Must have (table stakes):**
- **Hero section with clear value proposition**: 3-5 second decision window. Must communicate "what you do" (CNJ/TJPE credentialed chamber), "why trust you" (judicial accreditation), and "what to do next" (WhatsApp CTA).
- **7 Nucleos de Atuacao**: Visitors arrive with specific problems (flight cancelation, bank fee dispute, health insurance denial). They must see their problem reflected immediately. Scannable cards with icons and 1-sentence descriptions.
- **WhatsApp floating CTA button**: Primary conversion mechanism. In Brazil, WhatsApp IS the conversion channel. Fixed position, green bubble icon, pre-filled message. Uses `wa.me` deep link format (no library needed).
- **Contact form with LGPD compliance**: Name, email, phone, area of interest (dropdown), message. LGPD consent checkbox is MANDATORY (Lei 13.709/2018). Backend persists to database and sends email notification.
- **Credibility signals (Fontes Normativas)**: CNJ Resolution 125/2010, TJPE Resolution 410/2018, Lei de Mediacao 13.140/2015. These credentials are PACIFIQUE!'s competitive advantage vs. uncredentialed mediators. Must be visually prominent.
- **How it works (Como Funciona)**: 3-step flowchart. ADR (Alternative Dispute Resolution) is unfamiliar to most Brazilians. Process transparency kills conversion uncertainty.
- **Team section (Quem Somos)**: 4 founders with photos/illustrations, names, roles, bios. Personal relationships drive business decisions in Brazil.
- **Mobile-first responsive design**: 70%+ of Brazilian traffic is mobile. WhatsApp audience guarantees mobile-heavy traffic.
- **Fast page load (Core Web Vitals)**: LCP < 2.5s on mobile 3G. Google ranking factor. Slow page = visitor leaves before conversion.
- **SEO metadata**: Organic search is primary discovery for "mediacao recife", "conciliacao pernambuco".

**Should have (competitive):**
- **"Vantagens do Credenciamento" section**: Explains what TJPE credential means for clients. "Seu acordo tem forca de titulo executivo" is a powerful selling point most visitors won't know.
- **Benefits framing for consumers AND businesses**: Dual framing shows breadth. Most competitors target only corporate or only consumer.
- **Pre-filled WhatsApp messages by nucleus**: Each nucleo card gets a contextual WhatsApp CTA. Pre-fills message with specific area: "Ola! Tenho interesse em [Nucleo]." Better lead qualification.
- **FAQ section**: Answers conversion-killing objections: "Quanto custa?", "Quanto tempo demora?", "O acordo tem valor legal?", "Preciso de advogado?". Reduces friction before WhatsApp click.
- **Schema.org structured data (JSON-LD)**: Rich snippets in Google for "Legal Services in Recife". Most small Brazilian legal sites don't implement this -- easy SEO win.
- **Accessibility beyond minimum (WCAG 2.1 AA)**: Semantic HTML, keyboard navigation, proper color contrast. Benefits SEO and screen readers.

**Defer (v2+):**
- **Blog or content area**: Adds CMS complexity, content creation pipeline. A blog without regular updates looks worse than no blog. Goal is conversion, not content marketing.
- **Client testimonials**: No validated content exists yet. Fabricated testimonials are ethically/legally problematic under OAB advertising rules (Provimento 205/2021).
- **Online scheduling/calendar booking**: Mediation scheduling is inherently complex (multiple parties, preparation time). Generic calendar widget creates false expectations.
- **Live chat widget**: Requires 24/7 staffing or AI chatbot. Unstaffed chat is worse than no chat. WhatsApp IS the live chat.
- **Fee/pricing table**: Explicitly excluded. Fees vary by case complexity. Publishing invites price-shopping without context and creates legal issues if fees change.

### Architecture Approach

The architecture follows a "static-first with islands of interactivity" pattern optimized for Core Web Vitals. The entire landing page is server-rendered at build time (SSG) with zero client-side JavaScript except for the contact form and navigation. This produces excellent LCP and CLS scores critical for SEO and mobile performance.

**Major components:**
1. **Page shell (Next.js App Router)**: Single-page layout composing all section components. Server components by default. No client-side routing needed -- uses anchor links with smooth scroll.
2. **Static content sections**: Hero, Services (O que fazemos), Nucleos de Atuacao (7 cards), Team (Quem Somos), Legal references (Fontes Normativas), Credentialing advantages, Process flowchart (Como Funciona), Benefits, Footer. All static HTML with zero JS bundle.
3. **Contact form (client component)**: React Hook Form with Zod validation. Submits via Next.js Server Action (type-safe, no REST boilerplate). Four states: idle, submitting, success, error.
4. **WhatsApp floating button**: Fixed-position anchor tag with `wa.me` deep link. No library needed. Pre-filled message in URL. Must not overlap form fields at any viewport width.
5. **Server Action / API Route**: Validates input (Zod), persists to database (Drizzle + Turso), sends notification email (Resend), returns success/error. Email send is fire-and-forget (don't block response).
6. **Database layer**: Single `leads` table with fields: name, email, phone, interest area, message, consent timestamp, created date. Drizzle ORM provides type-safe queries.
7. **Email notification service**: Resend API sends lead notification to team inbox. React Email for branded templates. Includes lead details but NOT the sensitive "tipo de interesse" in email body (LGPD).

**Key architectural patterns:**
- **Static-first**: 95% static, only form is interactive. Optimizes for Core Web Vitals.
- **Server Actions over REST**: Type-safe end-to-end. No manual fetch logic. Progressive enhancement (form works without JS).
- **Design tokens via CSS custom properties**: Brand colors/spacing defined once in CSS, referenced by Tailwind. Zero runtime cost.
- **Shared validation schema**: Same Zod schema client and server. Validate on client for UX, re-validate on server for security.
- **Fire-and-forget email**: Database insert is critical path. Email failure does not fail form submission.

### Critical Pitfalls

Research identified 7 critical pitfalls and dozens of moderate ones. The top 5 most likely to cause launch failures:

1. **LGPD non-compliance beyond the checkbox**: LGPD requires more than a consent checkbox. The "tipo de interesse" field reveals legal dispute categories (family law, debt, health) which may constitute sensitive data under Art. 11. Email notifications containing this data sent over insecure channels violate data protection. No data retention policy means indefinite storage. No mechanism for data subject rights (access, correction, deletion per Arts. 17-22). Prevention: Store consent timestamp with version, encrypt sensitive fields at rest, do NOT include "tipo de interesse" in email body, implement 90-180 day retention policy, provide data subject request mechanism in privacy policy.

2. **Legal credibility undermined by generic design**: Users in stressful situations (family disputes, debt) need to trust the institution. Generic corporate template styling fails to convey CNJ/TJPE credentialing. Prevention: Credential badge/seal near hero with "Credenciada pelo TJPE nos termos da Resolucao n. 410/2018", precise legal citations (not abbreviated), no stock photography (use hand-drawn brand illustrations instead), footer must display CNPJ (65.218.388/0001-47) and OAB registrations, all content reviewed by founding lawyers before deployment.

3. **WhatsApp CTA that breaks across platforms or leaks context**: Floating button fails on desktop without WhatsApp Web, opens with no pre-filled message, uses wrong phone formatting, or includes sensitive info in URL (logged in browser history). Prevention: Use `https://wa.me/5581987900892?text=` format (digits only, no formatting), always include generic pre-filled message, NEVER include user's "tipo de interesse" in URL, test on iOS Safari + Android Chrome + desktop, ensure no overlap with form submit button at narrow viewports, account for iOS Safari bottom toolbar (16px margin).

4. **Client-only form validation and missing error states**: Form validates only client-side. Bots POST directly to API bypassing validation, flooding database with garbage. No error handling means users see infinite spinner on API failure. Prevention: Share Zod schema client/server, always validate server-side, add honeypot field (hidden input bots fill but humans don't), handle four form states (idle/submitting/success/error), show per-field error messages in Portuguese, add 10-second client timeout, rate-limit API (5 submissions per IP per hour).

5. **Lead form works but leads never get read**: Form is technically correct but leads go cold because notifications land in spam, no one checks inbox regularly, no urgency system, response time exceeds 24 hours. For mediation/conciliation, timing is critical -- parties have narrow window before escalating to litigation. Prevention: Test email delivery to actual bmadvocacia.com.br addresses BEFORE launch, configure SPF/DKIM/DMARC for sending domain, use Resend (not Gmail SMTP), notification email includes lead's phone number for WhatsApp reply, set expectation on form ("Responderemos em ate 24 horas uteis"), send auto-reply confirming receipt, consider WhatsApp group notification via webhook.

**Additional moderate pitfalls:**
- **Accessibility violations**: Color contrast failures (especially `#6B6B6B` on `#F5F3F7` lavender background likely fails WCAG AA), form fields use only placeholder text (not proper labels), smooth scroll ignores `prefers-reduced-motion`, no skip-to-content link. For a legal institution handling consumer rights, accessibility failures create legal exposure under LBI (Lei 13.146/2015).
- **Mobile-first lip service**: Designed for desktop then responsively adjusted. Results: 7 Nucleos stack into endless scroll, flow diagram becomes illegible, touch targets too small (<44px), iOS Safari quirks (bottom toolbar, `100vh` vs `100dvh`, form inputs <16px trigger auto-zoom).
- **Performance traps**: Unoptimized hero illustration (large PNG/SVG) causes LCP >4s on mobile 3G, custom fonts block render (FOIT), 7 cards + 4 team members + flowchart = large DOM (>1500 nodes), heavy animations cause jank on low-end Android devices (Samsung A-series, Motorola G-series dominant in Brazil).

## Implications for Roadmap

Based on research, the natural phase structure follows the architecture split between static content (no backend dependencies) and dynamic lead capture (requires external service setup).

### Phase 1: Static Content Foundation
**Rationale:** Static sections can be built, reviewed, and deployed immediately without waiting for database/email service setup. This gets content live for SEO indexing and WhatsApp sharing while backend is configured. WhatsApp floating button (primary CTA) works immediately with zero backend.

**Delivers:** Production-ready landing page with all content sections, mobile-first responsive design, and functional WhatsApp conversion path. Page ranks in search and can be shared socially while form is being built.

**Addresses (from FEATURES.md):**
- Hero section with value proposition
- 7 Nucleos de Atuacao cards
- Services overview (O que fazemos)
- Team section (Quem Somos)
- Legal references (Fontes Normativas)
- Credentialing advantages (Vantagens do Credenciamento)
- Process flowchart (Como Funciona)
- Benefits framing (consumers/businesses)
- WhatsApp floating button (primary conversion)
- Footer with institutional data
- Smooth scroll navigation
- SEO metadata (title, description, Open Graph)
- Mobile-first responsive layout
- Design system implementation (Tailwind + CSS tokens)

**Avoids (from PITFALLS.md):**
- Legal credibility gaps (content reviewed by lawyers, credential badges prominent, CNPJ/OAB in footer)
- Mobile-first failures (developed at 375px first, physical device testing)
- Accessibility violations (color contrast verified, semantic HTML, proper heading hierarchy)
- Performance traps (images optimized, fonts self-hosted via `next/font`, minimal client JS)
- Generic design undermining trust (hand-drawn brand illustrations, precise legal citations, no stock photos)

**Exit criteria:**
- All content sections approved by founding lawyers
- WhatsApp link tested on iOS Safari, Android Chrome, desktop
- Core Web Vitals passing on mobile 3G (LCP <2.5s)
- Color contrast verified for all palette combinations
- Physical device testing complete (iPhone + Android)
- Privacy Policy page drafted and reviewed (needed before form goes live)

### Phase 2: Lead Capture Backend
**Rationale:** Form requires external service accounts (Turso database, Resend email) and has the only backend complexity. Phase 1 delivers conversion via WhatsApp while this infrastructure is set up. Separating this phase allows legal team to review Privacy Policy content in parallel with backend development.

**Delivers:** Fully functional lead capture system with database persistence, email notifications, LGPD compliance, spam prevention, and error handling. Two conversion paths (WhatsApp + form) both operational.

**Uses (from STACK.md):**
- Drizzle ORM + Turso (SQLite) for lead persistence
- Resend + React Email for notifications
- React Hook Form + Zod for form state and validation
- Next.js Server Actions for type-safe form submission

**Implements (from ARCHITECTURE.md):**
- Contact form UI (client component with 4 states)
- Server Action for lead submission
- Database schema (leads table with consent timestamp)
- Email notification service (fire-and-forget pattern)
- Honeypot spam prevention
- LGPD consent checkbox + privacy notice
- Rate limiting (5 submissions per IP per hour)

**Avoids (from PITFALLS.md):**
- LGPD non-compliance (consent timestamp stored, privacy policy linked, retention policy documented, "tipo de interesse" NOT in email body)
- Client-only validation (Zod schema shared, server validates, honeypot tested)
- Missing error states (4 states implemented: idle/submitting/success/error)
- Lead response failures (email tested to bmadvocacia.com.br addresses, SPF/DKIM configured, auto-reply sent, phone number in notification for WhatsApp reply)
- WhatsApp platform breaks (tested cross-platform, no sensitive data in URL)

**Exit criteria:**
- Server-side validation tested via curl with XSS payloads
- Honeypot verified (curl submission with field filled is rejected)
- Email delivered to carlosh@bmadvocacia.com.br (inbox, not spam)
- Privacy Policy page live with LGPD-compliant content
- Consent checkbox validated server-side (cannot be bypassed)
- All 4 form states verified (idle/submitting/success/error)
- Rate limiting tested (6th submission in 1 hour is rejected)
- Auto-reply email sent to lead confirming receipt
- "Tipo de interesse" encrypted at rest in database
- Data retention policy documented (90-180 days for unconverted leads)

### Phase 3: Polish and Enhancement
**Rationale:** Core product is shippable after Phase 2. This phase adds features that improve conversion and SEO but are not blocking for launch. Can ship incrementally.

**Delivers:** Contextualized WhatsApp CTAs, FAQ section, scroll animations, structured data, email routing by interest, accessibility audit.

**Features:**
- Contextualized WhatsApp CTAs per nucleo card (pre-filled with specific area)
- FAQ section (5-8 common questions: cost, timeline, legal force, lawyer needed)
- Subtle scroll-triggered animations (Intersection Observer, 200-300ms transitions, respects `prefers-reduced-motion`)
- Schema.org structured data (LegalService + Organization + LocalBusiness JSON-LD)
- Email notification routing by interest area (send to relevant team member)
- Full accessibility audit (axe-core, keyboard navigation, screen reader testing)

**Avoids:**
- Over-animation (only subtle reveals, no parallax, respects motion preferences)
- Performance regressions (animations use IntersectionObserver not scroll listeners)

**Exit criteria:**
- axe-core reports zero critical/serious violations
- Structured data validates in Google Rich Results Test
- FAQ content approved by legal team
- Animation respects `prefers-reduced-motion` media query

### Phase Ordering Rationale

1. **Static content first** because it has zero external dependencies and can be reviewed/deployed immediately. WhatsApp CTA (primary conversion) works without backend. Page can rank in search and be shared while form is built.

2. **Lead capture second** because it requires external service setup (database, email provider) and is the only backend complexity. Privacy Policy content needs legal review in parallel. Separating this phase prevents backend work from blocking static content deployment.

3. **Polish last** because core product is shippable after Phase 2. These features improve conversion incrementally but are not launch blockers. Can ship over time without delaying go-live.

**Dependency insights:**
- Contact form depends on Privacy Policy page (content must exist before form goes live for LGPD compliance)
- Email notification depends on domain verification (SPF/DKIM setup on sending domain)
- Contextualized WhatsApp CTAs depend on finalized nucleo content (can't pre-fill messages until content is locked)
- Structured data depends on stable content (add last to avoid churn)

**Pitfall-phase mapping:**
- LGPD compliance is Phase 2 (privacy policy + consent flow + data handling)
- Legal credibility is Phase 1 (content review + credential badges + CNPJ/OAB)
- WhatsApp platform compatibility is Phase 1 (cross-platform testing before launch)
- Form validation/security is Phase 2 (server validation + honeypot + rate limiting)
- Accessibility is Phase 1 (color contrast + semantic HTML) + Phase 3 (full audit)
- Mobile-first is Phase 1 (foundation — developed at 375px with physical device testing)

### Research Flags

**Phases needing deeper research during planning:**
- **None expected**: This is a standard landing page + lead capture pattern. All technologies (Next.js, Tailwind, Drizzle, Resend) are well-documented with stable APIs. No niche integrations or bleeding-edge features.

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Static Content)**: Next.js SSG + Tailwind responsive design is extremely well-documented. Thousands of similar landing pages exist.
- **Phase 2 (Lead Capture)**: Contact form + database + email notification is a solved pattern. React Hook Form, Zod, Drizzle, and Resend all have extensive documentation.
- **Phase 3 (Polish)**: Intersection Observer animations, Schema.org JSON-LD, and accessibility auditing are all standard practices with ample resources.

**Where to focus planning effort:**
- **Content creation and review**: The 7 Nucleos descriptions, team bios, legal citations, FAQ answers, and Privacy Policy all require founding lawyer input. Content is a first-class deliverable with longer lead time than code.
- **Design system implementation**: The purple/mauve palette, hand-drawn illustrations, and card styles need to match brand identity precisely. Color contrast verification is mandatory before implementation starts.
- **Email deliverability setup**: SPF/DKIM/DMARC configuration for the sending domain (likely pacifique.com.br or bmadvocacia.com.br) and Resend domain verification must happen before Phase 2 begins.
- **LGPD Privacy Policy**: This is a legal document that needs careful drafting and review. It must exist before the form goes live, which means it's on the critical path for Phase 2.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Next.js, React, Tailwind, Drizzle, Resend are all stable, widely-used technologies with extensive documentation. Version specifics (e.g., Tailwind v4, Next.js 15) should be verified against npm registry before installation, but the core stack recommendations are solid. |
| Features | HIGH | Feature set is grounded in project requirements (CLAUDE.md, PROJECT.md) and validated against Brazilian legal services UX patterns. Table stakes vs. differentiators distinction is clear. Anti-features are well-justified. |
| Architecture | HIGH | Static-first SSG with Server Actions is a proven Next.js pattern. Single-page architecture with anchor navigation is standard for landing pages. Database/email integration is straightforward with no novel complexity. |
| Pitfalls | MEDIUM-HIGH | Critical pitfalls (LGPD, legal credibility, WhatsApp cross-platform, form validation, lead response) are grounded in domain expertise and established patterns. However, specific 2026 regulatory updates (ANPD guidance, OAB rules) and exact mobile device market share could not be web-verified. Core patterns are stable but details may need validation. |

**Overall confidence:** HIGH

The technical implementation is straightforward with well-established patterns. The complexity lies in domain-specific concerns (LGPD compliance, legal credibility signaling, mobile-first for Brazilian audience) which are well-researched but benefit from founder/legal team validation during execution.

### Gaps to Address

**Version verification needed:**
The following package versions stated in STACK.md should be verified before project setup (training data current to early 2025; latest versions may have changed):
- Next.js: stated ^15, verify with `npm view next version`
- Tailwind CSS: stated ^4, verify with `npm view tailwindcss version` (v4 released Jan 2025 per training data; if unstable, fall back to v3.4)
- Drizzle ORM: stated ^0.38, verify with `npm view drizzle-orm version`
- Resend: stated ^4, verify with `npm view resend version`
- React Hook Form: stated ^7.54, verify with `npm view react-hook-form version`
- Lucide React: stated ^0.460, verify with `npm view lucide-react version`
- Framer Motion: stated ^11, verify with `npm view framer-motion version`

If any major version has changed significantly (e.g., Tailwind v5 released, Next.js 16 with breaking changes), revisit STACK.md recommendations during project setup.

**Content creation timeline:**
The roadmap assumes content (Nucleos descriptions, team bios, FAQ answers, Privacy Policy) is ready when implementation begins. If content is not ready, Phase 1 will be blocked. Recommend starting content creation immediately with founding lawyers in parallel with project setup.

**Domain-specific validations needed during execution:**
- **LGPD Privacy Policy**: Requires review by founding lawyers who understand both mediation chamber operations and data protection law. This is a legal deliverable, not a technical one.
- **Legal citation formatting**: CNJ/TJPE resolution numbers and Lei de Mediacao references must be verified for precision. Incorrect citations on a legal institution's website are a credibility catastrophe.
- **OAB advertising rules**: Provimento 205/2021 restricts legal services advertising. Confirm that mediation chambers (vs. law firms) have the same restrictions, particularly around testimonials and fee display.
- **WhatsApp Business number**: Confirm whether Carlos Henrique's personal number (5581987900892) is the correct contact or if a dedicated PACIFIQUE! WhatsApp Business account should be created.
- **Email sending domain**: Determine whether notification emails send from pacifique.com.br or bmadvocacia.com.br, and ensure domain access for SPF/DKIM configuration.

**Competitive landscape validation:**
PITFALLS.md claims Brazilian mediation chamber websites are typically outdated, desktop-first, and missing WhatsApp integration. This assessment is based on domain expertise but was not web-verified during research. Recommend spot-checking 3-5 competitors (mediare.com.br, camarb.com.br, cbma.com.br, cceal.com.br) during Phase 1 planning to validate the competitive gap and identify any features PACIFIQUE! should match.

## Sources

### Primary (HIGH confidence)
- **PROJECT.md and CLAUDE.md**: Project requirements, team structure, legal foundation, design system, domain context. Authoritative source for project scope.
- **Next.js documentation**: SSG patterns, App Router, Server Actions, Image optimization, Metadata API. Stable framework with extensive official docs.
- **LGPD (Lei 13.709/2018)**: Arts. 7 (legal bases), 11 (sensitive data), 17-22 (data subject rights), 52 (sanctions). Stable statutory law, HIGH confidence.
- **LBI (Lei 13.146/2015)**: Digital accessibility requirements for Brazilian legal institutions. Stable statutory law, HIGH confidence.
- **WCAG 2.1 AA**: Accessibility standards (4.5:1 contrast for normal text, 3:1 for large text). W3C stable specification, HIGH confidence.
- **WhatsApp `wa.me` deep link API**: URL format for Click-to-Chat. Stable API that has not changed in years, HIGH confidence.
- **React Hook Form + Zod documentation**: Form handling and validation libraries. Mature, stable APIs, HIGH confidence.
- **Core Web Vitals thresholds**: LCP <2.5s, INP <200ms, CLS <0.1. Google's published standards (note: FID replaced by INP in March 2024). HIGH confidence.

### Secondary (MEDIUM confidence)
- **Tailwind CSS v4**: Released January 2025 per training data. CSS-first configuration, zero PostCSS plugin. MEDIUM confidence on v4 specifics -- verify current state before using. Fallback to v3.4 if unstable.
- **Turso (hosted SQLite)**: libSQL over HTTP, SQLite-compatible, edge-ready. MEDIUM confidence on pricing/limits -- verify free tier specs.
- **Resend email API**: Modern transactional email service. Free tier (100 emails/day, 3000/month) per training data. MEDIUM confidence on limits -- verify current pricing.
- **Drizzle ORM**: TypeScript-first ORM, SQLite-compatible. MEDIUM confidence on version 0.38 specifics -- verify current version.
- **Brazilian mobile device landscape**: Samsung A-series and Motorola G-series dominance, 70%+ mobile traffic, WhatsApp penetration. MEDIUM confidence -- general patterns stable but 2026-specific market share not verified.
- **OAB Provimento 205/2021**: Advertising restrictions for legal services. MEDIUM confidence -- general knowledge of restrictions but specific applicability to mediation chambers (vs. law firms) should be verified with founders.
- **Google Fonts LGPD implications**: Based on EU court ruling (Germany, Jan 2022) interpreted analogously under LGPD. MEDIUM confidence -- specific ANPD guidance not verified.

### Tertiary (LOW confidence)
- **Competitive landscape assessment**: Brazilian mediation chamber websites described as outdated, desktop-first, text-heavy, slow. Based on domain expertise but not web-verified during research session. Recommend spot-checking specific competitors to validate.

---
*Research completed: 2026-03-04*
*Ready for roadmap: yes*
