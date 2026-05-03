# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visao Geral

**PACIFIQUE!** e uma Camara Privada de Conciliacao e Mediacao sediada em Recife-PE (CNPJ: 65.218.388/0001-47).

Este repositorio contem:

1. **Landing page institucional** (rota `/`) — site de conversao para WhatsApp.
2. **Pagina de equipe** (rota `/equipe`) — biografias dos fundadores.
3. **Backoffice operacional** (`/admin/*`) — sistema autenticado para gestao de casos, partes, sessoes de mediacao, documentos, emails, templates, calendario, usuarios e auditoria.
4. **API REST** (`/api/*`) — endpoints autenticados que sustentam o backoffice (cases, parties, sessions, documents, emails, users, search, audit, upload).

> **Nota historica:** versoes anteriores deste documento descreviam apenas a landing page estatica. O escopo cresceu para incluir backoffice + APIs autenticadas com Prisma/PostgreSQL. Mantenha este documento alinhado com o codigo real.

---

## Stack Tecnica

- **Framework:** Next.js 16.1.6 (App Router)
- **Runtime:** Node.js
- **Linguagem:** TypeScript 5
- **Styling:** Tailwind CSS 4 (usando @theme syntax)
- **Gerenciador de pacotes:** pnpm
- **Icones:** lucide-react
- **Fonts:** next/font (Inter + Merriweather)
- **Banco de dados:** PostgreSQL via Prisma 7 (`@prisma/adapter-pg`)
- **Autenticacao:** NextAuth v5 (beta) com provider Credentials + bcryptjs
- **Email transacional:** Resend (`src/lib/email.ts`)
- **Storage de arquivos:** Vercel Blob (`src/lib/blob.ts`)
- **Validacao:** Zod (`src/lib/validations.ts`)
- **Charts (admin):** Recharts

---

## Comandos Principais

```bash
# Desenvolvimento local (porta 3000)
pnpm dev

# Build de producao (executa prisma generate + next build)
pnpm build

# Rodar producao localmente
pnpm start

# Lint
pnpm lint

# Migrations Prisma
pnpm prisma migrate dev      # cria nova migration em dev
pnpm prisma migrate deploy   # aplica migrations em prod
pnpm prisma generate         # regera client (roda automaticamente em postinstall)
pnpm prisma studio           # GUI para inspecionar dados
pnpm prisma db seed          # roda prisma/seed.ts

# Deploy (Vercel)
pnpm deploy                  # vercel --prod
pnpm redeploy                # commit vazio + push para main (gatilho de redeploy)
```

---

## Arquitetura

### Estrutura de Diretorios

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, metadata, HTML lang)
│   ├── page.tsx                  # Landing (single-page)
│   ├── globals.css               # Tailwind config + design tokens
│   ├── not-found.tsx             # 404 page
│   ├── equipe/                   # Pagina publica /equipe
│   ├── auth/                     # /auth/login, /auth/error (NextAuth)
│   ├── admin/                    # Backoffice autenticado (layout + 17 paginas)
│   │   ├── layout.tsx            # Sidebar + header + session provider
│   │   ├── page.tsx              # Dashboard com analytics
│   │   ├── cases/                # CRUD de casos
│   │   ├── calendar/             # Agendamento de sessoes
│   │   ├── documents/            # Documentos (Vercel Blob)
│   │   ├── emails/               # Composer + templates (Resend)
│   │   ├── users/                # Gestao de usuarios
│   │   ├── audit/                # Audit log
│   │   └── profile/              # Perfil + senha
│   └── api/                      # API REST autenticada
│       ├── auth/[...nextauth]/   # Handler NextAuth
│       ├── cases/                # CRUD de casos
│       ├── parties/              # CRUD de partes
│       ├── sessions/             # CRUD de sessoes (+ upcoming)
│       ├── documents/            # CRUD + upload
│       ├── emails/               # Envio + templates
│       ├── users/                # CRUD + me + senha
│       ├── search/               # Busca global
│       ├── audit/                # Audit log
│       └── upload/               # Upload de arquivos
├── components/
│   ├── navbar.tsx                # Top navigation (publico)
│   ├── whatsapp-fab.tsx          # Floating action button (WhatsApp)
│   ├── sections/                 # Secoes da landing page
│   │   ├── hero.tsx, services.tsx, nuclei.tsx, team.tsx,
│   │   ├── legal-sources.tsx, advantages.tsx, process-flow.tsx,
│   │   ├── comparison.tsx, faq.tsx, footer.tsx, join-team.tsx
│   ├── admin/                    # Componentes do backoffice
│   │   ├── layout/               # sidebar, header, global-search
│   │   ├── cases/                # forms, filters, tabela, lista
│   │   ├── calendar/             # grid, session-form, session-list
│   │   ├── documents/            # upload, lista
│   │   ├── emails/               # composer, lista
│   │   ├── parties/              # form, lista
│   │   ├── users/                # form, lista
│   │   ├── profile/              # editar, alterar senha
│   │   ├── dashboard/            # analytics-charts (Recharts)
│   │   ├── shared/               # pagination
│   │   └── providers/            # session-provider (NextAuth)
│   └── ui/                       # Primitivas (section-wrapper, card, badge, icon-circle)
├── lib/
│   ├── constants.ts              # Conteudo da landing (nucleos, equipe, FAQ, nav)
│   ├── auth.ts                   # NextAuth config (Credentials + bcrypt)
│   ├── auth-helpers.ts           # Helpers de sessao em server components
│   ├── permissions.ts            # RBAC (ADMIN | LAWYER | CONCILIATOR)
│   ├── prisma.ts                 # Singleton do PrismaClient
│   ├── blob.ts                   # Vercel Blob (upload/delete)
│   ├── email.ts                  # Resend (envio + templates)
│   ├── validations.ts            # Schemas Zod
│   ├── case-constants.ts         # Enums e labels (CaseStatus, CaseNucleus, etc.)
│   ├── case-utils.ts             # Helpers de caso
│   ├── session-utils.ts          # Helpers de sessao
│   ├── activity-utils.ts         # Helpers de audit log
│   ├── cpf-cnpj-utils.ts         # Validacao + formatacao de CPF/CNPJ
│   └── hooks/use-debounce.ts
├── middleware.ts                 # Protege /admin e /api/{cases,documents,emails,users}
└── types/next-auth.d.ts          # Augment dos tipos NextAuth (id, role)

