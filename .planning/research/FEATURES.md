# Feature Landscape

**Domain:** Institutional landing page for a Private Chamber of Conciliation and Mediation (Brazil)
**Researched:** 2026-03-04
**Confidence:** MEDIUM-HIGH (project context is authoritative; competitive landscape based on domain expertise, not live-verified)

## Table Stakes

Features visitors expect from an institutional legal/mediation services page. Missing any of these signals "unprofessional" or "untrustworthy" -- fatal for a credibility-dependent business.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Hero section with clear value proposition** | Visitors decide in 3-5 seconds whether to stay. Must communicate "what you do" and "why trust you" instantly. | Med | Illustration + tagline ("Nao complique, PACIFIQUE!") + CNJ/TJPE credential badge above the fold + primary CTA. Match existing brand assets (purple/mauve, sketch illustrations). |
| **Services overview (O que fazemos)** | Visitors need to understand what conciliation, mediation, and restorative practices ARE. Most Brazilians don't know the difference between these and litigation. | Low | 3 cards max. Plain Portuguese, no legalese. Keep explanations to 2-3 sentences each. |
| **Areas of practice (Nucleos de Atuacao)** | Visitors arrive with a specific problem ("airline lost my luggage", "bank charged me wrongly"). They need to see their problem reflected on the page within seconds. | Med | 7 nucleos is a lot for a single page. Scannable cards with icons: icon + title + 1-sentence description. Consider expandable detail on click/tap for mobile. Custom icon set matching brand illustration style. |
| **Credibility signals (Fontes Normativas)** | Legal services live and die on trust. CNJ and TJPE credentials are PACIFIQUE!'s strongest competitive advantage vs. uncredentialed mediators. | Low | Display resolution numbers and law references. Use dark accent cards (accent-deep background) for visual weight. Link to official CNJ/TJPE sources for verification. |
| **How it works (Como Funciona)** | ADR (Alternative Dispute Resolution) is unfamiliar to most Brazilians. Uncertainty about the process kills conversion. "What happens after I contact them?" must be answered. | Med | Simplified 3-step flowchart. Mobile: vertical top-to-bottom. Desktop: horizontal with chevron arrows. Must NOT look bureaucratic. Use the existing rose gradient chevron design language. |
| **Team section (Quem Somos)** | People hire people, not institutions. Faces + names + credentials build trust. Especially important in Brazil where personal relationships drive business decisions. | Low | Photo/illustration + name + role + short bio. 4 founders. Grid layout (1-col mobile, 2-4 col desktop). Sketch-style portraits match brand if professional photos unavailable. |
| **WhatsApp floating CTA button** | In Brazil, WhatsApp IS the conversion channel. 99% smartphone penetration. Users expect instant messaging over phone calls or forms. This is the primary conversion mechanism. | Low | Fixed position, always visible on scroll. Green bubble icon. Pre-filled message: "Ola, vim pelo site da PACIFIQUE! e gostaria de saber mais." Use `wa.me` link format. |
| **Contact/lead capture form** | Not everyone wants WhatsApp. Corporate clients, attorneys referring cases, and cautious visitors prefer form submission for documentation purposes. | Med | Name, email, phone, area of interest (dropdown matching 7 nucleos), message. LGPD consent checkbox is MANDATORY (Lei 13.709/2018). Backend: persist to DB + email notification. |
| **Footer with institutional data** | Legal and trust requirement. Visitors verify legitimacy. Google My Business and local SEO depend on consistent NAP (Name, Address, Phone). | Low | CNPJ, address (Recife/PE), phone numbers, email, social media links, tagline. |
| **Mobile-first responsive design** | 70%+ of Brazilian web traffic is mobile. WhatsApp CTA guarantees mobile-heavy audience. A desktop-only site loses the majority of potential clients. | Med | Architectural concern, not a bolt-on. Breakpoints: <640px / 640-1024px / >1024px. Hamburger nav on mobile, horizontal nav on desktop. Cards stack vertically on mobile. |
| **LGPD compliance notice** | Legal requirement since 2020. Contact form collecting personal data MUST have explicit consent and link to privacy policy. Non-compliance carries fines. | Low | Consent checkbox on form ("Ao enviar, voce concorda com nossa Politica de Privacidade"). Privacy policy link in footer. If analytics cookies are used, add minimal cookie banner (not a wall). |
| **Fast page load (Core Web Vitals)** | Google ranking factor. Brazilian mobile connections can be slow (3G/4G with high latency). Slow page = visitor leaves before seeing content. Critical for SEO. | Med | LCP < 2.5s, CLS < 0.1. SSG for static content, lazy load below-fold images, optimize fonts (preload, font-display: swap), WebP/AVIF images. |
| **SEO metadata** | Organic search is the primary discovery channel for local legal services. "mediacao recife", "conciliacao pernambuco" must find this page. | Low | Title, meta description, Open Graph tags, canonical URL. Local SEO keywords in content naturally. |
| **HTTPS** | Non-negotiable. Chrome marks HTTP as "not secure" -- devastating for a legal services site. | Low | Automatic with any modern hosting (Vercel, Netlify). Zero effort. |
| **Smooth scroll navigation** | Single-page sites need internal navigation. Sticky header with section links scrolling to anchors is the expected UX for landing pages. | Low | CSS `scroll-behavior: smooth` + nav links to section IDs. Active state indicator for current section. Offset for fixed header height. |

