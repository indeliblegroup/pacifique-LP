# Pitfalls Research

**Domain:** Institutional landing page for a private mediation/conciliation chamber (PACIFIQUE!, Recife/PE, Brazil)
**Researched:** 2026-03-04
**Confidence:** MEDIUM (web search unavailable; findings based on established domain patterns for Brazilian legal services, LGPD compliance, mobile-first landing pages, and WhatsApp CTA patterns. Core patterns are stable in this domain but specific 2026 regulatory updates could not be verified.)

## Critical Pitfalls

### Pitfall 1: LGPD Non-Compliance Beyond the Checkbox

**What goes wrong:**
The contact form collects personal data (name, email, phone, message, tipo de interesse) with only superficial LGPD compliance -- a consent checkbox and a boilerplate privacy policy link. But LGPD (Lei 13.709/2018) requires more than that. Specifically: the "tipo de interesse" field reveals the nature of a legal dispute (family law, debt, health insurance) which may constitute sensitive data under LGPD Art. 11. Email notifications containing this data are sent over an insecure channel. Lead data is stored indefinitely with no retention policy. No mechanism exists for data subjects to exercise their rights (access, correction, deletion per LGPD Arts. 17-22). A mediation chamber that violates data protection law faces not just ANPD fines (up to 2% of revenue per infraction) but devastating reputational damage -- a legal institution that cannot comply with the law it is supposed to help enforce.

**Why it happens:**
Developers treat LGPD as a UI feature (add a checkbox, link to a policy page) rather than a data governance requirement that spans the entire stack: form design, data transmission, storage, access, retention, and deletion.

**How to avoid:**
1. Consent must be opt-in (not pre-checked), specific to each purpose, and revocable.
2. Store the consent timestamp with the lead record: `consentedAt: Date`, `consentVersion: string`.
3. The form must display a clear data processing notice BEFORE submission: what data is collected, why, who processes it, how long it is retained, and how to request deletion.
4. Link to a real, reviewed Privacy Policy page (not a placeholder -- a dedicated page with actual content reviewed by the founding lawyers).
5. The "tipo de interesse" field reveals legal dispute categories. Do NOT include it in email notification bodies (email is not encrypted). Store it encrypted at rest in the database.
6. Implement a data retention policy: leads that do not convert should be purged after a defined period (90-180 days).
7. Provide a mechanism for data subject rights: at minimum, an email contact for data requests mentioned in the privacy policy.
8. If using ANY third-party tracking (Google Analytics, Meta Pixel, etc.), a cookie consent banner is mandatory. Even Google Fonts sends visitor IP to Google -- this requires consent or self-hosting.
9. Validate the Zod schema to include `consent: z.literal(true)` server-side so the field cannot be bypassed.

**Warning signs:**
- Privacy policy page does not exist, is Lorem Ipsum, or is a generic English-language template
- Consent checkbox is pre-checked
- Lead data is stored indefinitely with no TTL or purge mechanism
- "Tipo de interesse" (legal dispute category) appears in plain text in notification emails
- No mention of data subject rights in the privacy policy
- Google Fonts loaded from Google CDN without cookie consent

**Phase to address:**
Foundation phase (form + backend). The privacy policy content must be drafted and reviewed by the legal team in parallel with form development. Backend lead storage must include consent tracking and retention logic from day one. Do not defer this to "post-launch hardening."

---

### Pitfall 2: Legal Credibility Undermined by Generic Design

**What goes wrong:**
The landing page looks like a generic corporate template rather than a credentialed legal institution. Users seeking mediation/conciliation are often in stressful situations (family disputes, debt, health insurance denials) and need to trust the institution with sensitive personal matters. A site that looks like every other small business landing page fails to convey the CNJ/TJPE credentialing that is PACIFIQUE!'s core differentiator. The "Fontes Normativas" section (Resolucao 125/2010 CNJ, Resolucao 410/2018 TJPE, Lei de Mediacao) gets buried mid-page and styled the same as marketing copy, losing its institutional weight.

