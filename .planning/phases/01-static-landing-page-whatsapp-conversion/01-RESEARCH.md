# Phase 1: Static Landing Page & WhatsApp Conversion - Research

**Researched:** 2026-03-04
**Domain:** Next.js 16 static landing page with Tailwind CSS v4, responsive layout, and WhatsApp CTA
**Confidence:** HIGH

## Summary

Phase 1 delivers a complete, deployable static landing page for PACIFIQUE! with all institutional content sections, responsive mobile-first layout, sticky navigation with smooth scroll, and a floating WhatsApp CTA button as the primary conversion path. This phase has zero backend dependencies -- all content is static HTML rendered at build time via Next.js SSG. The only interactive elements are the navigation (hamburger menu on mobile, smooth scroll, active section highlighting) and the WhatsApp floating button.

The critical update since the initial stack research: **Next.js is now at version 16.1.6** (not 15), **Tailwind CSS at 4.2.1**, and **React at 19.2.4**. Next.js 16 brings Turbopack as default bundler, async request APIs (breaking change from 15), `middleware` renamed to `proxy`, and new scroll behavior handling relevant to our smooth scroll requirement. The `framer-motion` library has been rebranded as `motion` (same API, new package name). All version numbers and patterns in this research reflect verified current state.

**Primary recommendation:** Use `pnpm create next-app@latest` with TypeScript + Tailwind + App Router + src-dir to scaffold, define PACIFIQUE! design tokens via Tailwind v4 `@theme` in CSS, build each section as a server component, and implement the WhatsApp FAB as a simple anchor tag component. Keep framer-motion/motion usage minimal for this phase -- CSS transitions suffice for hover states and basic reveals.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HERO-01 | Hero section with PACIFIQUE! identity (sketch illustrations, purple/mauve, tagline, CNJ/TJPE credentials above fold) | Design tokens via Tailwind v4 @theme, Next.js Image component with priority for LCP, server component pattern |
| HERO-02 | Sticky menu navigation with smooth scroll between sections | Next.js 16 `data-scroll-behavior="smooth"` attribute, CSS `scroll-behavior: smooth`, IntersectionObserver for active section |
| HERO-03 | Mobile hamburger menu navigation | Client component with `"use client"`, Tailwind responsive utilities, 44x44px touch targets |
| INST-01 | "O que fazemos" section (Conciliacao, Mediacao, Praticas Restaurativas) | Server component with static content, card UI pattern, section-wrapper alternating backgrounds |
| INST-02 | 7 Nucleos de Atuacao with icons and scannable descriptions | Lucide React icons (v0.577.0), responsive grid (1-col mobile, 2-4 col desktop), card component |
| INST-03 | Team section with 4 founders (name, cargo, bio) | Server component, responsive grid, placeholder illustration strategy |
| INST-04 | Fontes Normativas in highlight cards (accent-deep background) | Card component with dark variant, precise legal citations |
| INST-05 | Vantagens do Credenciamento TJPE section | Static content cards, benefit-focused copy |
| INST-06 | Simplified flowchart (Fase Inicial -> Procedimental -> Resultados) | Vertical timeline on mobile, horizontal on desktop, CSS-based (no charting library) |
| INST-07 | Mediacao vs Litigio side-by-side comparison | Two-column layout desktop, stacked mobile, comparison card pattern |
| INST-08 | CNJ/TJPE credential badges as trust signals | Visual badge/seal components, placed prominently near hero |
| INST-09 | FAQ accordion (5-8 questions) | Client component with details/summary or state-managed accordion, accessible keyboard navigation |
| INST-10 | Footer with CNPJ, address, contacts, tagline | Server component, static institutional data |
| CONV-01 | Floating WhatsApp button with pre-filled message, visible on all sections | Fixed-position anchor tag, `wa.me` deep link format, z-index strategy, iOS Safari bottom bar offset |
| RESP-01 | Mobile-first responsive layout with breakpoints at 640px, 1024px | Tailwind responsive prefixes (sm:, lg:), min-width media queries |
| RESP-02 | Nucleo cards stack vertically on mobile, grid on desktop | Tailwind grid utilities, responsive column count |
| RESP-03 | Flowchart vertical on mobile, horizontal on desktop | Conditional layout via Tailwind responsive classes |
| RESP-04 | No horizontal scroll at any resolution 375px-1440px | `overflow-x: hidden` safety net, max-width constraints, tested viewports |
| COMP-03 | HTTPS | Automatic with Vercel deployment, zero configuration needed |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6 | Full-stack React framework (SSG for this phase) | Turbopack default, React 19.2, Server Components for zero-JS static sections. Single `page.tsx` composes all sections. |
| React | 19.2.4 | UI library (ships with Next.js 16) | Server Components reduce client bundle to near-zero for static content. Only nav and FAQ need `"use client"`. |
| TypeScript | 5.9.3 | Type safety | Project requirement per CLAUDE.md. Catches prop shape issues across section components. |
| Tailwind CSS | 4.2.1 | Utility-first CSS | CSS-first config via `@theme` directive. Design tokens map directly from CLAUDE.md palette. Mobile-first responsive built-in. |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `lucide-react` | 0.577.0 | Icons for Nucleos, navigation, social links | Tree-shakeable. Use for the 7 nucleo icons, nav hamburger, social icons, chevrons. |
| `sharp` | 0.34.5 | Image optimization for Next.js Image component | Automatic WebP/AVIF conversion. Install as dependency for production builds. |
| `@tailwindcss/postcss` | (bundled with tailwindcss 4.x) | PostCSS plugin for Tailwind v4 | Required for Tailwind v4 in Next.js -- replaces the old `tailwindcss` PostCSS plugin. |