## Differentiators

Features that set PACIFIQUE! apart. Not expected by default, but make a strong impression and increase conversion. The competitive bar in Brazilian mediation chamber websites is genuinely low -- most are outdated, text-heavy, and desktop-only.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **"Vantagens do Credenciamento" dedicated section** | Most private chambers lack TJPE credential. This is PACIFIQUE!'s strongest competitive edge. A dedicated section explaining what judicial accreditation means for the CLIENT converts skeptics. | Low | Already in requirements. Frame as client benefits, not institutional bragging. "Seu acordo tem forca de titulo executivo" is a powerful selling point most visitors won't know about. |
| **Benefits framing for consumers AND businesses** | Most mediation chamber sites target one audience (typically corporate). PACIFIQUE! serves both B2C (consumer disputes) and B2B (corporate conflicts). Dual framing shows breadth. | Low | Two-column or tabbed section: "Para voce" (consumers) vs "Para sua empresa" (businesses). Different pain points, same resolution pathway. Already in requirements. |
| **Pre-filled WhatsApp messages by nucleus** | Instead of one generic WhatsApp button, add contextual CTAs within each nucleo card. Pre-fills WhatsApp message with the specific area. Better lead qualification before conversation starts. | Low | Each nucleo card gets a small WhatsApp icon/link. Message: "Ola! Tenho interesse em [Nucleo]. Vim pelo site." Team knows the subject before the conversation. Very low effort, high conversion impact. |
| **FAQ / Common questions section** | Answers objections visitors have: "Quanto custa?", "Quanto tempo demora?", "E obrigatorio?", "O acordo tem valor legal?", "Preciso de advogado?". Reduces friction before WhatsApp click. | Low | Accordion-style. 5-8 questions max. Answers in 2-3 sentences. NOT in current requirements but is a high-value, low-effort addition that addresses the biggest conversion killer: uncertainty. |
| **Interactive/animated process flowchart** | Visual step-by-step of the conciliation process with subtle scroll-triggered animations. Goes beyond a static image to create an engaging, polished experience. | Med | Intersection Observer for reveal animations. CSS/SVG flowchart. Keep to 200-300ms transitions per design guidelines. DO NOT overdo -- subtle reveals, not flashy motion. |
| **Schema.org structured data (JSON-LD)** | Rich snippets in Google: "Legal Services in Recife" with address, phone, practice areas. Most small legal service sites in Brazil don't implement this -- easy SEO win. | Low | `LegalService` or `ProfessionalService` + `Organization` + `LocalBusiness` schema types. Include address, phone, areas of practice. Add after content stabilizes. |
| **Accessibility beyond minimum (WCAG 2.1 AA+)** | Most Brazilian legal sites score poorly on accessibility. Proper semantic HTML, keyboard navigation, focus-visible styles, and ARIA labels set the site apart quietly but meaningfully. | Med | Semantic HTML, skip-to-content link, proper heading hierarchy (h1 > h2 > h3, no skipping), focus-visible styles, sufficient color contrast on all backgrounds. Benefits SEO and screen reader users. |
| **Email notification routing by interest area** | Route lead notifications to the relevant team member based on selected nucleus (e.g., family law leads to Amanda). Better response time and relevance. | Med | Conditional recipient in API route based on form `interest` field. Requires mapping nucleus to team member. |
| **Mediation vs. litigation comparison** | Explicitly show why mediation is faster, cheaper, and less adversarial than going to court. Converts visitors who are considering traditional litigation. | Low | Side-by-side comparison or bullet points. Speed (weeks vs. years), cost (fraction of litigation), outcome (collaborative vs. adversarial), enforceability (same legal force). |
| **Social proof via institutional credentials as visual badges** | Display CNJ resolution number, TJPE credential ID, and relevant law citations as styled badge elements. Not testimonials, but institutional authority signals. | Low | Badge/seal-style display. "Credenciada - Resolucao 125/2010 CNJ". Visual weight without requiring testimonials (which are unavailable and ethically constrained). |

## Anti-Features