**Why it happens:**
Developers focus on technical implementation and treat content sections as interchangeable blocks. The TJPE credential -- which means the Judiciary actively refers cases to this chamber -- is treated as just another bullet point. Legal citations are abbreviated casually. The team section uses placeholder avatars. No CNPJ or OAB registrations are visible.

**How to avoid:**
1. The CNJ/TJPE credentialing must be visually prominent -- not just text in a mid-page section. Place a credential badge/seal near the hero or immediately below it. "Credenciada pelo TJPE nos termos da Resolucao n. 410/2018" with visual emphasis.
2. Legal references must be precise: "Resolucao n. 125/2010 do CNJ" (correct), not "Resolucao 125 CNJ" (sloppy). Legal professionals notice.
3. The "Quem Somos" section needs proper treatment. If professional photos are not available at launch, use the hand-drawn illustration style from the brand identity (coqueiros/praia line art) for team portraits rather than generic avatar silhouettes or stock photos.
4. Avoid ALL stock photography. Legal stock photos (handshakes, gavels, scales of justice) are universally recognized as fake and reduce credibility.
5. Footer must include: CNPJ (65.218.388/0001-47), full address in Recife/PE, OAB registrations of the lawyers, and contact information. This is both a legal expectation and a trust signal in Brazil.
6. The tagline "Nao complique, PACIFIQUE!" should be used strategically -- it is memorable and approachable, but must be balanced with institutional gravitas in the surrounding context.
7. Content copy must be reviewed and approved by the founding lawyers before any deployment. Incorrect legal citations on a law firm's website is a credibility catastrophe.

**Warning signs:**
- Credentialing information is below the fold with no visual emphasis
- Legal citations are informal, abbreviated, or (worst case) incorrect
- Team section uses placeholder images or no images
- No CNPJ or OAB numbers visible anywhere on the page
- The site could belong to any industry if you removed the text content
- Content copy was written by a developer without legal review

**Phase to address:**
Design + Content phase. Trust signals and legal formatting must be reviewed by founding lawyers before implementation begins. Content is a first-class deliverable, not filler to be "replaced later." This is the single most domain-specific pitfall.

---

### Pitfall 3: WhatsApp CTA That Breaks Across Platforms or Leaks Context

**What goes wrong:**
The floating WhatsApp button uses a `wa.me` link that: (a) fails on desktop browsers where WhatsApp Web is not installed or logged in, (b) opens with no pre-filled message leaving users confused about what to say, (c) uses wrong phone number formatting (missing country code, extra characters), or (d) includes sensitive information in the pre-filled message URL (which gets logged in browser history). On mobile, the button overlaps critical content -- especially the form submit button or the bottom of text sections.

**Why it happens:**
Developers copy-paste a WhatsApp snippet and test only on their own phone. The `wa.me` protocol has different behaviors across iOS, Android, and Desktop. The floating button positioning is tested at one viewport width.

**How to avoid:**
1. Use `https://wa.me/5581987900892?text=` format: digits only, country code `55` + DDD `81` + number. No `+`, no spaces, no dashes, no parentheses.
2. Always include a pre-filled message: `?text=Ola!%20Gostaria%20de%20saber%20mais%20sobre%20os%20servicos%20da%20PACIFIQUE!` -- generic enough to not leak sensitive info.
3. NEVER include the user's selected "tipo de interesse" or any personal data in the WhatsApp pre-filled URL. The URL appears in browser history.
4. The floating button z-index strategy must account for: cookie consent banner (above it), mobile nav menu (above it), and form submit button (no overlap). Test at 320px, 375px, and 414px viewport widths.
5. Add `aria-label="Abrir conversa no WhatsApp"` for accessibility.
6. On iOS Safari, account for the bottom toolbar: use at least 16px margin from viewport bottom. Prefer `bottom-6 right-6` in Tailwind terms.
7. Consider making the float collapsible/minimizable so users can dismiss it when it is in the way.
8. On desktop, the link opens WhatsApp Web or prompts download. Test this flow explicitly. A tooltip like "Abre no WhatsApp Web" manages expectations.

