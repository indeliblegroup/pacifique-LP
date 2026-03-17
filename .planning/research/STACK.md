# Technology Stack

**Project:** PACIFIQUE! - Institutional Landing Page
**Researched:** 2026-03-04
**Note:** Web verification tools unavailable during research. Versions based on training data (up to mid-2025). Verify exact latest versions with `npm view <pkg> version` before installing.

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Next.js | ^15 | Full-stack framework (SSG + API routes) | Single framework handles both the static landing page AND the lead capture API endpoint. App Router is stable. SSG produces fast static HTML for the landing page sections. API Routes handle form submission without needing a separate backend. The project explicitly needs a backend endpoint for lead persistence and email — Next.js solves both in one codebase. | HIGH |
| React | ^19 | UI library | Ships with Next.js 15. Server Components reduce client JS bundle. For a landing page, most sections are pure content (zero client JS). Only the form and WhatsApp button need interactivity. | HIGH |
| TypeScript | ^5.6 | Type safety | Already specified in CLAUDE.md. Catches form data shape issues, API route typing, email template props. Non-negotiable for professional projects. | HIGH |

### Why Next.js over Astro

Astro would be a strong choice for a pure static site (better performance, less JS). However, this project requires:
- **Backend API route** to persist leads to a database
- **Server-side email sending** on form submission
- **Potential SSR** for dynamic content later

Next.js handles all of this in one codebase with zero additional infrastructure. Astro would require a separate API server (or Astro API routes which are less mature than Next.js). For a single-page site with backend needs, Next.js is the pragmatic choice.

### Styling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Tailwind CSS | ^4 | Utility-first CSS | Tailwind v4 (released Jan 2025) is a major rewrite with CSS-first configuration, zero PostCSS plugin needed, and native CSS cascade layers. Perfect for this project: the design system in CLAUDE.md maps directly to Tailwind custom properties. Utility classes make responsive design trivial. Mobile-first by default. | MEDIUM (v4 specifics) |

**Tailwind v4 migration note:** v4 uses `@theme` in CSS instead of `tailwind.config.js`. Custom colors from the design system (`primary: #4A4458`, `bg-lavender: #F5F3F7`, etc.) are defined in a CSS file with `@theme { --color-primary: #4A4458; }`. If v4 proves unstable, fall back to Tailwind v3.4 which is battle-tested.

### Database

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| SQLite via Turso | latest | Lead persistence | For a landing page collecting leads, a full PostgreSQL setup is overkill. Turso provides hosted SQLite (libSQL) with an HTTP API — zero infrastructure to manage. Free tier handles thousands of leads. Edge-compatible. If self-hosting is preferred, a simple SQLite file on the server works too. | MEDIUM |
| Drizzle ORM | ^0.38 | Database queries | Lightweight, TypeScript-first ORM. SQL-like syntax (no magic). Schema-as-code with migrations. Works perfectly with Turso/SQLite and Next.js API routes. Much lighter than Prisma for this use case. | MEDIUM (version) |

**Alternative if hosted DB preferred:** Supabase (PostgreSQL) with the Supabase JS client. More infrastructure than needed but provides a dashboard to view leads without building an admin panel.

**Simplest alternative:** If the team wants zero database setup initially, store leads as JSON files or use a Google Sheets API integration. Not recommended for production but valid for MVP.

### Email

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Resend | ^4 | Transactional email API | Modern email API built for developers. Simple REST API, generous free tier (100 emails/day, 3000/month). First-class React Email support for beautiful templates. TypeScript SDK. Perfect for "notify team when a lead comes in." | MEDIUM (version) |
| React Email | ^3 | Email templates | Build email notification templates with React components. Type-safe, preview-able, renders to HTML email. Pairs with Resend. The lead notification email can match PACIFIQUE! branding. | MEDIUM (version) |

**Why not Nodemailer:** Nodemailer requires SMTP credentials and is harder to configure correctly (deliverability, SPF/DKIM). Resend handles deliverability infrastructure. For a landing page sending 5-20 notification emails per day, Resend's free tier is sufficient indefinitely.