### NOT Needed for Phase 1

| Library | Why Not Now |
|---------|-------------|
| `motion` / `framer-motion` | Phase 1 does not require scroll-triggered animations. CSS transitions (200-300ms ease) handle hover/focus states. Add in Phase 3 if polish animations are desired. |
| `drizzle-orm`, `@libsql/client` | No database in Phase 1 -- static content only. Phase 2. |
| `resend`, `react-email` | No email in Phase 1. Phase 2. |
| `react-hook-form`, `zod`, `@hookform/resolvers` | No form in Phase 1. Phase 2. |
| `@vercel/analytics` | Defer to Phase 3 (requires cookie/tracking consent consideration). |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Tailwind v4 `@theme` | Tailwind v3 `tailwind.config.ts` | v3 is more battle-tested, but v4 is stable at 4.2.1. CSS-first config is simpler for this project's design token needs. |
| Lucide React | Heroicons | Lucide has better icon coverage for legal/business domain (Gavel, Handshake, Landmark, Heart, Scale, Shield, Building). |
| CSS `scroll-behavior: smooth` | GSAP/Locomotive Scroll | Native CSS is zero-JS, handles our single-page anchor scroll perfectly. No library needed. |
| `<details>`/`<summary>` for FAQ | Custom accordion with state | Native HTML is accessible by default, keyboard navigable, works without JS. Style with Tailwind. |

**Installation (Phase 1 only):**
```bash
# Scaffold project
pnpm create next-app@latest pacifique --typescript --tailwind --app --src-dir --import-alias "@/*"

# Phase 1 dependencies only
pnpm add lucide-react sharp
```

## Architecture Patterns

### Recommended Project Structure (Phase 1)

```
src/
├── app/
│   ├── layout.tsx              # Root layout: fonts, metadata, lang="pt-BR"
│   ├── page.tsx                # Single page: composes all sections in order
│   ├── globals.css             # @import "tailwindcss" + @theme design tokens
│   └── not-found.tsx           # Custom 404 page (branded)
├── components/
│   ├── sections/
│   │   ├── hero.tsx            # Hero: tagline, illustration, CNJ/TJPE badges, CTA
│   │   ├── services.tsx        # O que fazemos: 3 service cards
│   │   ├── nuclei.tsx          # 7 Nucleos de Atuacao: icon grid
│   │   ├── team.tsx            # Quem Somos: 4 founder cards
│   │   ├── legal-sources.tsx   # Fontes Normativas: dark accent cards
│   │   ├── advantages.tsx      # Vantagens do Credenciamento TJPE
│   │   ├── process-flow.tsx    # Como Funciona: flowchart/timeline
│   │   ├── comparison.tsx      # Mediacao vs Litigio: side-by-side
│   │   ├── faq.tsx             # FAQ: accordion (client component)
│   │   └── footer.tsx          # Footer: CNPJ, address, contacts
│   ├── ui/
│   │   ├── section-wrapper.tsx # Alternating bg-white/bg-lavender wrapper
│   │   ├── card.tsx            # Reusable card (nucleus, team, legal variants)
│   │   ├── badge.tsx           # Credential badge/seal component
│   │   └── icon-circle.tsx     # Circular icon container (crimson-dark bg)
│   ├── navbar.tsx              # Sticky nav: desktop horizontal + mobile hamburger (client component)
│   └── whatsapp-fab.tsx        # Floating WhatsApp button
├── lib/
│   └── constants.ts            # Team data, nuclei data, WhatsApp number, section IDs
└── assets/
    └── illustrations/          # SVG illustrations (hero, team portraits)
```