**Warning signs:**
- WhatsApp button tested only on developer's own phone (one platform)
- No pre-filled message -- users open WhatsApp to an empty chat
- Button overlaps form fields or other CTAs at narrow mobile viewports
- Pre-filled message contains dynamic user data
- Phone number in link has formatting characters

**Phase to address:**
UI implementation phase. Must be tested across iOS Safari, Android Chrome, and desktop Chrome/Firefox. Include cross-platform WhatsApp testing as a phase exit criterion.

---

### Pitfall 4: Client-Only Form Validation and Missing Error States

**What goes wrong:**
The contact form validates only on the client side. Bots submit garbage data directly to the API endpoint via POST requests, flooding the database and email inbox. Additionally, the form has no proper error handling: if the API returns a 500, the user sees an infinite spinner or nothing. No feedback on what went wrong.

**Why it happens:**
Developer builds the form with React Hook Form + Zod, adds client-side validation, and considers it done. Forgets that anyone can POST directly to the API route bypassing client validation entirely. Error states are an afterthought.

**How to avoid:**
1. Share the same Zod schema between client and server. Always validate server-side before persisting.
2. Add a honeypot field: a hidden input named something like `website` that real users never fill but bots always populate. Reject submissions where the honeypot is filled.
3. Handle four explicit form states: idle, submitting, success, error.
4. On success: show "Mensagem enviada com sucesso! Entraremos em contato em breve." Reset the form.
5. On error: show "Houve um erro ao enviar. Tente novamente ou fale conosco pelo WhatsApp." with a direct WhatsApp link as fallback.
6. On validation error: show per-field error messages in Portuguese.
7. Add a client-side timeout: if the API does not respond in 10 seconds, show an error rather than an infinite spinner.
8. Rate-limit the API endpoint: 5 submissions per IP per hour is reasonable. More than that is likely abuse.

**Warning signs:**
- Sudden spike in lead submissions (bot attack)
- Leads with gibberish names/emails arriving in patterns (every 2 seconds, at 3 AM)
- Users reporting "the form does nothing" or "I submitted but nothing happened"
- Duplicate leads from the same user (they retried because no feedback)

**Phase to address:**
Backend + form implementation phase. Server-side validation and honeypot must be implemented alongside the form, not deferred. Error states are part of the form UI, not a separate task.

---

### Pitfall 5: Lead Form Works But Leads Never Get Read

**What goes wrong:**
The form is technically correct -- data saves, email sends -- but in practice, leads go cold because: the notification email lands in spam, no one checks the inbox regularly, there is no urgency system, and response time exceeds 24 hours. For mediation/conciliation, timing is critical -- parties in conflict have a narrow window of receptivity before they escalate to litigation.

**Why it happens:**
Developers consider the feature "done" when the technical pipeline works (form -> API -> database -> email). But the business value is in the human response loop, which is entirely outside the software.

**How to avoid:**
1. Test email notifications with the ACTUAL recipient addresses (carlosh@bmadvocacia.com.br, amandal@bmadvocacia.com.br) BEFORE launch. Custom domain email servers (bmadvocacia.com.br) may have aggressive spam filters.
2. Configure SPF/DKIM/DMARC for the sending domain so emails pass authentication checks.
3. Use a transactional email service (Resend is already in the stack) -- never raw SMTP or Gmail SMTP for production.
4. The notification email should include the lead's phone number prominently so the team can WhatsApp them back immediately (the channel the team actually uses).
5. Set expectations on the form: "Responderemos em ate 24 horas uteis." Then build the process to honor that promise.
6. Send an auto-reply to the lead confirming receipt: "Recebemos sua mensagem. Nossa equipe entrara em contato em breve."
7. Fire-and-forget the email: `sendEmail(data).catch(console.error)`. The database insert is the critical path. If email fails, the lead is still saved.
8. Consider a simple notification to a WhatsApp group via WhatsApp Business API or a webhook to a Slack-like channel -- meet the team where they already are.

**Warning signs:**
- Email delivery tested only with developer Gmail addresses
- No auto-reply mechanism for leads
- No defined process for who responds and within what timeframe
- Form success message is generic with no next-step guidance
- The Resend free tier (100 emails/day) gets consumed by spam -- real notifications fail