prisma/
├── schema.prisma                 # Modelo: User, Case, Party, MediationSession, Document, Email, EmailTemplate, Activity, Session
├── migrations/                   # init + add_calendar_system
└── seed.ts                       # Seed inicial (executado por `pnpm prisma db seed`)
```

### Modelo de Dominio (Prisma)

Modelos principais e enums em `prisma/schema.prisma`:

- **User** — `role: UserRole` (ADMIN | LAWYER | CONCILIATOR), `status: UserStatus` (INVITED | ACTIVE | INACTIVE), `passwordHash` opcional.
- **Case** — caso de mediacao/conciliacao, com `nucleus: CaseNucleus`, `status: CaseStatus` (DRAFT → INVITE_SENT → INVITE_ACCEPTED → INTERVIEW_PHASE → SESSION_SCHEDULED → IN_MEDIATION → AGREEMENT_REACHED | NEGATIVE_TERM → CLOSED → ARCHIVED), `assignedTo` e `createdBy` em `User`.
- **Party** — parte requerente ou requerida, vinculada a um Case (cascade delete).
- **MediationSession** — sessao agendada, com `type: MediationSessionType` (JOINT | INDIVIDUAL_REQUESTING | INDIVIDUAL_REQUESTED), `status: SessionStatus`, `conductedBy` opcional.
- **Document** — arquivo no Vercel Blob, com `type: DocumentType`, versionamento via `previousVersionId`.
- **Email / EmailTemplate** — historico de envios via Resend, com status (DRAFT | SENT | DELIVERED | OPENED | FAILED).
- **Activity** — audit log com `type: ActivityType`.
- **Session** (NextAuth) — token de sessao por usuario.

### Autenticacao e Autorizacao

- **NextAuth v5** com provider Credentials (email + senha bcrypt), strategy JWT, sessao de 30 dias (`src/lib/auth.ts`).
- **Middleware** (`src/middleware.ts`) protege `/admin/*` (redirect para `/auth/login`) e `/api/{cases,documents,emails,users}/*` (retorna 401).
- **RBAC** em `src/lib/permissions.ts` com helpers `canManageUsers`, `canCreateCases`, `canEditCase(role, ownerId, userId)`, `canDeleteCases`, `canManageTemplates`, `canViewAuditLogs`.
- Token JWT enriquecido com `id` e `role` via callbacks `jwt`/`session` (tipos em `src/types/next-auth.d.ts`).

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
- **Lei n. 13.140/2015** — Lei de Mediacao (procedimento, principios, sigilo, condicao executiva do acordo).
- **CPC/2015**:
  - **Art. 3, §2 e §3** — Estimulo a autocomposicao por juizes, advogados, defensores, MP.
  - **Art. 165** — Conciliadores e mediadores; conciliador atua de forma mais ativa e pode sugerir solucoes.
  - **Art. 334** — Audiencia obrigatoria de conciliacao/mediacao no inicio do processo.
- **Resolucao n. 125/2010 do CNJ** — Politica Nacional de tratamento adequado de conflitos; criou os CEJUSCs.
- **Resolucao n. 410/2018 do TJPE** — Credenciamento de camaras privadas em Pernambuco.
- **CDC (Lei 8.078/1990)** — Aplicavel a conflitos consumeristas (Consumidor Aereo, Consumidor Bancario).

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

## Dominio: Metodos Adequados de Resolucao de Conflitos

A PACIFIQUE! oferece tres metodos consensuais distintos. **O grande diferencial estrategico da camara nao e apenas executar os procedimentos, mas avaliar previamente cada conflito e direciona-lo para o metodo mais adequado.** Confundir os tres e a falha mais comum no mercado e o erro mais caro a se cometer no produto.

### Quadro comparativo (referencia rapida)

| Eixo                       | Conciliacao                                         | Negociacao                                       | Mediacao                                                   |
|----------------------------|-----------------------------------------------------|--------------------------------------------------|------------------------------------------------------------|
| **Postura do terceiro**    | Ativo — pode sugerir solucoes, propor acordos       | Tecnico-estrategico — formula propostas, avalia cenarios | Facilitador — NAO sugere acordo, conduz dialogo         |
| **Base legal**             | CPC arts. 3§3, 165, 334 + Res. CNJ 125/2010         | Sem lei propria (autonomia da vontade, contrato) | Lei 13.140/2015 (lei propria, regime fechado)              |
| **Sigilo / confidencialidade** | Pratica recomendada, nao garantia legal         | Apenas se contratualmente convencionado          | **Principio legal** (art. 2-VII e arts. 30-31 da Lei 13.140) |
| **Impedimento posterior**  | Avaliar caso a caso                                 | Em regra, sem impedimento profissional           | Mediador fica impedido de atuar como advogado na materia   |
| **Tipo de conflito ideal** | Objetivo, transacional, solucao rapida              | Indenizatorio, contratual, B2B, grandes players  | Relacional, continuado, complexo, sigiloso                 |
| **Casos tipicos**          | Dividas bancarias, cia aerea, consumo               | Indenizacoes, parcelamentos CNPJ, bancarios      | Familia, sucessao com gestao patrimonial, societario, casais |
| **Escala / IA**            | Alta escala viavel — IA pode estruturar propostas com validacao do conciliador | Alta flexibilidade — IA apoia analise e cenarios | Limitada — Lei exige conducao humana; IA so como suporte   |

### Conciliacao

- **Definicao operacional:** terceiro facilita e direciona a conversa, podendo propor acordos com parametros (valores, prazos, formas de pagamento). Decisao final sempre das partes; conciliador nao impoe, nao pressiona, nao decide.
- **Quando indicar:** conflitos objetivos sem componente relacional forte, demanda de solucao rapida, ausencia de necessidade legal de sigilo. Bancario, aereo, consumo em geral.
- **Oportunidade de produto:** este e o metodo mais escalavel para a plataforma. IA pode coletar dados do conflito, estruturar propostas iniciais e enviar as partes; o conciliador valida e formaliza. Diferencial vs. PROCON e CEJUSCs: ambiente menos hostil, traducao de linguagem tecnica, conducao estrategica, fluxo operacional simples.

### Negociacao

- **Definicao operacional:** metodo consensual com maior liberdade procedimental e atuacao tecnica incisiva (formulacao de propostas, analise de cenarios, mitigacao de risco, criacao de zonas de ganho mutuo).
- **Quando indicar:** conflitos de interesse economico/contratual/indenizatorio onde nao ha relacao continuada a preservar. Grandes players economicos, mutiroes B2B/B2C, bancarios, indenizacoes.
- **Sigilo:** nao automatico — incluir clausula de confidencialidade quando relevante.
- **Vantagem operacional:** sem o regime fechado da Lei 13.140, permite atuacao mais agil e adaptavel.

### Mediacao

- **Definicao operacional:** mediador atua **estritamente como facilitador do dialogo**; NAO sugere acordo. Decisao construida pelas partes.
- **Principios (Lei 13.140/2015, art. 2):** imparcialidade, isonomia entre as partes, oralidade, informalidade, autonomia da vontade, busca do consenso, **confidencialidade**, boa-fe.
- **Quando indicar:** conflitos relacionais, complexos, com necessidade de preservacao de vinculo continuado, ou quando o sigilo legal e o motivo central da escolha (societario de capital aberto, casais, irmaos em sucessao com gestao patrimonial conjunta).
- **Impedimento (art. 5):** aplicam-se ao mediador as hipoteses de impedimento e suspeicao do juiz.
  - Amizade intima, relacao profissional atual, interesse direto/indireto e historico de conflito **vedam** atuacao.
  - Amizade nao intima nao e automaticamente proibida — exige revelacao expressa e consentimento registrado de ambas as partes.
- **Confidencialidade:** principio **legal** (art. 2-VII e arts. 30-31), nao convencional. Nao reduzir nem reformular como "boa pratica".
- **Isonomia:** se uma das partes nao tem advogado, o mediador deve informar expressamente o direito de constituir advogado e oferecer reagendamento. A parte pode optar por prosseguir sem prejuizo da validade.

### IA + Conducao Humana (Lei 13.140/2015)

A Lei 13.140/2015 exige **conducao humana** do procedimento de mediacao. Tecnologia e permitida como suporte. Diretrizes operacionais para qualquer feature do produto que envolva IA:

- **Pre-mediacao** — coleta de dados, educacao da parte sobre o procedimento, mapeamento inicial: **OK**.
- **Sugestao de perguntas ao mediador** durante a sessao: **OK**, com mediador no comando.
- **Organizacao de falas e identificacao de pontos de consenso**: **OK** como apoio.
- **Geracao de minutas de acordo e resumos**: **OK**, com revisao e validacao humana obrigatoria antes da formalizacao.
- **Decisao automatizada / acordo sem validacao humana**: **NUNCA**.
- **Substituicao do mediador na conducao da sessao**: **NUNCA**.

Para **conciliacao**, o espaco de IA e maior: estruturar propostas iniciais com base em dados do conflito e enviar as partes e aceitavel, desde que haja anuencia e validacao formal do conciliador antes de formalizar.

Para **negociacao**, ha maior liberdade — IA pode apoiar leitura estrategica, identificacao de ZOPA, construcao de propostas e analise de cenarios.

Sempre que uma feature for proposta, registrar explicitamente: (1) qual metodo se aplica, (2) onde a IA atua, (3) onde a validacao humana entra, (4) base legal aplicavel.

### Roteamento de Conflitos (avaliacao previa)

Antes de iniciar qualquer procedimento, avaliar:

1. **Existe relacao continuada entre as partes?** Sim → mediacao.
2. **Sigilo e requisito central?** Sim → mediacao.
3. **Conflito e objetivo, transacional, com solucao quantificavel (valor, prazo)?** Sim → conciliacao.
4. **Conflito envolve grande player economico, sem relacao a preservar, com margem para composicao estrategica?** → negociacao.
5. **Conflito sera levado a Judiciario?** Convenio TJPE traz forca executiva ao acordo homologado.

Erros frequentes de roteamento (a evitar no produto):
- Tratar conflito relacional complexo (familia, societario) como conciliacao rapida — perde-se a profundidade necessaria.
- Tratar conflito objetivo (cia aerea, divida) como mediacao — adiciona formalidade desnecessaria e desestimula o acordo.

### Posicionamento Estrategico

- **Convenio TJPE** — legitimidade institucional, reconhecimento do Judiciario, forca executiva do acordo (titulo executivo extrajudicial, art. 20, Lei 13.140/2015).
- **Camara virtual estruturada** — mercado pouco explorado em PE; pedidos de credenciamento da OAB e UNICAP no TJPE em tramitacao. Sem vedacao legal a conciliacao virtual.
- **Inteligencia de dados (consumerista)** — taxa de acordo por tipo de conflito, tempo medio de resolucao, principais causas-raiz, reincidencia por area/empresa. Diferencial vs. PROCON.

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

---

## Infraestrutura Claude Code (5-Layer Stack)

Este repositorio adota o "Agent Development Kit" — uma estrutura em 5 camadas que organiza memoria, conhecimento, guardrails, delegacao e distribuicao para sessoes do Claude Code.

| Camada | Localizacao                       | Proposito                                                |
|--------|-----------------------------------|----------------------------------------------------------|
| L1 — Memory      | `CLAUDE.md` (este arquivo)         | Constituicao do agente; sempre carregado.                |
| L2 — Knowledge   | `.claude/skills/`                  | Skills modulares, invocadas sob demanda por descricao.   |
| L3 — Guardrails  | `.claude/settings.json` + `.claude/hooks/` | Hooks deterministicos em eventos do agente.       |
| L4 — Delegation  | `.claude/agents/`                  | Subagents com contexto isolado, retornam apenas resultado. |
| L5 — Distribution| `.claude/plugins/manifest.json`    | Bundle de skills + agents + hooks + commands.            |

Para detalhes, ver `.claude/README.md`.

### Quando consultar cada camada

- **Mudou regra de codigo / convencao / dominio?** → atualizar este `CLAUDE.md` (L1).
- **Tarefa repetivel com inputs/outputs claros (ex: roteamento de metodo, geracao de minuta)?** → criar skill em `.claude/skills/` (L2).
- **Comportamento deve ser garantido independentemente do prompt (ex: bloquear `rm -rf`, rodar lint pos-edit)?** → hook em `.claude/settings.json` (L3).
- **Trabalho extenso que polui o contexto (ex: revisao de codigo, exploracao da base)?** → subagent em `.claude/agents/` (L4).