### Pattern 1: Server Components by Default (Static-First)

**What:** Every section component is a React Server Component (no `"use client"` directive). These render to static HTML at build time with zero JavaScript shipped to the browser. Only the navbar (hamburger toggle, scroll spy) and FAQ (accordion toggle) need `"use client"`.

**When to use:** All content sections -- hero, services, nuclei, team, legal, advantages, process, comparison, footer.

**Example:**
```typescript
// src/app/page.tsx -- server component (default)
import { Hero } from '@/components/sections/hero'
import { Services } from '@/components/sections/services'
import { Nuclei } from '@/components/sections/nuclei'
import { Team } from '@/components/sections/team'
import { LegalSources } from '@/components/sections/legal-sources'
import { Advantages } from '@/components/sections/advantages'
import { ProcessFlow } from '@/components/sections/process-flow'
import { Comparison } from '@/components/sections/comparison'
import { Faq } from '@/components/sections/faq'
import { Footer } from '@/components/sections/footer'
import { Navbar } from '@/components/navbar'
import { WhatsAppFab } from '@/components/whatsapp-fab'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Nuclei />
        <Team />
        <LegalSources />
        <Advantages />
        <ProcessFlow />
        <Comparison />
        <Faq />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}
```

### Pattern 2: Design Tokens via Tailwind v4 @theme

**What:** The PACIFIQUE! design system colors, fonts, and spacing are defined as CSS custom properties inside the `@theme` directive in `globals.css`. Tailwind automatically generates utility classes from these tokens.

**Example:**
```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* Brand Colors */
  --color-primary: #4A4458;
  --color-text-body: #6B6B6B;
  --color-bg-lavender: #F5F3F7;
  --color-accent-deep: #4A3F5C;
  --color-accent-deep-text: #FFFFFF;
  --color-rose-light: #FDE8EC;
  --color-rose-medium: #F9D5DC;
  --color-crimson-dark: #7A2048;
  --color-success: #22C55E;
  --color-error: #EF4444;
  --color-border-subtle: #E5E5E5;

  /* Font Families (set via next/font CSS variables) */
  --font-heading: var(--font-heading-family);
  --font-body: var(--font-body-family);
}
```

Usage in components:
```tsx
{/* Uses generated utility classes */}
<h1 className="text-primary font-heading">PACIFIQUE!</h1>
<p className="text-text-body font-body">Resolucao pacifica de conflitos</p>
<section className="bg-bg-lavender">...</section>
<div className="bg-accent-deep text-accent-deep-text">...</div>
```

### Pattern 3: Section Wrapper with Alternating Backgrounds

**What:** A reusable wrapper component that applies the zebra-stripe background pattern (white/lavender) and consistent vertical spacing.

**Example:**
```typescript
// src/components/ui/section-wrapper.tsx
interface SectionWrapperProps {
  id: string
  children: React.ReactNode
  variant?: 'white' | 'lavender'
  className?: string
}

export function SectionWrapper({
  id,
  children,
  variant = 'white',
  className = '',
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 ${
        variant === 'lavender' ? 'bg-bg-lavender' : 'bg-white'
      } ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}
```

### Pattern 4: Smooth Scroll Navigation with Active Section (Next.js 16)

**What:** Sticky navbar with anchor links that smooth-scroll to sections. IntersectionObserver tracks which section is visible and highlights the corresponding nav item. Next.js 16 changed scroll behavior handling -- must add `data-scroll-behavior="smooth"` to `<html>`.