**Phase to address:**
Backend implementation + pre-launch validation. Email deliverability must be verified with actual recipient addresses before go-live. The human response process should be documented as a launch readiness criterion.

---

### Pitfall 6: Accessibility Violations Creating Legal Liability for a Legal Firm

**What goes wrong:**
A mediation chamber that handles consumer rights, health law, and family law publishes a website that fails basic accessibility standards. This creates legal exposure under LBI (Lei Brasileira de Inclusao, Lei 13.146/2015) and is reputationally devastating for a legal institution. People with disabilities have a constitutional right to access information (CF/88, Art. 5).

**Why it happens:**
Accessibility is treated as an afterthought. The purple/mauve color palette risks contrast ratio failures. Custom illustrations lack alt text. Form fields rely on placeholder text instead of labels. Smooth scroll animations are not motion-safe.

**How to avoid:**
1. Verify ALL color combinations against WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text). Specific risks in the PACIFIQUE! palette:
   - `#6B6B6B` on `#FFFFFF`: ~5.4:1 ratio -- passes AA but borderline. Consider darkening to `#595959` for safety margin.
   - `#6B6B6B` on `#F5F3F7` (lavender): ~4.6:1 -- may FAIL depending on exact rendering. Test carefully.
   - `#FFFFFF` on `#4A3F5C` (accent-deep cards): ~9.4:1 -- passes.
   - `#7A2048` on `#FDE8EC` (rose cards): ~5.8:1 -- passes but verify.