**Why not SendGrid/Mailgun:** More complex setup, enterprise-focused pricing, worse DX. Resend is purpose-built for exactly this use case.

### Form Handling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| React Hook Form | ^7.54 | Form state management | Lightweight, performant form library. Handles validation, error states, and submission. Uncontrolled inputs by default (better performance). Works with Server Actions if desired. | HIGH |
| Zod | ^3.23 | Schema validation | Validates form data on both client and server (shared schema). TypeScript inference from schemas. Works with React Hook Form via `@hookform/resolvers`. Also validates API route input. | HIGH |

### WhatsApp Integration

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Custom component | N/A | Floating WhatsApp CTA button | No library needed. WhatsApp deep links (`https://wa.me/5581987900892?text=...`) are a simple `<a>` tag. Build a floating button component with Tailwind (fixed position, z-index, green WhatsApp brand color). Pre-fill message with context (e.g., "Ola, gostaria de saber mais sobre os servicos da PACIFIQUE!"). | HIGH |

**Do NOT use `react-whatsapp-widget` or similar npm packages.** They add unnecessary dependencies for what is literally an anchor tag with styling. A 20-line custom component is superior.

### Deployment

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Vercel | N/A | Hosting and deployment | Built by the Next.js team. Zero-config deployment for Next.js. Free tier handles landing page traffic easily. Edge functions for API routes. Automatic HTTPS, CDN, preview deployments. Analytics built in. | HIGH |

**Alternative:** Cloudflare Pages (if Vercel pricing becomes a concern at scale). Requires `@cloudflare/next-on-pages` adapter.

### Supporting Libraries

| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| `lucide-react` | ^0.460 | Icons | For the 7 nucleos de atuacao icons, navigation icons, social icons. Tree-shakeable, consistent style. Avoid Font Awesome (bloated) or custom SVGs (maintenance burden). | HIGH (library), MEDIUM (version) |
| `framer-motion` | ^11 | Animations | Scroll-triggered animations for section reveals. Keep minimal: fade-in on scroll for sections, subtle hover effects on cards. Do NOT over-animate. | HIGH (library), MEDIUM (version) |
| `@vercel/analytics` | ^1 | Page analytics | Track page views, referral sources, CTA clicks. Zero-config on Vercel. | HIGH |
| `next-seo` or Next.js Metadata API | ^15 | SEO optimization | Use Next.js built-in Metadata API (App Router). `generateMetadata` for page title, description, Open Graph tags. No external library needed. | HIGH |
| `sharp` | ^0.33 | Image optimization | Next.js Image component uses sharp for automatic WebP/AVIF conversion. Install as a dependency for production builds. | HIGH |

### Development Tools

| Tool | Version | Purpose | Confidence |
|------|---------|---------|------------|
| ESLint | ^9 | Linting | Flat config format. Next.js provides `eslint-config-next`. | MEDIUM (v9 flat config) |
| Prettier | ^3 | Code formatting | Consistent code style. Use `prettier-plugin-tailwindcss` for class sorting. | HIGH |
| pnpm | ^9 | Package manager | Faster installs, strict dependency resolution, disk-efficient. Better than npm for monorepo-capable projects. | HIGH |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | Next.js 15 | Astro | Astro has better static performance but requires separate backend for API routes, email sending, and DB access. Over-engineering for a single-page project with backend needs. |
| Framework | Next.js 15 | Remix | Remix is great for full apps but overkill for a landing page. Less static optimization than Next.js SSG. |
| Styling | Tailwind CSS v4 | CSS Modules | CSS Modules lack utility-class ergonomics for responsive design. Design system tokens harder to maintain. |
| Styling | Tailwind CSS v4 | Styled Components / Emotion | CSS-in-JS adds runtime cost. Bad for Core Web Vitals on a landing page. Being deprecated in favor of zero-runtime solutions. |
| Styling | Tailwind CSS v4 | shadcn/ui | shadcn/ui is excellent for app UIs but overkill for a landing page. The PACIFIQUE! design system is custom (purple/mauve tones, specific cards) — using shadcn defaults would fight the brand. Build custom components with Tailwind instead. |
| Database | Turso (SQLite) | PostgreSQL (Supabase/Neon) | Full relational DB is overkill for a leads table. More infrastructure to manage. |
| Database | Turso (SQLite) | MongoDB Atlas | Document DB adds complexity for a single `leads` table. SQL is simpler here. |
| Email | Resend | Nodemailer + SMTP | SMTP configuration, deliverability management, SPF/DKIM setup — all handled by Resend for free. |
| Email | Resend | AWS SES | Enterprise complexity for a landing page sending <50 emails/day. |
| Forms | React Hook Form | Formik | Formik is heavier, less performant, less actively maintained. React Hook Form is the standard. |
| Icons | Lucide React | Font Awesome | Font Awesome is bloated. Lucide is tree-shakeable and lighter. |
| Icons | Lucide React | Heroicons | Heroicons is fine but has fewer icons. Lucide has better coverage for legal/business domains. |
| Animation | Framer Motion | GSAP | GSAP is powerful but heavy. Framer Motion integrates natively with React and is sufficient for scroll reveals. |
| Package manager | pnpm | npm | npm is slower, uses more disk space, has phantom dependency issues. |
| Package manager | pnpm | yarn | Yarn Berry has adoption issues. pnpm is simpler and faster. |