**Example:**
```typescript
// src/app/layout.tsx
import { Inter, Merriweather } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body-family',
  display: 'swap',
})

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-heading-family',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${merriweather.variable} scroll-smooth`}
    >
      <body className="font-body text-text-body">{children}</body>
    </html>
  )
}
```

```typescript
// src/components/navbar.tsx (client component)
'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Nucleos', href: '#nucleos' },
  { label: 'Equipe', href: '#equipe' },
  // ... more sections
]

export function Navbar() {
  const [activeSection, setActiveSection] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )

    NAV_ITEMS.forEach(({ href }) => {
      const el = document.querySelector(href)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <header className="fixed top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-border-subtle">
      {/* Desktop nav + mobile hamburger */}
    </header>
  )
}
```

### Pattern 5: WhatsApp Floating Action Button

**What:** A fixed-position anchor tag linking to `wa.me` with a pre-filled message. No library needed.

**Example:**
```typescript
// src/components/whatsapp-fab.tsx
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from '@/lib/constants'

export function WhatsAppFab() {
  const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE)
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir conversa no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
    >
      {/* WhatsApp SVG icon inline */}
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.592-.825-6.326-2.204l-.442-.356-3.238 1.086 1.086-3.238-.356-.442A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
      </svg>
    </a>
  )
}
```

```typescript
// src/lib/constants.ts
export const WHATSAPP_NUMBER = '5581987900892' // Digits only: country + DDD + number
export const WHATSAPP_MESSAGE = 'Ola! Gostaria de saber mais sobre os servicos da PACIFIQUE!'
```

### Anti-Patterns to Avoid

- **Adding `"use client"` to section components:** Every content section should be a server component. Only navbar (scroll spy + hamburger state) and FAQ (accordion toggle) need client-side JS.
- **Installing a WhatsApp widget library:** The WhatsApp FAB is literally an `<a>` tag. `react-whatsapp-widget` and similar packages are unnecessary dependencies.
- **Using a JavaScript smooth scroll library:** CSS `scroll-behavior: smooth` handles everything. No GSAP, no Locomotive Scroll, no smooth-scrollbar.
- **Building the form in Phase 1:** The contact form, database, and email belong to Phase 2. Phase 1 ships with WhatsApp as the sole conversion path.
- **Hardcoding colors instead of using design tokens:** All colors must come from `@theme` tokens. Never use raw hex values in component classes.
- **Using a charting library for the process flowchart:** The 3-step flowchart is pure HTML/CSS. Do not import Chart.js, D3, or any visualization library.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Icon system | Custom SVG icon components for every icon | `lucide-react` | 1000+ icons, tree-shakeable, consistent style, accessible by default |
| Image optimization | Manual WebP conversion, responsive srcsets | Next.js `<Image>` + `sharp` | Automatic format conversion, lazy loading, blur placeholder, responsive sizes |
| Font self-hosting | Manual font file download, @font-face declarations | `next/font/google` | Automatic self-hosting, zero layout shift, preloading, no Google CDN requests (LGPD safe) |
| CSS reset/normalize | Custom reset stylesheet | Tailwind v4 preflight (included in `@import "tailwindcss"`) | Battle-tested reset, automatically included |
| Responsive breakpoints | Custom media query system | Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) | Consistent breakpoints, mobile-first by default |
| Smooth scroll | JavaScript scroll library | CSS `scroll-behavior: smooth` + `data-scroll-behavior="smooth"` on `<html>` | Native browser implementation, zero JS, respects `prefers-reduced-motion` |
| Active section detection | Scroll event listeners with `getBoundingClientRect` | `IntersectionObserver` API | Async, performant, no main thread blocking |

**Key insight:** Phase 1 is almost entirely static HTML with Tailwind classes. The main engineering challenges are design system consistency, responsive layout quality, and content organization -- not complex library integrations.

## Common Pitfalls

### Pitfall 1: Next.js 16 Scroll Behavior Change

**What goes wrong:** Developer adds `scroll-behavior: smooth` to CSS but navigation feels broken -- smooth scroll either doesn't work on route changes or behaves unexpectedly.
**Why it happens:** Next.js 16 changed scroll behavior handling. In Next.js 15, the framework would override `scroll-behavior` during SPA transitions. In Next.js 16, it no longer does this by default.
**How to avoid:** Add `data-scroll-behavior="smooth"` to the `<html>` element in `layout.tsx`. This tells Next.js to manage the scroll behavior override during navigation while keeping smooth scroll for anchor links.
**Warning signs:** Smooth scroll not working, console warning about missing `data-scroll-behavior`.

### Pitfall 2: iOS Safari Viewport and Fixed Elements

**What goes wrong:** The WhatsApp floating button is hidden behind the iOS Safari bottom toolbar, or the page height is wrong because `100vh` includes the toolbar area.
**Why it happens:** iOS Safari's bottom toolbar appears/disappears on scroll, changing the viewport size. `100vh` is the full viewport including toolbar, not the visible area.
**How to avoid:** Use `100dvh` (dynamic viewport height) instead of `100vh`. Position the WhatsApp button with `bottom-6` (24px) which provides enough clearance for the iOS bottom bar. Test on a physical iPhone.
**Warning signs:** Elements hidden behind browser chrome, page height bouncing on scroll.

### Pitfall 3: Form Input Font Size iOS Auto-Zoom

**What goes wrong:** When a user taps any form input on iOS, the page zooms in and doesn't zoom back out. This is relevant for Phase 1 because the FAQ accordion may include future form elements, and sets the pattern for Phase 2.
**Why it happens:** iOS Safari auto-zooms when input font-size is below 16px.
**How to avoid:** Set `font-size: 16px` minimum on all `<input>`, `<textarea>`, and `<select>` elements. In Tailwind: `text-base` (which is 16px).
**Warning signs:** Any input element with `text-sm` or smaller.

### Pitfall 4: Color Contrast Failures on Lavender Background

**What goes wrong:** Body text (`#6B6B6B`) on lavender background (`#F5F3F7`) has a contrast ratio of approximately 4.6:1 -- borderline for WCAG 2.1 AA (requires 4.5:1 for normal text).
**Why it happens:** The design palette was approximated from PDF materials, not verified against accessibility standards.
**How to avoid:** Darken body text to `#595959` (provides ~6.1:1 on lavender) or verify exact ratios with a contrast checker before building. Test every color combination in the palette.
**Warning signs:** Text looks washed out on lavender sections, axe-core contrast violations.