2. All illustrations must have descriptive `alt` text in Portuguese. Decorative illustrations use `alt=""` with `aria-hidden="true"`.
3. Form fields MUST have visible `<label>` elements -- not just placeholder text. Placeholders disappear on input and are not reliably announced by screen readers.
4. Smooth scroll must respect `prefers-reduced-motion`: `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }`.
5. WhatsApp floating button must be keyboard-focusable with `aria-label`.
6. Page must use semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>` with `aria-labelledby`, `<footer>`. Single `<h1>` in hero, `<h2>` per section, `<h3>` for subsections.
7. Add a skip-to-content link as the first focusable element.
8. Run axe-core or Lighthouse accessibility audit as part of QA.

**Warning signs:**
- Color palette chosen for aesthetics without contrast ratio verification
- Form fields use only placeholder text
- No `prefers-reduced-motion` handling
- Heading hierarchy is broken (multiple h1s, skipped levels)
- No skip-to-content link
- Illustrations have no alt text or boilerplate English alt text

**Phase to address:**
Design phase (color contrast verification before implementation). Implementation phase (semantic HTML, ARIA, labels). QA phase (axe-core audit as gate -- zero critical/serious violations).

---

### Pitfall 7: Mobile-First Lip Service (Desktop Designed, Then Shrunk)

**What goes wrong:**
Despite declaring "mobile-first," the page is designed for desktop and responsively adjusted for mobile. Results: (a) text-heavy sections become walls of text, (b) the 7 Nucleos de Atuacao cards stack into endless scroll, (c) the flow diagram becomes illegible, (d) touch targets are too small, and (e) iOS Safari quirks are not handled.

**Why it happens:**
Developers work on large screens. "Mobile-first" CSS (min-width media queries) is used, but the mental model is desktop-centric. The content volume -- 7 nucleos, 4 team members, 3 legal sources, multi-step process diagram, contact form -- is substantial and overflows on small screens.

**How to avoid:**
1. Design and develop at 375px viewport width FIRST. Chrome DevTools is not enough -- test on physical iOS and Android devices.
2. For 7 Nucleos: use a horizontally scrollable card carousel on mobile, or show only the nucleo name with expand/collapse accordion for descriptions. Do NOT vertically stack 7 full cards.
3. For the flow diagram: redesign as a vertical stepped timeline on mobile, not a shrunk horizontal diagram.
4. Minimum touch targets: 44x44px (Apple HIG) / 48x48dp (Material Design). Apply to all buttons, links, form inputs.
5. iOS Safari specifics: bottom toolbar hides/shows on scroll (affects fixed elements), `100vh` is not viewport height (use `100dvh`), form inputs with font-size below 16px trigger auto-zoom.
6. Test with mobile network throttling (3G). Users in Recife access via 4G/3G, not just Wi-Fi.
7. The page should not exceed 8-10 scroll heights on mobile -- if it does, content needs condensing or progressive disclosure.

**Warning signs:**
- Design mockups created at desktop width first
- Mobile testing done only in browser DevTools
- Form input font size below 16px (causes iOS zoom)
- Horizontal overflow at any mobile breakpoint
- The page is more than 10 full scrolls on mobile

**Phase to address:**
Design phase (mobile-first wireframes before desktop). Implementation phase (min-width breakpoints, `100dvh`, 16px minimum font on inputs). QA phase (physical device testing as exit criterion).

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoding team data in components | Faster initial build | Any team change requires code deployment and developer involvement | MVP only -- extract to `lib/constants.ts` before launch |
| Using Gmail SMTP for email notifications | Zero cost, quick setup | 500/day limit, unreliable delivery, "via gmail.com" header looks unprofessional for a law firm | Never for production -- use Resend from day one |
| Skipping cookie consent because "no tracking" | Less UI complexity | If analytics is added later (inevitable), retroactive consent is legally questionable. Google Fonts also counts as third-party data transfer. | Only if truly zero third-party requests AND self-hosted fonts -- document this decision |
| Inline styles instead of design tokens | Faster prototyping | Brand color changes require find-and-replace across all files | Never -- define CSS variables or Tailwind theme from day one |
| Skipping image optimization pipeline | Fewer build tools | LCP failure on mobile, excessive data for metered 3G/4G connections | Never for a mobile-first landing page |
| No auto-reply email to leads | Simpler backend | Leads wonder if their submission worked; call a competitor while waiting | Acceptable for first week of MVP only -- implement within first iteration |
| Privacy policy as a modal instead of a page | No extra routing needed | Not crawlable by search engines, harder to link to, may not satisfy LGPD requirement for "easy access" | Never -- use a proper page |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| WhatsApp `wa.me` links | Phone number with formatting characters (`+55 (81) 98790-0892`) | Digits only: `https://wa.me/5581987900892`. No +, no spaces, no dashes, no parens. |
| Resend email API | Blocking the API response on email delivery (`await sendEmail()`) | Fire-and-forget: `sendEmail(data).catch(console.error)`. DB insert is the critical path. Email failure should not fail the form submission. |
| Resend sender domain | Using `onboarding@resend.dev` (free tier default) in production | Verify a custom sending domain (e.g., `noreply@pacifique.com.br`) for deliverability and professionalism. Without this, emails may land in spam. |
| Google Analytics / Tag Manager | Adding tracking scripts without cookie consent | Implement consent-first loading: block GA/GTM scripts until user opts in. If no tracking in v1, document the decision so analytics is added WITH consent when the time comes. |
| Google Fonts CDN | Loading fonts from `fonts.googleapis.com` without consent | Google Fonts sends visitor IP to Google servers. Self-host all fonts instead: download from Google Fonts, serve from own domain. Use `next/font` which does this automatically. |
| reCAPTCHA for spam prevention | Adding reCAPTCHA without considering LGPD implications | reCAPTCHA sends data to Google. Prefer a honeypot field (no LGPD implications) or Cloudflare Turnstile (privacy-friendly alternative). |
| Google Maps embed | Embedding via iframe without consent | Google Maps sets cookies and transmits visitor data. Use a static map image instead, or include Maps in the cookie consent flow. |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Unoptimized hero illustration (large PNG/SVG) | LCP > 4s on mobile, hero is the LCP element | Use Next.js `<Image>` with `priority` prop. Serve WebP/AVIF. Inline small SVGs. Preload hero image. | Immediately on 3G connections -- common for Recife consumer audience on metered data |
| Custom fonts blocking render (FOIT) | Flash of invisible text for 1-3 seconds on first visit | Use `next/font` for automatic self-hosting + optimization. `font-display: swap`. Limit to 2 font families max. | First visit on any slow connection |
| 7 nucleo cards + 4 team members + flow diagram = large DOM | TTI > 5s, excessive DOM nodes (>1500), sluggish scroll | Lazy-load below-fold sections with `content-visibility: auto`. Consider intersection-observer-based loading. | Mid-range Android devices (Samsung A-series, Motorola G-series) dominant in Brazil |
| Smooth scroll JS library | Adds bundle size, jank on low-end devices | Native CSS `scroll-behavior: smooth` on `html`. No JS library needed. | Low-end Android with limited RAM |
| Entrance animations on every section | Janky scrolling, excessive repaints, battery drain | Use `IntersectionObserver` (not scroll listeners). Minimal animations. Respect `prefers-reduced-motion`. | Any device with 3+ simultaneous animations |
| No code splitting for below-fold content | Entire page JS loads upfront even if user bounces from hero | Dynamic imports for heavy below-fold components (e.g., the flow diagram if it uses a charting library). Next.js automatic code splitting helps but verify. | First contentful paint on 3G |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| No server-side form validation | Bots submit XSS payloads via form fields; stored XSS when anyone reads leads | Sanitize ALL inputs server-side. Use parameterized queries. Escape output in any admin view. Share Zod schema between client and server. |
| Email header injection via form fields | Attacker injects CC/BCC headers through name or email fields, turning notification system into a spam relay | Validate email format strictly server-side. Strip newlines and carriage returns from ALL fields before including in email construction. |
| Unprotected lead read API endpoint | Anyone who discovers the API URL can read all submitted leads (names, phones, legal interests) | Protect admin/read endpoints with authentication. Even without an admin UI in v1, the API must not be publicly readable. |
| Environment variables exposed in client bundle | Database URL or Resend API key appears in browser JS | Never prefix server-only vars with `NEXT_PUBLIC_`. DB and email operations only in API routes / Server Actions. |
| No rate limiting on form endpoint | DDoS or bot flood consumes Resend quota, fills database, buries real leads | Rate limit: 5 submissions per IP per hour. Use middleware or edge function for this. |
| No HTTPS enforcement | Browser shows "Not Secure" -- devastating for a legal institution | HTTPS by default on Vercel/Netlify. Verify HSTS is enabled. Check all resources load over HTTPS (no mixed content). |
| Lead data includes "tipo de interesse" in unencrypted email | Sensitive legal dispute category (family, debt, health) visible in email transit and storage | Do not include "tipo de interesse" in notification email body. Reference it only by a link to the admin/database view. Or encrypt the field at rest. |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Jargon-heavy legal copy without explanation | Target audience (consumers with disputes) does not understand "autocomposicao," "titulo executivo extrajudicial," "caucus" | Plain language first, legal terms in parentheses: "Acordo com forca legal (titulo executivo extrajudicial)." Legal terms build credibility; plain language builds understanding. |
| Form asks for too much information upfront | Each additional field reduces conversion ~10%. Asking "tipo de interesse" forces users to categorize their own legal problem, which they may not know how to do. | Minimum viable form: Name + Phone (for WhatsApp follow-up). Email and tipo de interesse should be optional. Qualify the lead in the WhatsApp conversation. |
| No clear hero value proposition | Users cannot tell within 5 seconds what PACIFIQUE! does, why it matters to them, and what to do next | Hero answers three questions: "O que e?" (Camara de Conciliacao e Mediacao), "Por que me importa?" (Resolva conflitos sem ir ao Judiciario), "O que faco?" (WhatsApp CTA) |
| Floating WhatsApp button covers content | Users cannot read text or tap links beneath the floating button | Make the float collapsible/dismissable. On form sections, reposition or temporarily hide it. Test at 320px width. |
| Flow diagram illegible on mobile | The 3-phase process shown as a horizontal flowchart shrinks to unreadable size | Vertical stepper/timeline on mobile. Each step as its own card with number, title, brief description. |
| All 7 nucleos displayed identically | Users must read all 7 to find the one relevant to them, creating cognitive overload | Visual differentiation via icons. Group by audience (Consumer: aereo/bancario/saude, Family: familia/sucessoes, Other: restaurativas/empresariais). Consider an interactive filter or tabs on mobile. |
| Success message disappears or is below the fold | User submits form, sees no confirmation, thinks it failed, resubmits | Show success message prominently in place of the form. Scroll to it if necessary. Include "what happens next" copy. |
| No fallback when WhatsApp is the only CTA | Users who do not use WhatsApp (elderly, institutional users) have no alternative | Phone number for traditional calls. Email contact. The lead form itself as an alternative channel. |

