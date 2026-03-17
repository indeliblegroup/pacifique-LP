# Architecture Research: PACIFIQUE! Institutional Landing Page

**Domain:** Professional landing page with lead capture and backend integration
**Researched:** 2026-03-04
**Confidence:** HIGH

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js App)                         │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                     PRESENTATION LAYER                       │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │ │
│  │  │   Hero   │ │ Services │ │  Team /  │ │   Footer     │   │ │
│  │  │ Section  │ │ & Nuclei │ │  Legal   │ │   + Map      │   │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │ │
│  │                                                              │ │
│  │  ┌──────────────────────┐ ┌────────────────────────────┐    │ │
│  │  │  WhatsApp FAB        │ │  Contact Form (Lead Cap.)  │    │ │
│  │  │  (Floating Button)   │ │  + LGPD Consent            │    │ │
│  │  └──────────────────────┘ └────────────────────────────┘    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                             │                                     │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                      API ROUTE LAYER                         │ │
│  │  ┌─────────────────────────────────────────────────────┐    │ │
│  │  │           /api/leads (Server Action or Route)        │    │ │
│  │  │  - Validate input (Zod)                             │    │ │
│  │  │  - Persist to database                              │    │ │
│  │  │  - Send email notification                          │    │ │
│  │  │  - Return success/error                             │    │ │
│  │  └─────────────────────────────────────────────────────┘    │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
              ┌─────┴─────┐      ┌──────┴──────┐
              │ Database  │      │   Email     │
              │ (SQLite/  │      │  (Resend)   │
              │  Turso)   │      │             │
              └───────────┘      └─────────────┘
```

## Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Page Shell | Single-page layout, section ordering, nav scroll | Next.js `page.tsx` with section components |
| Hero Section | Brand impression, tagline, primary CTA | Static content, illustration, CTA buttons |
| Service Sections | Display services, nuclei, legal framework, process flow | Static content cards, grid layouts |
| Team Section | Founder profiles, credibility signals | Avatar cards, roles, bios |
| Contact Form | Lead capture with validation and LGPD consent | Client component with form state, server action submit |
| WhatsApp FAB | Persistent CTA, opens WhatsApp with pre-filled message | Fixed-position `<a>` with `wa.me` deep link |
| Footer | Institutional info, location, tagline, legal links | Static content, optional embedded map |
| API Route / Server Action | Validate, persist, notify | Next.js Route Handler or Server Action |
| Database Layer | Lead persistence | Drizzle ORM + SQLite (Turso for production) |
| Email Service | Notification to team on new lead | Resend API or Nodemailer with SMTP |

## Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout (fonts, metadata, analytics)
│   ├── page.tsx              # Single page — composes all sections
│   ├── globals.css           # Global styles + CSS variables (design tokens)
│   ├── api/
│   │   └── leads/
│   │       └── route.ts      # POST handler for lead submission
│   └── opengraph-image.tsx   # OG image generation (optional)
├── components/
│   ├── sections/
│   │   ├── hero.tsx          # Hero with brand illustration + CTAs
│   │   ├── services.tsx      # O que fazemos (Conciliacao, Mediacao, Praticas)
│   │   ├── nuclei.tsx        # 7 Nucleos de Atuacao grid
│   │   ├── team.tsx          # Quem Somos — founder cards
│   │   ├── legal.tsx         # Fontes Normativas
│   │   ├── advantages.tsx    # Vantagens do Credenciamento
│   │   ├── process.tsx       # Como Funciona — flowchart
│   │   ├── benefits.tsx      # Beneficios for consumers/businesses
│   │   └── contact.tsx       # Contact form (client component)
│   ├── ui/
│   │   ├── button.tsx        # Outlined button per design system
│   │   ├── card.tsx          # Reusable card (nucleus, team, legal)
│   │   ├── input.tsx         # Form input with label + error
│   │   ├── textarea.tsx      # Form textarea
│   │   ├── select.tsx        # Interest type selector
│   │   └── section-wrapper.tsx # Alternating bg wrapper (white/lavender)
│   ├── whatsapp-fab.tsx      # Floating WhatsApp button
│   ├── navbar.tsx            # Fixed nav with section anchors
│   └── footer.tsx            # Footer with institutional data
├── lib/
│   ├── db/
│   │   ├── schema.ts         # Drizzle schema (leads table)
│   │   ├── index.ts          # DB client initialization
│   │   └── migrate.ts        # Migration runner
│   ├── email.ts              # Email notification helper
│   ├── validations.ts        # Zod schemas (lead form)
│   └── constants.ts          # WhatsApp number, team data, nuclei data
├── assets/
│   └── illustrations/        # SVG illustrations (hero, icons)
└── types/
    └── index.ts              # Shared TypeScript types
```