### Pitfall 5: WhatsApp Link Phone Number Formatting

**What goes wrong:** The WhatsApp link doesn't open or opens to the wrong number because of formatting characters in the phone number.
**Why it happens:** Developer uses the phone number with `+`, spaces, dashes, or parentheses (e.g., `+55 (81) 98790-0892`).
**How to avoid:** Use digits only: `5581987900892`. No `+`, no spaces, no dashes, no parens. Country code `55` + DDD `81` + number.
**Warning signs:** WhatsApp opens but shows "This number is not on WhatsApp" or opens a blank chat.

### Pitfall 6: Horizontal Overflow on Mobile

**What goes wrong:** Hidden horizontal scroll appears on narrow viewports (375px), often only visible as subtle horizontal scrollbar or unexpected page bounce.
**Why it happens:** An element exceeds viewport width -- common culprits: images without max-width, padding that doesn't account for box-sizing, absolute-positioned elements, or the flowchart section.
**How to avoid:** Add `overflow-x: hidden` on `<body>` as safety net. Set `max-w-full` on all images. Test at 320px, 375px, and 414px. Use Chrome DevTools responsive mode AND physical devices.
**Warning signs:** Subtle horizontal scrollbar at bottom of page, page "bounces" horizontally on touch.

### Pitfall 7: Missing Legal Citation Precision

**What goes wrong:** Legal references are abbreviated casually ("Resolucao 125 CNJ") instead of precisely ("Resolucao n. 125/2010 do CNJ"). Legal professionals notice immediately.
**Why it happens:** Developer treats legal citations as marketing copy rather than formal references.
**How to avoid:** All legal citations must follow the exact format from CLAUDE.md:
- "Resolucao n. 125/2010 do CNJ"
- "Resolucao n. 410/2018 do TJPE"
- "Lei n. 13.140/2015 (Lei de Mediacao)"
- "CPC/2015 (Lei n. 13.105/2015), art. 3, par. 2 e 3"
**Warning signs:** Any legal reference that omits the year, number prefix "n.", or issuing body.

## Code Examples

### Font Setup with next/font (Self-Hosted, LGPD Safe)

