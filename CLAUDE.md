# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visao Geral

**PACIFIQUE!** e uma Camara Privada de Conciliacao e Mediacao sediada em Recife-PE (CNPJ: 65.218.388/0001-47).

Este repositorio contem o website institucional e landing page da PACIFIQUE!, construido como uma aplicacao Next.js estatica (single-page) com foco em conversao via WhatsApp.

---

## Stack Tecnica

- **Framework:** Next.js 16.1.6 (App Router)
- **Runtime:** Node.js
- **Linguagem:** TypeScript 5
- **Styling:** Tailwind CSS 4 (usando @theme syntax)
- **Gerenciador de pacotes:** pnpm
- **Icones:** lucide-react
- **Fonts:** next/font (Inter + Merriweather)

---

## Comandos Principais

```bash
# Desenvolvimento local (porta 3000)
pnpm dev

# Build de producao (gera static export)
pnpm build

# Rodar producao localmente
pnpm start

# Lint
pnpm lint
```

---

## Arquitetura

### Estrutura de Diretorios

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (fonts, metadata, HTML lang)
│   ├── page.tsx            # Home page (single-page landing)
│   ├── globals.css         # Tailwind config + design tokens
│   └── not-found.tsx       # 404 page
├── components/
│   ├── navbar.tsx          # Top navigation (sticky)
│   ├── whatsapp-fab.tsx    # Floating action button (WhatsApp CTA)
│   ├── sections/           # Full-width page sections
│   │   ├── hero.tsx
│   │   ├── services.tsx
│   │   ├── nuclei.tsx
│   │   ├── team.tsx
│   │   ├── legal-sources.tsx
│   │   ├── advantages.tsx
│   │   ├── process-flow.tsx
│   │   ├── comparison.tsx
│   │   ├── faq.tsx
│   │   └── footer.tsx
│   └── ui/                 # Reusable UI primitives
│       ├── section-wrapper.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       └── icon-circle.tsx
└── lib/
    └── constants.ts        # All content data, navigation, nuclei, team, FAQ
