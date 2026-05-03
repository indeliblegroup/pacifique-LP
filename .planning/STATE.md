# Project State: PACIFIQUE!

## Project Reference

**Core Value:** Camara privada de conciliacao e mediacao que direciona cada conflito ao metodo adequado (conciliacao | mediacao | negociacao) e conduz o procedimento de forma virtual estruturada, com qualidade auditavel e seguranca juridica.

**Diferencial estrategico declarado** (Amanda Ledo, doc institucional):
1. Roteamento previo do conflito ao metodo adequado.
2. Conducao virtual estruturada (camara virtual em PE — mercado pouco explorado).
3. Inteligencia de dados consumeristas como ativo institucional.
4. Convenio TJPE (legitimidade institucional + forca executiva).

**Restricoes inviolaveis:**
- Lei 13.140/2015 — mediacao exige conducao humana.
- Sigilo de mediacao e principio legal, nao boa pratica.
- LGPD em todo dado pessoal.
- Toda saida de IA e rascunho com validacao humana obrigatoria.

---

## Current Position

**Fase atual:** 1 — Intake publico e roteamento
**Status:** roadmap aprovado, execucao por iniciar
**Branch ativa:** `claude/implement-instagram-design-r2gok` (Agent Dev Kit + roadmap)

```
Fase A — Landing institucional             [##########] CONCLUIDA
Fase B — Backoffice MVP                    [##########] CONCLUIDA
Fase 1 — Intake publico + roteamento       [..........] 0/6 (proxima)
Fase 2 — Conducao virtual estruturada      [..........] aguardando F1
Fase 3 — Escala B2B + dados + convenio     [..........] aguardando F2
```

Detalhe das fases em `.planning/ROADMAP.md`.

---

## Estado tecnico atual

| Camada              | Status                                                                           |
|---------------------|----------------------------------------------------------------------------------|
| Landing publica     | `/` + `/equipe` em producao, hero/services/nucleos/team/legal/advantages/process/comparison/faq/footer/join-team. |
| Backoffice          | `/admin/*` — 17 paginas: dashboard, cases (CRUD + sessoes + emails + docs), calendar, documents, emails, users, audit, profile. |
| API REST            | 19 endpoints autenticados (cases, parties, sessions, documents, emails, users, search, audit, upload). |
| Auth                | NextAuth v5 beta, Credentials + bcrypt, JWT 30d, middleware em /admin + 4 prefixos /api/*. |
| RBAC                | `src/lib/permissions.ts` — ADMIN | LAWYER | CONCILIATOR.                          |
| Banco               | Postgres via Prisma 7 (`@prisma/adapter-pg`); 9 modelos; 2 migrations.            |
| Storage             | Vercel Blob (documentos versionados via `previousVersionId`).                     |
| Email               | Resend + EmailTemplate model.                                                    |
| Validacao           | Zod em `src/lib/validations.ts` + utilitario CPF/CNPJ.                            |
| Tests               | **Nenhum** (issue #5 aberto).                                                    |
| CI                  | **Nenhum** (build em deploy do Vercel; sem PR check).                            |

**Debt aberto (GitHub issues):**

| # | Titulo                                                                | Severidade   |
|---|-----------------------------------------------------------------------|--------------|
| 2 | schema: migrar colunas SQLite-era para tipos Postgres nativos          | medium       |
| 3 | permissions: helpers que ignoram parametro role                        | low          |
| 4 | middleware: matcher cobrindo so 4 de 9 prefixos /api                   | medium       |
| 5 | testing: introduzir suite de testes                                    | medium-high  |
| 6 | .planning: refresh dos artefatos (parcialmente endereçado neste commit)| low          |
| 7 | deploy: substituir hack do empty-commit redeploy                       | low          |
| 8 | cleanup: remover svgs default do public/                               | trivial      |

---

## Decisoes-chave acumuladas

| Decisao                                                          | Quando         | Razao                                                                |
|------------------------------------------------------------------|----------------|----------------------------------------------------------------------|
| Next.js 16 monolito (App Router) com SSG na publica + admin auth | inicio         | Reduz superficie operacional; auth e admin convivem com landing.     |
| Tailwind v4 + tokens em globals.css                              | inicio         | Mobile-first com design system enxuto.                               |
| Prisma 7 + Postgres (migrado de Turso/SQLite)                    | abr/2026       | Volume crescendo; queries analiticas no horizonte.                   |
| NextAuth v5 beta + Credentials + bcrypt                          | mar/2026       | Sem dependencia de IdP externo; controle total do fluxo.             |
| Resend para email transacional                                   | mar/2026       | Free tier basta para volume atual.                                   |
| Vercel Blob para documentos                                      | mar/2026       | Integra naturalmente com deploy Vercel.                              |
| RBAC simples (3 roles) com helpers em `permissions.ts`           | mar/2026       | Refletir a estrutura organizacional atual sem over-engineering.      |
| Audit log via modelo `Activity` desde o inicio                   | mar/2026       | Sigilo de mediacao + LGPD exigem trilha auditavel.                   |
| Versionamento de documento via `previousVersionId`               | mar/2026       | Termo de Acordo passa por revisoes; historico legalmente relevante.  |
| Agent Development Kit (`.claude/`) — 5 camadas                   | mai/2026       | Memoria + skills + hooks + subagents alinhados ao dominio juridico.  |

---

## Insights de pesquisa relevantes

- **Roteamento e o GAP de mercado** — segundo a Amanda, o erro mais comum em PE e tratar conflito relacional como conciliacao rapida (perde profundidade) ou conflito objetivo como mediacao (engessa o acordo). Endereçar isso e o produto.
- **Camara virtual estruturada** — pedidos de credenciamento da OAB e UNICAP em tramitacao no TJPE; sem vedacao legal a conciliacao virtual. Janela competitiva aberta.
- **PROCON e CEJUSCs operam com baixa qualidade** — alto volume + baixo engajamento dos conciliadores. Espaco para qualidade premium em conciliacoes consumeristas.
- **AI-assisted, human-conducted** — Lei 13.140/2015 art. de conducao humana abre espaco amplo para IA em pre-mediacao, sugestao, organizacao, minutas, com validacao humana final.

---

## Session Continuity

**Ultima sessao:** 2026-05-03 — implementacao do Agent Development Kit (5 camadas em `.claude/`), refresh de `CLAUDE.md` com dominio metodologico, abertura das issues #2-#8, e este novo `ROADMAP.md`.

**Proxima acao recomendada:** validar o `ROADMAP.md` com a equipe fundadora, depois iniciar **F1.1** (modelagem de metodo no `Case`) e em paralelo o hardening pre-fase-2 (issues #2, #4, #5).

---

*State atualizado: 2026-05-03*
*Substitui o STATE.md de 2026-03-04 (que descrevia apenas a fase de landing).*