```typescript
// src/app/layout.tsx
// Source: https://nextjs.org/docs/app/getting-started/fonts
import { Inter } from 'next/font/google'
import './globals.css'

// next/font automatically self-hosts fonts -- zero requests to Google CDN
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body-family',
  display: 'swap',
})

// For headings, choose a serif font (or use Inter for both initially)
// The exact heading font is TBD per CLAUDE.md ("a definir")
// Using Inter for now, swap later when brand guide is finalized

export const metadata = {
  title: 'PACIFIQUE! - Camara Privada de Conciliacao e Mediacao',
  description: 'Resolucao pacifica de conflitos com excelencia, seguranca juridica e celeridade. Credenciada pelo CNJ e TJPE. Recife/PE.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${inter.variable} scroll-smooth`}
    >
      <body className="font-body text-text-body antialiased">
        {children}
      </body>
    </html>
  )
}
```

### Tailwind v4 Design Tokens (globals.css)

```css
/* src/app/globals.css */
/* Source: https://tailwindcss.com/docs/theme */
@import "tailwindcss";

@theme {
  /* Brand Colors from CLAUDE.md design system */
  --color-primary: #4A4458;
  --color-text-body: #595959;          /* Darkened from #6B6B6B for contrast */
  --color-bg-lavender: #F5F3F7;
  --color-accent-deep: #4A3F5C;
  --color-accent-deep-text: #FFFFFF;
  --color-rose-light: #FDE8EC;
  --color-rose-medium: #F9D5DC;
  --color-crimson-dark: #7A2048;
  --color-success: #22C55E;
  --color-error: #EF4444;
  --color-border-subtle: #E5E5E5;
  --color-whatsapp: #25D366;

  /* Font families (CSS variables set by next/font) */
  --font-heading: var(--font-heading-family), ui-serif, Georgia, serif;
  --font-body: var(--font-body-family), ui-sans-serif, system-ui, sans-serif;
}

/* Accessibility: Respect motion preferences */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto !important;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Accessible FAQ Accordion

```typescript
// src/components/sections/faq.tsx
'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/section-wrapper'
import { FAQ_ITEMS } from '@/lib/constants'

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <SectionWrapper id="faq" variant="white">
      <h2 className="text-primary font-heading text-3xl font-bold text-center mb-12">
        Perguntas Frequentes
      </h2>
      <div className="max-w-3xl mx-auto divide-y divide-border-subtle">
        {FAQ_ITEMS.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between py-4 text-left text-primary font-medium text-lg hover:text-crimson-dark transition-colors focus-visible:outline-2 focus-visible:outline-primary"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              {item.question}
              <ChevronDown
                className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              id={`faq-answer-${index}`}
              role="region"
              className={`overflow-hidden transition-all duration-200 ${
                openIndex === index ? 'max-h-96 pb-4' : 'max-h-0'
              }`}
            >
              <p className="text-text-body">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
```

### PostCSS Configuration for Tailwind v4

```javascript
// postcss.config.mjs
// Source: https://tailwindcss.com/docs/guides/nextjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}

export default config
```

## State of the Art

| Old Approach (Stack Research) | Current Approach (Verified) | When Changed | Impact |
|-------------------------------|---------------------------|--------------|--------|
| Next.js 15 | Next.js 16.1.6 | 2026 | Turbopack default, async request APIs mandatory, `middleware` -> `proxy`, `data-scroll-behavior` attribute for smooth scroll |
| React 19 | React 19.2.4 | Oct 2025 | View Transitions, `useEffectEvent`, Activity component (not needed for Phase 1 but available) |
| Tailwind `tailwind.config.js` | Tailwind v4 `@theme` in CSS | Jan 2025 | CSS-first config, `@import "tailwindcss"`, `@tailwindcss/postcss` plugin |
| `framer-motion` package | `motion` package (same API) | Nov 2024 | Rebranded, drop-in replacement, `framer-motion` still works but `motion` is canonical |
| `next lint` command | ESLint CLI directly | Next.js 16 | `next lint` removed. Use `eslint .` with flat config |
| `middleware.ts` | `proxy.ts` | Next.js 16 | Filename and export renamed. Not needed for Phase 1 but relevant for Phase 2 rate limiting |
| Zod ^3.23 | Zod 4.3.6 | 2025-2026 | Major version bump. Verify API compatibility before Phase 2 |
| Drizzle ^0.38 | Drizzle 0.45.1 | 2025-2026 | Significant version jump. Verify before Phase 2 |
| Resend ^4 | Resend 6.9.3 | 2025-2026 | Major version bump. Verify before Phase 2 |