Features to explicitly NOT build. Each has a clear reason for exclusion.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Fee/pricing table on public page** | Explicitly excluded in PROJECT.md. Fees are sensitive, vary by case complexity. Publishing invites price-shopping without context. Can create legal issues if fees change and page isn't updated. OAB advertising rules also restrict fee display in some interpretations. | "Entre em contato para valores" with WhatsApp/form CTA. "Como Funciona" section should mention that fees are discussed in initial consultation. |
| **Client testimonials / case studies** | No validated content exists yet (PROJECT.md). Fabricated testimonials for legal services are ethically problematic and potentially illegal under OAB (Brazilian Bar Association) advertising rules (Provimento 205/2021 restricts advertising of legal services). | Leave design system room to ADD testimonials later, but don't ship with unvalidated content. When real testimonials exist, add them. |
| **Blog or content area** | Adds significant complexity (CMS, content creation pipeline, SEO management) for v1. A blog without regular updates looks worse than no blog. The goal is conversion, not content marketing. | Defer to v2. If content marketing becomes a goal, build as a separate concern (headless CMS or static blog generator). |
| **Login / user registration** | Landing page is a top-of-funnel conversion tool. Auth adds complexity, security burden, and LGPD obligations without landing page value. Case management is a separate system. | Keep landing page stateless for visitors. Lead data goes to backend DB + email notification only. |
| **Online scheduling / calendar booking** | Mediation scheduling is inherently complex (multiple parties, mediator availability, preparation time, document review). A generic calendar widget oversimplifies and creates false expectations. Also requires significant backend integration. | WhatsApp conversation handles scheduling naturally. A human coordinates the session after initial contact. |
| **Live chat widget (Intercom/Tawk.to)** | Requires 24/7 staffing or AI chatbot. Unstaffed chat is worse than no chat -- unanswered messages destroy credibility. AI chatbot for legal services has liability concerns. | WhatsApp floating button IS the live chat. Familiar, async, persistent on both sides, requires no new infrastructure. |
| **Multi-language support** | PT-BR only per PROJECT.md. i18n infrastructure for a single-market, single-language landing page is premature. Adds routing and content management complexity. | Hardcode PT-BR strings. Extract to constants for potential future i18n, but don't build the infrastructure. |
| **Video backgrounds or auto-playing media** | Heavy assets kill Core Web Vitals. Auto-play video is hostile on mobile (data consumption on limited plans). The sketch/illustration brand style doesn't need video. | Use optimized static illustrations (WebP/AVIF). Hand-drawn coconut/beach aesthetic is distinctive without motion. |
| **Parallax scrolling or heavy animation** | Performance killer on mobile. Creates accessibility issues (vestibular/motion sensitivity, prefers-reduced-motion). Adds development complexity without conversion benefit. | Subtle scroll-triggered reveals (Intersection Observer) at most. Design guidelines specify 200-300ms transitions. Respect `prefers-reduced-motion` media query. |
| **Complex cookie consent popup/wall** | Aggressive popups kill conversion. LGPD applies to data collection, not all cookies. A landing page with minimal tracking needs minimal consent. | Simple notice on form: "Ao enviar, voce concorda com nossa Politica de Privacidade" with link. If analytics used, minimal bottom banner (not modal, not wall). |
| **Admin panel for leads** | Over-engineering for a 4-person team. Building a CRUD admin is weeks of work for something used by 4 people. | Email notifications + direct DB access (database dashboard) or simple CSV/spreadsheet export script. Revisit if lead volume exceeds manual management (~50+/month). |
| **Payment integration** | Mediation fees are negotiated per case. No standardized pricing for online payment. Would add PCI compliance burden. | Not applicable. Fees discussed and collected through traditional channels after engagement begins. |

## Feature Dependencies

```
Responsive Layout Foundation (cross-cutting, build FIRST)
  |
  +--> All visual sections depend on responsive grid
  +--> Mobile navigation (hamburger) must work before sections
  |
Hero Section (first section, no content deps)
  |
  +--> Smooth Scroll Navigation (needs section anchors from Hero + all sections)
  +--> WhatsApp Floating Button (positioned relative to viewport, not hero)
  |
Services Overview (O que fazemos)
  |
  +--> Nucleos de Atuacao (expands 3 service types into 7 specific areas)
        |
        +--> Contextualized WhatsApp CTAs (each nucleo links to pre-filled WhatsApp)
        +--> Contact Form "area of interest" dropdown (options match nucleos)
  |
Fontes Normativas (standalone content)
  |
  +--> Vantagens do Credenciamento (builds on normative sources, explains benefits)
  |
Como Funciona - Static Flowchart
  |
  +--> Benefits Section (benefits frame the outcomes shown in flowchart)
  +--> Animated Flowchart (enhancement layer on top of static version)
  |
FAQ Section (standalone, but content informed by all other sections)
  |
Contact Form (frontend)
  |
  +--> LGPD Consent checkbox + Privacy Policy (must exist BEFORE form goes live)
  +--> Backend API Route
        |
        +--> Input Validation (Zod schema)
        +--> Database Persistence (lead storage)
        +--> Email Notification Service
              |
              +--> Conditional Routing by Interest Area (enhancement)
  |
Footer
  |
  +--> Privacy Policy page/section (linked from footer, required by LGPD)
  |
SEO Metadata + Schema.org Structured Data
  |
  +--> Requires finalized content in all sections (add LAST, after content stable)
```