## "Looks Done But Isn't" Checklist

- [ ] **Lead form server-side validation:** Submit with JS disabled, with XSS payloads in each field, and via curl with missing required fields. If any submission succeeds without proper validation, it is not done.
- [ ] **WhatsApp link cross-platform:** Tap the button on iOS Safari, Android Chrome, and click on desktop Chrome. Pre-filled message must appear correctly. Phone number must resolve to the right contact.
- [ ] **Email delivery to actual recipients:** Trigger a test lead to carlosh@bmadvocacia.com.br and amandal@bmadvocacia.com.br. Check inbox AND spam folder. If it lands in spam, it is not done.
- [ ] **Privacy policy page:** Click the consent link. The page must exist, contain real reviewed content (not placeholder), be in Portuguese, and address LGPD requirements (data collected, purposes, retention, rights).
- [ ] **Meta tags and SEO:** View page source. Check `<title>` is not "Next.js App" or "Vite App." Check `<meta name="description">` exists and is in Portuguese. Check JSON-LD structured data. Check Open Graph tags.
- [ ] **Favicon and PWA:** Check browser tab icon is the PACIFIQUE! logo, not a generic framework icon. Check Apple touch icon on iOS. Check social share preview (WhatsApp link preview is critical for a WhatsApp-first business).
- [ ] **404 handling:** Navigate to `/nonexistent-path`. Must show a branded page or redirect to home, not a framework error.
- [ ] **HTTPS enforcement:** Visit `http://` explicitly and confirm redirect to `https://`.
- [ ] **Footer completeness:** Must contain CNPJ (65.218.388/0001-47), physical address in Recife/PE, contact phone(s), email, and OAB registrations of the lawyers.
- [ ] **Color contrast:** Run every color combination in the palette through a WCAG contrast checker. Especially `#6B6B6B` on `#F5F3F7` -- likely borderline.
- [ ] **Mobile form zoom:** Fill out the form on an actual iPhone. If the page zooms in when you tap an input field, the font-size is below 16px.
- [ ] **WhatsApp link preview:** Share the landing page URL via WhatsApp. The preview must show the correct title, description, and OG image -- not a blank preview or "Next.js App."
- [ ] **Honeypot field:** Submit the form with the honeypot filled via curl. The submission must be silently rejected.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| LGPD non-compliance discovered post-launch | MEDIUM | Add consent checkbox immediately. Draft and publish privacy policy (needs legal review). Audit existing lead data. Implement retention/deletion. If data was mishandled, may require notification to ANPD. |
| WhatsApp link broken on one platform | LOW | One-line URL fix. But leads lost during the broken period are unrecoverable. Set up uptime monitoring. |
| Lead emails going to spam | MEDIUM | Switch to Resend with verified custom domain. Configure SPF/DKIM/DMARC. Check spam folder for missed leads and contact them manually. |
| Generic design lacking trust signals | MEDIUM-HIGH | Adding trust badges, credential seals, and CNPJ/OAB info post-launch is technically easy but requires design revision and content creation. The reputational damage of the initial impression is harder to recover. |
| Poor Core Web Vitals | MEDIUM | Lighthouse audit. Optimize images (biggest win). Self-host fonts. Lazy-load below-fold. Typically 1-2 days of work. |
| Accessibility lawsuit / complaint | HIGH | Full audit (axe-core + manual screen reader testing). Fix all critical issues. Publish accessibility statement. Takes 1-2 weeks and may need professional audit. Reputational damage for a legal firm is severe. |
| SEO invisibility after months | MEDIUM | Verify SSR is serving HTML. Add structured data. Submit sitemap to Search Console. Set up Google Business Profile. Results take 4-8 weeks to materialize. Lost organic traffic in the interim is unrecoverable. |
| Content errors (wrong legal citations) | LOW (code) / HIGH (reputation) | Code fix is trivial. But displaying incorrect Resolucao numbers or wrong Lei references on a legal institution's website is a credibility catastrophe. Prevention (legal review) is infinitely cheaper. |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| LGPD non-compliance | Foundation (backend + form) | Privacy policy reviewed by legal team; consent flow tested E2E; data retention policy documented; consent timestamp stored |
| Legal credibility gaps | Design + Content | Content reviewed and approved by founding lawyers; CNJ/TJPE credential visually prominent; all legal citations verified; CNPJ/OAB in footer |
| WhatsApp CTA issues | UI Implementation | Link tested on iOS Safari, Android Chrome, desktop Chrome; pre-filled message verified; button position at 320px/375px/768px/1024px |
| Client-only validation / no error states | Backend + Form Implementation | Server-side validation tested via curl; honeypot verified; all 4 form states (idle/loading/success/error) verified |
| Lead response loop failure | Backend + Pre-launch | Email delivered to actual bmadvocacia.com.br addresses; auto-reply configured; lead response process documented and assigned |
| Accessibility violations | Design (contrast) + Implementation (semantic HTML) + QA | axe-core zero critical/serious; keyboard navigation tested; skip-to-content link present; contrast ratios verified |
| Mobile-first failures | Design (wireframes) + Implementation + QA | Developed and tested at 375px first; physical device testing; Core Web Vitals passing on mobile 3G; no iOS zoom on form inputs |
| Form spam / security | Backend Implementation | Rate limiting tested; injection payloads rejected; honeypot working; API read endpoint protected |
| Performance / Core Web Vitals | Implementation + QA | Lighthouse performance >90 mobile; LCP <2.5s on 3G; fonts self-hosted; images optimized |
| SEO neglect | Architecture (SSR) + Implementation (meta) + Pre-launch | View-source has full HTML; structured data validates; sitemap submitted; Google Business Profile linked |
| Environment variable exposure | Architecture + Implementation | No `NEXT_PUBLIC_` on secrets; verified in production build |
| Google Fonts LGPD | Architecture | All fonts self-hosted via `next/font`; no external font requests verified in Network tab |