### Structure Rationale

- **`components/sections/`:** Each landing page section is its own component. This matches the single-page scroll architecture and makes reordering sections trivial.
- **`components/ui/`:** Design system primitives shared across sections. Small set -- this is a landing page, not a design system library. Tailwind CSS handles most styling; these are for consistency on interactive elements.
- **`lib/db/`:** Isolated database concern. Drizzle schema is the source of truth for the leads table.
- **`lib/`:** Server-side utilities (email, validation). Validation schemas are shared between client-side form validation and server-side API validation.
- **`assets/illustrations/`:** SVG files for the hand-drawn style illustrations. Inline SVGs for icons, file-based for larger illustrations.

## Architectural Patterns

### Pattern 1: Static-First with Islands of Interactivity

**What:** The page is 95% static content rendered at build time (SSG). Only the contact form and navbar scroll behavior are client-side interactive components. Everything else is server-rendered HTML with zero JavaScript overhead.

**When to use:** Landing pages where content rarely changes and performance matters for SEO.

**Trade-offs:**
- Pro: Excellent Core Web Vitals (LCP, CLS). Content is immediately available to crawlers.
- Pro: Minimal client-side JS bundle -- only the form and scroll logic ship to browser.
- Con: Content changes require rebuild/redeploy (acceptable for institutional content that changes rarely).

**Example:**
```typescript
// page.tsx — server component (default in Next.js App Router)
// No "use client" — all static, zero JS sent to browser
import { Hero } from '@/components/sections/hero'
import { Services } from '@/components/sections/services'
import { ContactForm } from '@/components/sections/contact' // This one is "use client"

export default function Home() {
  return (
    <main>
      <Hero />           {/* Server component — static HTML */}
      <Services />       {/* Server component — static HTML */}
      <ContactForm />    {/* Client component — interactive */}
    </main>
  )
}
```

### Pattern 2: Server Action for Form Submission

**What:** Use Next.js Server Actions instead of a traditional REST API endpoint for lead form submission. The form component calls a server function directly -- no manual fetch, no API route boilerplate.

**When to use:** When form submission is the only write operation and you want type-safe, colocated server logic.

**Trade-offs:**
- Pro: Type-safe end-to-end. No API route boilerplate. Progressive enhancement (form works without JS).
- Pro: Automatic CSRF protection built into Next.js Server Actions.
- Con: Slightly less conventional than REST -- but Server Actions are the standard pattern in Next.js App Router.

**Example:**
```typescript
// lib/actions/submit-lead.ts
'use server'

import { leadSchema } from '@/lib/validations'
import { db } from '@/lib/db'
import { leads } from '@/lib/db/schema'
import { sendNotificationEmail } from '@/lib/email'

export async function submitLead(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = leadSchema.safeParse(raw)

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }

  await db.insert(leads).values(parsed.data)
  await sendNotificationEmail(parsed.data)

  return { success: true }
}
```

### Pattern 3: Design Tokens via CSS Custom Properties

**What:** Encode the PACIFIQUE! design system (colors, spacing, typography) as CSS custom properties. Tailwind references these tokens, ensuring the design system is the single source of truth.

**When to use:** When you have a defined brand palette and want consistent theming without runtime overhead.

**Trade-offs:**
- Pro: Zero runtime cost. Works with Tailwind's `theme.extend`. Easy to adjust globally.
- Con: Slightly more setup than hardcoded Tailwind values. Worth it for brand consistency.

**Example:**
```css
/* globals.css */
:root {
  --color-primary: #4A4458;
  --color-text-body: #6B6B6B;
  --color-bg-white: #FFFFFF;
  --color-bg-lavender: #F5F3F7;
  --color-accent-deep: #4A3F5C;
  --color-rose-light: #FDE8EC;
  --color-crimson-dark: #7A2048;
}
```

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'bg-lavender': 'var(--color-bg-lavender)',
        'accent-deep': 'var(--color-accent-deep)',
        'rose-light': 'var(--color-rose-light)',
        'crimson-dark': 'var(--color-crimson-dark)',
      }
    }
  }
}
```

## Data Flow

### Lead Submission Flow (Primary)

```
User fills contact form
    |
    v