```

### Design Tokens (Tailwind @theme)

Cores da marca definidas em `src/app/globals.css`:
- `primary` (#4A4458) — headings, brand text
- `text-body` (#595959) — body text
- `bg-lavender` (#F5F3F7) — alternating section backgrounds
- `accent-deep` (#4A3F5C) — dark cards (legal sources)
- `rose-light` / `rose-medium` — nucleus cards
- `crimson-dark` (#7A2048) — icon circles
- `success` / `error` — comparison indicators
- `whatsapp` (#25D366) — WhatsApp FAB

Fontes:
- `font-heading` — Merriweather (serif, pesos 400/700)
- `font-body` — Inter (sans-serif)

### Path Aliases

`@/*` → `src/*` (configurado em tsconfig.json)

---

## Padroes de Codigo

### Componentes de Secao

Cada secao da landing page e um componente React em `src/components/sections/`:
- Encapsulado em `<SectionWrapper>` (gerencia padding, max-width, alternating backgrounds)
- Usa dados de `src/lib/constants.ts`
- IDs de secao correspondem aos links do navbar (ex: `#nucleos`, `#equipe`)

### Dados Estruturados

Todo conteudo textual (nucleos, equipe, FAQ, navegacao) esta centralizado em `src/lib/constants.ts`:
- `NAV_ITEMS` — links do navbar
- `NUCLEI_DATA` — 7 nucleos de atuacao (titulo, descricao, icone lucide)
- `TEAM_DATA` — 4 membros fundadores
- `FAQ_DATA` — 8 perguntas frequentes
- `WHATSAPP_NUMBER` / `WHATSAPP_MESSAGE` — CTA do WhatsApp

### Responsividade

- **Mobile-first:** Layouts em coluna unica (`flex-col`), expandem para grid em `md:` e `lg:`
- **Breakpoints:** Tailwind defaults (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- **Navbar:** Hamburger menu em mobile (a implementar), horizontal em desktop

### Acessibilidade

- **Semantica HTML:** Uso correto de `<main>`, `<section>`, `<nav>`, `<h1>`-`<h3>`
- **Landmarks:** Cada secao tem `id` para navegacao por ancoras
- **Focus management:** Botoes e links com estados `:hover`, `:focus-visible`
- **Reduced motion:** Media query em `globals.css` desabilita animacoes para usuarios com `prefers-reduced-motion`

---

## Design System

### Paleta de Cores

| Token                | Hex (aprox.)  | Uso                                          |
|----------------------|---------------|----------------------------------------------|
| `primary`            | `#4A4458`     | Headings, brand text, titulos principais     |
| `text-body`          | `#6B6B6B`     | Texto corrido, paragrafos                    |
| `bg-white`           | `#FFFFFF`     | Fundo principal das secoes                   |
| `bg-lavender`        | `#F5F3F7`     | Fundo alternado de secoes (zebra)            |
| `accent-deep`        | `#4A3F5C`     | Cards de destaque (ex: Fontes Normativas)    |
| `accent-deep-text`   | `#FFFFFF`     | Texto sobre fundo accent-deep               |
| `rose-light`         | `#FDE8EC`     | Background de cards (Nucleos de Atuacao)     |
| `rose-medium`        | `#F9D5DC`     | Variacao de background rose para hover/borda |
| `crimson-dark`       | `#7A2048`     | Icones circulares, elementos de destaque     |
| `success`            | `#22C55E`     | Indicadores de sucesso (acordo homologado)   |
| `error`              | `#EF4444`     | Indicadores de erro (termo negativo)         |
| `border-subtle`      | `#E5E5E5`     | Bordas de cards e botoes outlined            |

> **Nota:** Valores aproximados extraidos do material institucional (PDF). Ajustar conforme brand guide definitivo quando disponivel.

### Tipografia

- **Headings:** Fonte serif ou semi-serif com personalidade (a definir)
- **Body:** Sans-serif limpa e legivel (a definir)
- **Hierarquia:** Display > H1 > H2 > H3 > Body > Caption

### Estilo Visual

- **Ilustracoes:** Estilo hand-drawn/sketch (preto e branco) — usado na hero section (coqueiros, praia) e retratos da equipe
- **Cards:** Bordas sutis, backgrounds suaves (lavanda ou rose), cantos levemente arredondados
- **Espacamento:** Whitespace generoso entre secoes
- **Tom:** Profissional mas acolhedor e acessivel — transmitir confianca sem ser frio

### Componentes Recorrentes

- **Card de Nucleo:** Icone circular (crimson-dark) + titulo em bold + descricao
- **Chevron/Setas de fluxo:** Gradiente rose > mauve, indicando progressao de etapas
- **Botoes:** Outlined (sem preenchimento), borda na cor primary
- **Layout de secoes:** Alternancia entre fundo branco e lavanda
- **Cards de destaque:** Fundo accent-deep com texto branco (usado em informacoes legais)

---

## Nucleos de Atuacao

| Nucleo                             | Foco                                                         |
|------------------------------------|--------------------------------------------------------------|
| Consumidor Aereo                   | Cancelamentos, atrasos, extravio, overbooking, reembolsos   |
| Consumidor Bancario                | Renegociacao de dividas, cobrancas indevidas, tarifas        |
| Direito de Saude                   | Negativas de cobertura, reembolsos medicos, medicamentos     |
| Direito de Familia                 | Divorcios, guarda, alimentos, regulamentacao de visitas      |
| Direito de Sucessoes               | Inventarios extrajudiciais, partilha, disputas de herdeiros  |
| Praticas Restaurativas             | Conflitos penais transigiveis, comunitarios, escolares       |
| Demandas Empresariais Estrategicas | Conflitos societarios, inadimplementos, insolvencia          |

---

## Fluxo do Procedimento

### Fase Inicial — Documentos Obrigatorios
1. **Termos e Condicoes de Uso** — Regras gerais, direitos/deveres, honorarios, clausula de boa-fe
2. **Politica de Privacidade** — LGPD, confidencialidade das sessoes, direitos dos titulares
3. **Regulamento Interno da Camara** — Procedimentos, normas eticas, prazos, ouvidoria

### Fase Procedimental
1. **Carta Convite** — Convite formal a parte requerida (prazo: 30 dias para resposta)
2. **Entrevistas Preliminares (caucus)** — Sessoes individuais e confidenciais com cada parte
3. **Instalacao da Sessao** — Sessao conjunta (preferencialmente remota, art. 46 Lei 13.140/2015)

### Resultados Possiveis
- **Acordo Homologado** — Termo de Acordo com forca de titulo executivo extrajudicial (art. 20, Lei 13.140/2015)
- **Termo Negativo** — Certidao de tentativa de autocomposicao (art. 334 CPC/2015)

---

## Equipe Fundadora

| Nome                          | Papel                        |
|-------------------------------|------------------------------|
| Carlos Henrique Borges de Melo | Advogado / Diretor Presidente |
| Amanda Ledo                    | Advogada / Conciliadora Responsavel |
| Rui Manuel Costa               | Diretor de Operacoes          |
| Icaro Sampaio                  | Diretor de Tecnologia         |

---

## Convencoes de Desenvolvimento

- **Codigo e commits:** Ingles
- **Conteudo do site (copy):** Portugues brasileiro (pt-BR)
- **Nomenclatura de componentes:** PascalCase para componentes, kebab-case para arquivos de secoes
- **Tipos:** Exportados de `src/lib/constants.ts` quando compartilhados
- **Lucide icons:** Passados como string no formato `"IconName"` nos dados, resolvidos dinamicamente via `lucide-react`

---

## Requisitos de Conformidade

### LGPD (Lei n. 13.709/2018)
Qualquer funcionalidade que colete dados pessoais deve:
- Obter consentimento explicito
- Ter politica de privacidade acessivel
- Declarar finalidade especifica de coleta
- Permitir acesso, correcao e exclusao de dados pelo titular

### Acessibilidade (WCAG 2.1 AA)
- Contraste minimo de 4.5:1 para texto normal, 3:1 para texto grande
- Navegacao por teclado funcional (Tab, Enter, Esc)
- Textos alternativos para imagens/icones decorativos
- Headings hierarquicos (`<h1>` → `<h2>` → `<h3>`)

---

## Contexto do Projeto

### Missao da PACIFIQUE!
Resolucao pacifica de conflitos com excelencia, seguranca juridica e celeridade.

### Base Legal
- Resolucao n. 125/2010 do CNJ — Politica Nacional de conflitos
- Resolucao n. 410/2018 do TJPE — Credenciamento de camaras privadas (PE)
- Lei n. 13.140/2015 — Lei de Mediacao
- CPC/2015, art. 3, par. 2 e 3 — Autocomposicao

### Nucleos de Atuacao (7 areas)
1. Consumidor Aereo
2. Consumidor Bancario
3. Direito de Saude
4. Direito de Familia
5. Direito de Sucessoes
6. Praticas Restaurativas
7. Demandas Empresariais Estrategicas

### Equipe Fundadora
- Carlos Henrique Borges de Melo (Diretor Presidente)
- Amanda Ledo (Conciliadora Responsavel)
- Rui Manuel Costa (Diretor de Operacoes)
- Icaro Sampaio (Diretor de Tecnologia)

---

## Diretrizes de Design

### Principios
- **Mobile-first:** Layout em coluna unica por padrao, expande para grid em `md:` / `lg:`
- **Clareza > Decoracao:** Cada elemento visual serve a um proposito funcional
- **Tom institucional:** Credibilidade juridica + acolhimento (nao intimidador)

### Layout
- **Max-width:** ~1200px centralizado via `SectionWrapper`
- **Background alternado:** Secoes com `bg-white` e `bg-lavender` (zebra pattern)
- **Espacamento vertical:** Minimo 64px entre secoes (`py-16` ou superior)

### Componentes Visuais
- **Icone circular:** `IconCircle` com fundo `crimson-dark` (usado em nucleos)
- **Cards:** Bordas sutis, backgrounds suaves (lavanda ou rose), cantos arredondados
- **Botoes:** Outlined com borda `primary`, hover com preenchimento suave
- **Setas de fluxo:** Gradiente rose → mauve (usado em process-flow)

### Interacoes
- **Transicoes:** 200-300ms ease, sem animacoes excessivas
- **Scroll:** `scroll-smooth` habilitado no `<html>`
- **Estados:** Hover, focus-visible e active visiveis em todos elementos interativos

### Performance
- **Core Web Vitals:** LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Imagens:** Usar `next/image` com WebP/AVIF, lazy loading abaixo do fold
- **Fontes:** `next/font` com `display: swap` (ja configurado)