## Architecture Decision: Monolith (Not Microservices)

This is a single-page landing page with one API endpoint. Everything lives in one Next.js project:

```
pacifique/
  src/
    app/
      page.tsx          # Landing page (SSG)
      layout.tsx         # Root layout with metadata
      api/
        leads/
          route.ts       # POST handler: validate, save to DB, send email
    components/
      sections/          # Hero, Services, Team, etc.
      ui/                # WhatsApp button, Form, Cards
    lib/
      db.ts              # Drizzle + Turso connection
      email.ts           # Resend client + templates
      schema.ts          # Zod schemas (shared client/server)
    db/
      schema.ts          # Drizzle table definitions
      migrations/        # SQL migrations
```

## Installation

```bash
# Initialize project
pnpm create next-app@latest pacifique --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Core dependencies
pnpm add drizzle-orm @libsql/client resend react-hook-form @hookform/resolvers zod lucide-react framer-motion sharp

# Dev dependencies
pnpm add -D drizzle-kit @types/node prettier prettier-plugin-tailwindcss

# Vercel (optional, for analytics)
pnpm add @vercel/analytics
```

## Environment Variables

```env
# .env.local (never commit)
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
RESEND_API_KEY=re_xxxxxxxxxxxxx
NOTIFICATION_EMAIL=carlosh@bmadvocacia.com.br
WHATSAPP_NUMBER=5581987900892
```

## Version Verification Needed

The following versions should be verified before project setup (training data may be stale):

| Package | Stated Version | Verify With |
|---------|---------------|-------------|
| next | ^15 | `npm view next version` |
| tailwindcss | ^4 | `npm view tailwindcss version` |
| drizzle-orm | ^0.38 | `npm view drizzle-orm version` |
| resend | ^4 | `npm view resend version` |
| react-hook-form | ^7.54 | `npm view react-hook-form version` |
| zod | ^3.23 | `npm view zod version` |
| lucide-react | ^0.460 | `npm view lucide-react version` |
| framer-motion | ^11 | `npm view framer-motion version` |

## Sources

- Next.js official documentation (nextjs.org/docs) — HIGH confidence (training data, stable API)
- Tailwind CSS v4 announcement (tailwindcss.com/blog) — MEDIUM confidence (v4 released Jan 2025 per training data, verify current state)
- Resend documentation (resend.com/docs) — MEDIUM confidence (API stable, verify version)
- Drizzle ORM documentation (orm.drizzle.team) — MEDIUM confidence (actively developed, verify version)
- React Hook Form documentation (react-hook-form.com) — HIGH confidence (stable, widely used)
- Zod documentation (zod.dev) — HIGH confidence (stable, standard validation library)
- WhatsApp deep link API (faq.whatsapp.com) — HIGH confidence (stable URL format)

**Caveat:** All web sources could not be accessed during research. Versions and specific API details should be verified against current npm registry and official docs before implementation.