Client-side validation (Zod schema, same as server)
    |
    v (if valid)
Submit via Server Action (submitLead)
    |
    v
Server-side validation (Zod parse — never trust client)
    |
    v (if valid)
Persist to DB (Drizzle → SQLite/Turso)
    |                          |
    v                          v
Send email notification     Return { success: true }
(Resend API → team inbox)       |
    |                          v
    v                    Form shows success message
Team receives email        (reset form, show "Obrigado!")
with lead details
```

### WhatsApp CTA Flow (Primary)

```
User clicks WhatsApp FAB
    |
    v
Open wa.me deep link with pre-filled message
    |
    v
WhatsApp app opens with conversation to PACIFIQUE! number
    |
    v
(No backend involvement — direct WhatsApp API link)
```

### Navigation Scroll Flow

```
User clicks nav link (e.g., "Nucleos de Atuacao")
    |
    v
Smooth scroll to section anchor (#nucleos)
    |
    v
Intersection Observer updates active nav state
```

### Key Data Flows

1. **Lead capture (form):** User input -> client validation -> server action -> DB persist + email notify -> success response. This is the only write path in the entire system.
2. **WhatsApp redirect:** Click -> `wa.me/{number}?text={encoded_message}`. Zero backend. The pre-filled message should include a brief context (e.g., "Olá! Gostaria de saber mais sobre os serviços da PACIFIQUE!").
3. **Page content:** All content is static, compiled at build time. No CMS, no API calls for content. Data lives in `constants.ts` or directly in section components.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| WhatsApp | `wa.me` deep link (no API) | Pre-filled message via `?text=` query param. Use Carlos Henrique's or a dedicated number. |
| Resend (email) | REST API via SDK | Send lead notification to team. Free tier: 3000 emails/month (more than enough). |
| Turso (production DB) | libSQL over HTTP | SQLite-compatible, edge-ready. Free tier: 500 DBs, 9GB storage. |
| Vercel (hosting) | Git push deploys | Automatic HTTPS, CDN, preview deployments. Free tier covers this project. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Contact form -> Server Action | Direct function call (RSC boundary) | Type-safe, no manual fetch needed |
| Server Action -> DB | Drizzle ORM | Single `insert` operation per lead |
| Server Action -> Email | Resend SDK | Fire-and-forget (don't block response on email delivery) |
| All sections -> Design tokens | CSS custom properties | Sections read tokens, never hardcode colors |

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k monthly visitors | Current architecture is overkill already. SQLite on disk is fine. Email via Resend free tier. Vercel free tier handles traffic. |
| 1k-10k monthly visitors | No changes needed. Static page on CDN handles this trivially. SQLite/Turso handles writes easily (leads are low-write volume). |
| 10k-100k monthly visitors | Still fine. Maybe add rate limiting to the lead form API to prevent spam. Consider adding a honeypot field or turnstile CAPTCHA. |
| 100k+ monthly visitors | Add Cloudflare Turnstile to prevent bot submissions. Consider migrating to Postgres if lead volume exceeds thousands/month. This is unlikely for a local mediation chamber. |

### Scaling Priorities

1. **First bottleneck (spam, not scale):** The lead form will attract spam bots before it attracts enough real users to cause performance issues. Add a honeypot field from day one (hidden input that bots fill, humans don't). This is zero-cost and catches most bots.
2. **Second bottleneck (email delivery):** If Resend free tier limits are hit (3000/month), upgrade to paid tier ($20/month) or switch to SMTP. This is a billing change, not an architecture change.

## Anti-Patterns

### Anti-Pattern 1: Client-Side-Only Form Validation

**What people do:** Validate the contact form only in the browser with JavaScript, trusting the client input on the server.
**Why it's wrong:** Bots and attackers bypass client-side validation trivially. Server receives unvalidated data, leading to DB corruption, injection, or garbage leads.
**Do this instead:** Share the same Zod schema between client and server. Validate on client for UX (instant feedback), validate again on server for security (never trust client).

### Anti-Pattern 2: Blocking Response on Email Delivery

**What people do:** `await sendEmail()` inside the form handler, making the user wait for email delivery before seeing a success message.
**Why it's wrong:** Email delivery can take 1-5 seconds or fail entirely (SMTP timeout, rate limit). User sees a slow form or an error even though the lead was saved.
**Do this instead:** Persist the lead to DB first (the critical path), then fire email notification without awaiting. If email fails, the lead is still saved. Optionally log email failures for retry.

```typescript
// Good: DB is critical path, email is best-effort
await db.insert(leads).values(parsed.data)
sendNotificationEmail(parsed.data).catch(console.error) // fire-and-forget
return { success: true }
```

### Anti-Pattern 3: SPA Router for a Single Page

**What people do:** Install React Router or use Next.js multi-page routing for what is literally a single scrollable page.
**Why it's wrong:** Adds unnecessary JavaScript, complexity, and breaks the "single page = single HTML document" model that is optimal for SEO and performance.
**Do this instead:** Use anchor links (`#section-name`) with CSS `scroll-behavior: smooth`. Use Intersection Observer to highlight the active section in the nav. Zero routing library needed.

### Anti-Pattern 4: Over-Engineering the Database

**What people do:** Set up PostgreSQL, Redis, connection pooling, migrations infrastructure for a simple leads table.
**Why it's wrong:** A local mediation chamber will receive maybe 10-50 leads per month. PostgreSQL infrastructure is operational overhead for zero benefit at this scale.
**Do this instead:** SQLite via Turso. Single table, zero connection management, zero infrastructure. Turso gives you a hosted SQLite with HTTP access. If you outgrow it (you won't), migration to Postgres is a Drizzle config change.

### Anti-Pattern 5: Building a CMS for Static Content

**What people do:** Add a headless CMS (Sanity, Strapi, Contentful) to manage landing page content that changes once per year.
**Why it's wrong:** Adds API calls, loading states, caching complexity, and a third-party dependency for content that four founders can update via a Git commit.
**Do this instead:** Keep content in code (`constants.ts` or directly in components). When content needs to change, update the code and deploy. This is a 5-minute task for a developer, not a daily operation requiring a CMS.

## Suggested Build Order

```
Phase 1: Foundation + Static Content
├── Next.js project setup (App Router, TypeScript, Tailwind)
├── Design tokens (CSS custom properties from design system)
├── Section wrapper component (alternating bg-white/bg-lavender)
├── Navbar with anchor scroll navigation
├── All static sections (hero, services, nuclei, team, legal,
│   advantages, process, benefits)
├── Footer with institutional data
├── WhatsApp floating button
└── Responsive layout (mobile-first)

Phase 2: Lead Capture Backend
├── Database schema (leads table with Drizzle + SQLite)
├── Zod validation schema (shared client/server)
├── Contact form UI (client component with validation)
├── Server Action for lead submission
├── Email notification (Resend integration)
├── Honeypot spam prevention
├── LGPD consent checkbox + privacy notice
└── Success/error states in form UI

Phase 3: Polish + Production
├── SEO metadata (title, description, OG image, structured data)
├── Performance audit (Core Web Vitals)
├── Accessibility audit (WCAG 2.1 AA)
├── Analytics (optional — Vercel Analytics or Plausible)
├── Turso production database setup
├── Vercel deployment configuration
└── Domain + DNS setup
```

**Why this order:**
1. **Phase 1 must come first** because it establishes the visual identity, design system, and all static content. The founders can review and give feedback on the look/feel before any backend work begins. The WhatsApp button (primary CTA) is functional immediately.
2. **Phase 2 depends on Phase 1** because the contact form UI lives within the page layout. Backend work is isolated -- database schema, server action, email -- but the form component needs the design system to exist.
3. **Phase 3 is final** because SEO, performance, and accessibility auditing can only happen on a complete page. Production deployment needs both frontend and backend to be ready.

## Sources

- Next.js App Router architecture: based on official Next.js documentation patterns for static sites with server actions
- Drizzle ORM + SQLite/Turso: standard lightweight persistence pattern for low-write-volume applications
- Resend email API: modern email delivery service with generous free tier, purpose-built for transactional email
- WhatsApp Business deep links: `wa.me` URL format is the official WhatsApp Click-to-Chat mechanism
- LGPD compliance patterns: explicit consent checkbox, purpose limitation, data minimization
- Core Web Vitals targets: Google's recommended thresholds (LCP < 2.5s, FID < 100ms, CLS < 0.1)

---
*Architecture research for: PACIFIQUE! institutional landing page with lead capture*
*Researched: 2026-03-04*