**Deprecated/outdated:**
- `next lint` is removed in Next.js 16. Use ESLint directly with flat config.
- `middleware.ts` is deprecated, renamed to `proxy.ts`.
- Synchronous access to `cookies()`, `headers()`, `params`, `searchParams` is fully removed. Must use `await`.
- `next/legacy/image` is deprecated. Use `next/image` only.

## Open Questions

1. **Heading font family**
   - What we know: CLAUDE.md says "Fonte serif ou semi-serif com personalidade (a definir)"
   - What's unclear: Which specific Google Font to use
   - Recommendation: Start with a serif font like Merriweather, Lora, or Playfair Display. Any can be swapped via the `--font-heading-family` CSS variable. The font choice should be finalized before production deployment but does not block development.

2. **Hero illustration assets**
   - What we know: Brand uses "hand-drawn/sketch (preto e branco)" style for coconut/beach/portrait illustrations
   - What's unclear: Whether SVG assets exist or need to be created
   - Recommendation: Use placeholder SVGs during development. The section layout and responsive behavior can be built without final illustrations. If SVGs are not available, consider a simplified text-only hero for initial deployment.

3. **Team member photos vs. illustrations**
   - What we know: The brand style uses sketch-style portraits. Professional photos may or may not be available.
   - What's unclear: Whether actual assets exist
   - Recommendation: Build the team card component to accept either image or illustration. Use decorative placeholder SVGs initially. The component API should support both.

4. **WhatsApp number (personal vs. Business)**
   - What we know: Number 5581987900892 is referenced. STATE.md notes "Confirm WhatsApp number (personal vs Business account)" as TODO.
   - What's unclear: Whether this is a WhatsApp Business account
   - Recommendation: Proceed with the number as-is. `wa.me` links work identically for personal and Business accounts. The pre-filled message functionality works the same way.

5. **FAQ content**
   - What we know: INST-09 requires 5-8 questions in an accordion
   - What's unclear: Specific questions and answers need to be written by the legal team
   - Recommendation: Build the FAQ component with placeholder content. Define the data structure in `constants.ts` so content can be swapped without touching the component.

## Sources

### Primary (HIGH confidence)
- [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16) - Breaking changes, async APIs, scroll behavior, Turbopack default
- [Next.js 16 blog post](https://nextjs.org/blog/next-16) - Feature overview, React 19.2, React Compiler
- [Tailwind CSS v4 theme documentation](https://tailwindcss.com/docs/theme) - @theme directive syntax, design token patterns
- [Tailwind CSS v4 Next.js guide](https://tailwindcss.com/docs/guides/nextjs) - Installation steps, PostCSS config
- [Next.js smooth scroll behavior](https://nextjs.org/docs/messages/missing-data-scroll-behavior) - data-scroll-behavior attribute
- npm registry (verified 2026-03-04): next@16.1.6, tailwindcss@4.2.1, react@19.2.4, typescript@5.9.3, lucide-react@0.577.0, sharp@0.34.5, zod@4.3.6, drizzle-orm@0.45.1, resend@6.9.3, motion@12.35.0

### Secondary (MEDIUM confidence)
- [WhatsApp wa.me deep link format](https://quadlayers.com/how-to-create-a-whatsapp-link-wa-me-with-a-pre-filled-message/) - Phone number formatting, pre-filled message encoding
- [Lucide icons catalog](https://lucide.dev/icons/) - Available icons for legal/business domain
- [Motion (formerly Framer Motion) rebrand](https://motion.dev/docs/react-upgrade-guide) - Package rename, drop-in replacement

### Tertiary (LOW confidence)
- Competitive landscape for Brazilian mediation chambers (from PITFALLS.md research, not live-verified)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All versions verified via npm registry on 2026-03-04. Next.js 16 and Tailwind v4 docs verified via official sources.
- Architecture: HIGH - Server Component pattern, single-page SSG, and smooth scroll are well-documented Next.js patterns. Verified against Next.js 16 breaking changes.
- Pitfalls: HIGH - Color contrast, iOS Safari quirks, WhatsApp formatting, and scroll behavior changes are all verifiable technical facts.
- Content/design questions: MEDIUM - Font choice, illustration assets, and FAQ content depend on stakeholder decisions.

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (30 days -- stack is stable, Next.js 16 is a fresh major release)