**Key architectural insight:** The **Contact Form** is the only feature with backend dependencies (database + email service). All other sections are purely static/presentational content. This naturally splits into two phases: static site first, then add dynamic form functionality.

## MVP Recommendation

### Phase 1 -- Core Static Site (ship first, start ranking in search)

Prioritize in this order:

1. **Responsive layout foundation** -- Mobile-first grid, navigation, breakpoints. Everything builds on this.
2. **Hero section with brand identity + WhatsApp CTA** -- First impression + primary conversion. Nothing else matters if these don't work.
3. **WhatsApp floating button** -- Always visible. Pre-filled message. This is the conversion workhorse and works even without the form.
4. **All content sections** -- Services, Nucleos, Team, Process flowchart, Benefits, Legal references, Credentialing advantages. These are all static content with no backend deps.
5. **Footer with institutional data** -- CNPJ, address, contacts.
6. **Smooth scroll navigation** -- Sticky header with section links.
7. **SEO metadata** -- Title, description, Open Graph tags.

### Phase 2 -- Lead Capture (requires external service setup)

8. **Contact form with validation** -- Frontend form with client-side validation.
9. **Backend API route** -- Server-side validation (Zod), rate limiting.
10. **Database setup** -- Lead persistence.
11. **Email notification** -- Send notification on new lead.
12. **LGPD consent** -- Checkbox + privacy policy link.

### Phase 3 -- Polish and Enhancement

13. **Contextualized WhatsApp CTAs per nucleo** -- Low effort, high conversion boost.
14. **FAQ section** -- Low effort, addresses conversion-killing objections.
15. **Scroll-triggered animations** -- Subtle reveals on the flowchart and cards.
16. **Schema.org structured data (JSON-LD)** -- SEO rich snippets.
17. **Email routing by interest area** -- Better lead qualification.
18. **Accessibility audit and fixes** -- Verify WCAG 2.1 AA compliance.

### Rationale

Get the static content live first -- it can immediately start ranking in search engines and be shared via WhatsApp/social media. The form/backend is Phase 2 because it requires external service accounts (database, email provider) and has the only backend complexity. WhatsApp alone handles conversion while the form is being built. Polish features are genuinely optional and can ship incrementally.

## Competitive Landscape

Brazilian mediation chambers (competitors in Recife/PE and nationally) typically have websites that are:

- **Visually outdated** -- template-based designs from 2015-2020 era, not mobile-optimized
- **Desktop-first** -- poor mobile experience despite mobile-dominant audience
- **Text-heavy** -- dense legal language that intimidates rather than converts
- **Slow to load** -- unoptimized images, heavy WordPress/Joomla themes
- **Missing WhatsApp integration** -- contact forms only, or just a phone number
- **No structured data** -- invisible to Google rich snippets
- **Poor accessibility** -- no ARIA labels, broken heading hierarchy, low contrast
- **No process transparency** -- don't explain what happens after you contact them

PACIFIQUE!'s opportunity: a clean, fast, mobile-first, WhatsApp-first landing page with clear process explanation already outperforms 90% of competitors. The bar is genuinely low. The biggest win is simply being modern, fast, and clear.

**Confidence note:** Competitive claims are based on domain expertise with Brazilian legal service websites, not live verification of specific competitor sites. Recommend spot-checking 3-5 competitors (mediare.com.br, camarb.com.br, cbma.com.br, cceal.com.br) to validate the competitive gap assessment.

## Sources

- PROJECT.md and CLAUDE.md project context documents (HIGH confidence -- primary source)
- LGPD compliance requirements per Lei 13.709/2018 (HIGH confidence -- well-established law)
- OAB advertising restrictions per Provimento 205/2021 (MEDIUM confidence -- general knowledge, specific rules should be verified for mediation chambers vs. law firms)
- Core Web Vitals targets per Google published thresholds (HIGH confidence -- well-established standards)
- Schema.org LegalService/ProfessionalService types (HIGH confidence -- stable specification)
- Brazilian web user behavior patterns: mobile dominance, WhatsApp prevalence (HIGH confidence -- well-documented market characteristics)
- Competitive landscape for Brazilian mediation chamber websites (MEDIUM confidence -- based on domain expertise, not live-verified during this session)