## Sources

- LGPD (Lei 13.709/2018) -- Arts. 7 (legal bases), 11 (sensitive data), 17-22 (data subject rights), 52 (sanctions). HIGH confidence -- stable statutory law.
- LBI (Lei 13.146/2015) -- digital accessibility requirements. HIGH confidence -- stable statutory law.
- WCAG 2.1 AA accessibility standards. HIGH confidence -- W3C stable specification.
- Core Web Vitals thresholds (LCP <2.5s, INP <200ms, CLS <0.1). MEDIUM confidence -- thresholds current as of early 2025. Google may have updated (FID replaced by INP in March 2024).
- WhatsApp `wa.me` URL protocol. HIGH confidence -- stable API format for years.
- Honeypot spam prevention technique. HIGH confidence -- well-established pattern.
- Next.js `next/font` self-hosting and `<Image>` optimization. HIGH confidence -- stable features.
- Google Fonts LGPD implications. MEDIUM confidence -- based on EU court ruling (Germany, Jan 2022) interpreted analogously under LGPD. Specific ANPD guidance not verified.
- Brazilian mobile device landscape (Samsung A-series, Motorola G-series dominance). MEDIUM confidence -- general patterns stable but 2026-specific data not verified.
- Resend email service behavior (rate limits, domain verification). MEDIUM confidence -- based on training data; may have updated plans/limits.

---
*Pitfalls research for: Institutional landing page for private mediation/conciliation chamber (PACIFIQUE!, Recife/PE, Brazil)*
*Researched: 2026-03-04*
