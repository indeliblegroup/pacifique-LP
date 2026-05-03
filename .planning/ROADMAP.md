# Roadmap: PACIFIQUE!

**Atualizado:** 2026-05-03
**Substitui:** o roadmap original de 2026-03-04, escrito quando o escopo era apenas landing page.
**Idioma:** PT-BR no conteudo de dominio; nomes de funcoes/modelos em ingles seguindo a convencao do `CLAUDE.md`.

---

## Onde estamos

**Fases ja entregues (nao previstas no roadmap original):**

- **Fase A — Landing institucional** (entregue): site estatico + WhatsApp FAB + 7 nucleos + equipe + FAQ + fontes normativas. Atende a missao de comunicar credibilidade institucional.
- **Fase B — Backoffice MVP** (entregue): autenticacao (NextAuth + bcrypt), RBAC (ADMIN | LAWYER | CONCILIATOR), CRUD de casos, partes, sessoes de mediacao, documentos (Vercel Blob), emails (Resend), templates, calendario, dashboard analitico, audit log. 19 endpoints REST, 9 modelos Prisma, middleware protegendo rotas autenticadas.

**O que ainda nao existe e e o diferencial estrategico declarado pela Amanda:**

1. Roteamento de conflito ao metodo adequado (conciliacao | mediacao | negociacao) — nao ha sequer o campo `method` no modelo `Case`.
2. Intake publico — partes nao tem como iniciar um procedimento sem contato manual via WhatsApp.
3. Portal das partes — nao ha autenticacao para a parte (apenas para o time interno).
4. Conducao virtual estruturada da sessao — sem video integrado, sem toolkit do mediador, sem coleta pre-mediacao.
5. Inteligencia de dados consumeristas — sem agregados, sem cohort por empresa/setor.
6. Convenio TJPE — sem integracao tecnica.

Este roadmap aborda **da Fase 1 em diante** (intake + roteamento). Fases A e B ficam como "concluido" no historico de `STATE.md`.

---

## Premissas e restricoes (ler antes de qualquer plano de execucao)

- **Lei 13.140/2015** — mediacao exige conducao humana. IA pode preparar, sugerir, organizar, redigir minutas, mas NAO conduz sessao nem fecha acordo sem validacao humana.
- **Sigilo de mediacao** — principio legal, nao boa pratica. Conteudo de sessao de mediacao nunca em logs, nunca em emails de marketing, nunca em metricas agregadas sem anonimizacao real.
- **LGPD** — toda feature que toque dado pessoal passa pela skill `lgpd-checklist`. Bases legais explicitas, retencao definida, direitos do titular acionaveis.
- **Validacao humana obrigatoria** — toda saida de IA (classificacao de metodo, minuta, resumo) e RASCUNHO ate o conciliador/mediador validar. Marcado explicitamente no produto.
- **Convencoes do CLAUDE.md** — `SectionWrapper`, dados em `src/lib/constants.ts`, lucide como string, RBAC via `permissions.ts`, validacao via Zod, mobile-first.

---

## Eixos estrategicos

Cada feature deste roadmap se justifica por um (ou mais) destes 4 eixos:

| Eixo                       | Pergunta que responde                                              |
|----------------------------|--------------------------------------------------------------------|
| **R — Roteamento**         | A plataforma manda o conflito para o metodo certo?                |
| **V — Virtualizacao**      | A camara opera 100% virtual de forma estruturada?                 |
| **D — Dados consumeristas**| A plataforma vira ativo institucional com inteligencia setorial?  |
| **B — B2B / convenio**     | A plataforma escala via mutirao, parceria empresarial e TJPE?     |

---

## Fase 1 — Intake publico e roteamento (proximos 3-4 meses)

> **Hipotese central:** o maior gap competitivo da PACIFIQUE! hoje nao e procedimento — e *direcionar* o conflito ao metodo adequado antes de iniciar. Esta fase entrega esse diferencial pela primeira vez no codigo.

### F1.1 — Modelagem de metodo no `Case`
**Eixo:** R
**Tamanho:** S
**Depende de:** —

- Adicionar enum `CaseMethod = CONCILIACAO | MEDIACAO | NEGOCIACAO` em `prisma/schema.prisma`.
- Adicionar `method: CaseMethod` ao modelo `Case` (NOT NULL apos backfill).
- Adicionar `aiRoutingMetadata: Json?` para guardar a recomendacao da IA (justificativa, criterio, confianca).
- Adicionar `methodConfirmedById: String?` + `methodConfirmedAt: DateTime?` para registrar quem validou humanamente.
- Migration com backfill: para casos existentes, popular `method` por inferencia do nucleo (heuristica simples: Familia/Sucessoes → MEDIACAO; demais → CONCILIACAO) e marcar `methodConfirmedAt: null` para forcar revisao.

**Aceite:** schema atualizado, migracao testada em dev e staging, casos existentes nao quebram.

### F1.2 — Formulario publico de intake
**Eixo:** R
**Tamanho:** M
**Depende de:** —

- Rota publica `/iniciar` (multi-step, mobile-first).
- Steps: (1) descrever o conflito (relato livre + perguntas-guia opcionais), (2) qualificar a outra parte (nome + tipo PF/PJ + contato se conhecido), (3) seu contato + nucleo de interesse (chips) + urgencia, (4) consentimento LGPD + politica de privacidade.
- Server Action que cria registro em novo modelo `Intake` (status: SUBMITTED). NAO cria `Case` ainda — caso so e gerado apos validacao.
- Email transacional de confirmacao para a parte.
- Notificacao interna (email + entrada em fila de triagem) para a equipe.

**Aceite:** visitante consegue submeter relato no mobile sem friccao; entrada aparece na triagem do admin; LGPD documentado em `src/lib/validations.ts` com versao do consentimento.

### F1.3 — Roteamento assistido por IA
**Eixo:** R
**Tamanho:** M
**Depende de:** F1.1, F1.2

- Server Action que recebe um `Intake` e devolve `{ method, nucleus, justificativa, criterio, confianca, alertas }`.
- Implementacao: chamar Claude API (ou OpenAI) com prompt baseado na skill `method-routing` ja documentada em `.claude/skills/method-routing/SKILL.md`. Reaproveitar a heuristica.
- Sempre devolver justificativa textual em PT-BR + base legal.
- Salvar resultado em `Intake.aiRoutingResult: Json` e marcar como rascunho.
- Custo: medir tokens por intake; orcar mensal.

**Aceite:** dado um relato, a IA produz recomendacao consistente com a heuristica do `CLAUDE.md > Roteamento de Conflitos`. Nunca decide automaticamente — a recomendacao e sugestao para o humano.

### F1.4 — Fila de triagem para a equipe interna
**Eixo:** R
**Tamanho:** M
**Depende de:** F1.3

- Pagina `/admin/triage` listando intakes por status (SUBMITTED | UNDER_REVIEW | APPROVED | REJECTED | DUPLICATE).
- Detalhe do intake mostra: relato original, recomendacao da IA, criterio decisivo, base legal citada.
- Conciliador/advogado pode: (a) aprovar com a recomendacao, (b) sobrescrever metodo/nucleo, (c) marcar duplicado, (d) rejeitar (com motivo).
- Aprovar promove `Intake` → cria `Case` (status DRAFT) com `method` e `aiRoutingMetadata` preenchidos. Registra `methodConfirmedById` e `methodConfirmedAt`.
- Tudo logado em `Activity` (auditoria preservada).

**Aceite:** ciclo completo intake → triagem → caso DRAFT funciona end-to-end.

### F1.5 — Carta convite automatizada
**Eixo:** R, V
**Tamanho:** M
**Depende de:** F1.4

- Quando caso vai DRAFT → INVITE_SENT, gera Carta Convite a partir da skill `acordo-drafter` (template do tipo CARTA_CONVITE).
- Envia via Resend (template) para a parte requerida.
- Cria `Document` do tipo `CARTA_CONVITE` versionado.
- Hook de cron diario verifica deadline de 30 dias; gera lembrete na sessao 7 dias antes; marca status `INVITE_EXPIRED` na falta de resposta.
- Em caso de aceite, gera link mais token para a parte requerida confirmar (ja prepara F2.1 — portal das partes).

**Aceite:** carta convite sai automaticamente; deadline e tracked; equipe interna nao precisa redigir caso por caso.

### F1.6 — Tool publico de roteamento (marketing)
**Eixo:** R
**Tamanho:** S
**Depende de:** F1.3

- Versao "lite" do roteamento embutida na home / nova rota `/qual-metodo` sem login.
- Visitante descreve o conflito em um campo livre + 3-4 perguntas guiadas.
- IA devolve recomendacao educacional ("seu caso parece se adequar a [metodo] porque...") + CTA para iniciar via `/iniciar`.
- Beneficios: (a) educa o publico sobre os tres metodos (mercado nao entende a diferenca), (b) gera SEO de cauda longa, (c) captura visitante antes do WhatsApp.

**Aceite:** ferramenta funciona em mobile; output sempre marcado como "orientacao educacional, nao parecer juridico"; LGPD respeitado (sem coletar PII para usar a ferramenta).

### F1.7 — Hardening pre-fase-2 (debt residual)

Nao e feature, mas precisa entrar nesta fase:

- Issue #2 — migrar colunas SQLite-era para tipos Postgres nativos (pre-requisito de queries analiticas em F3).
- Issue #4 — middleware cobrindo todas as rotas `/api/*` exceto auth.
- Issue #5 — vitest + testes de `permissions`, `validations`, `cpf-cnpj-utils` (em paralelo com F1.1 a F1.6).
- Issue #6 — este roadmap ja faz parte do refresh; arquivar phases antigas.

### Criterios de saida da Fase 1

- [ ] Visitante envia relato → IA recomenda metodo+nucleo → conciliador aprova → carta convite sai.
- [ ] Toda saida de IA marcada como rascunho com validacao humana registrada.
- [ ] Tool publico operacional, com tracking de conversao para `/iniciar`.
- [ ] Suite de testes cobrindo logica critica (roteamento + permissoes + validacoes).
- [ ] Politica de privacidade atualizada incluindo uso de IA na triagem.

---

## Fase 2 — Conducao virtual estruturada (3-4 meses depois)

> **Hipotese:** quase ninguem em PE faz mediacao virtual *bem*. Se a PACIFIQUE! consegue conduzir sessao remota com qualidade igual ou superior a presencial, vira referencia regional.

### F2.1 — Portal das partes
**Eixo:** V
**Tamanho:** L
**Depende de:** F1.5

- Novo `UserRole = PARTY` ou modelo `PartyAccount` separado (decidir tradeoff: complexidade de schema vs. clareza do acesso).
- Fluxo de invite via magic link (token assinado, expiracao, single-use).
- Parte ve apenas seus casos, sessoes, documentos. Nada do backoffice.
- LGPD: parte exporta seus dados, pede correcao, revoga consentimento.
- Acesso por celular tem que ser primeira-classe (PWA).

### F2.2 — Coleta pre-mediacao (caucus assistido)
**Eixo:** V, R
**Tamanho:** M
**Depende de:** F2.1

- Antes da sessao conjunta, cada parte recebe formulario individual (no portal) com perguntas-guia: fatos, interesses, BATNA, pontos sensiveis, expectativa de acordo.
- Output vai apenas para o mediador, com sigilo legal preservado (nao compartilhado entre as partes).
- IA organiza em ficha estruturada para o mediador chegar a sessao informado.
- Atende ao que a Amanda chama de "entrevista preliminar / caucus" nas observacoes do PROCON onde queria mais tempo de atendimento e menos audiencia formal.

### F2.3 — Integracao de video
**Eixo:** V
**Tamanho:** M
**Depende de:** F2.1

- Provedor: avaliar Daily.co, Whereby, Twilio Video, Jitsi self-hosted (custo, qualidade no PE, criptografia ponta-a-ponta para mediacao).
- Sala criada por `MediationSession` automaticamente; link para mediador + partes.
- Gravacao: padrao OFF; opt-in explicito de TODAS as partes; gravacao criptografada com retencao definida.
- Sessao individual (`INDIVIDUAL_REQUESTING` / `INDIVIDUAL_REQUESTED`) cria sala separada para cada — sigilo preservado.

### F2.4 — Toolkit do mediador/conciliador
**Eixo:** V
**Tamanho:** L
**Depende de:** F2.3

- Painel lateral durante a sessao com:
  - Linha do tempo da fala (quem falou, por quanto tempo, baseado em ASR).
  - Notas privadas do mediador (criptografia em repouso; retencao definida).
  - Sugestoes de pergunta (IA, em modo "tap to insert" — mediador no comando).
  - Identificacao de pontos de consenso (IA leitura passiva, sugere "as partes parecem concordar em X").
  - Atalhos para clausulas-padrao (sigilo, foro, parcelamento) inseridas em rascunho de termo.
- Mediador sempre dirige. UI deixa claro que IA sugere, nao decide.

### F2.5 — Drafting assistido de Termo de Acordo
**Eixo:** V, R
**Tamanho:** M
**Depende de:** F2.4

- Reaproveitar skill `acordo-drafter` (`.claude/skills/acordo-drafter/SKILL.md`).
- A partir de notas + acordo verbal capturado em sessao, IA gera minuta marcada como `[RASCUNHO — REQUER VALIDACAO HUMANA]`.
- Mediador edita. Partes revisam no portal. Versionamento via `Document.previousVersionId`.
- Acordo final tem forca de titulo executivo extrajudicial (art. 20, Lei 13.140/2015 + art. 784-IV CPC).

### F2.6 — Assinatura digital
**Eixo:** V, B
**Tamanho:** M
**Depende de:** F2.5

- Provedor: Clicksign, D4Sign ou DocuSign (custo + ICP-Brasil + auditoria).
- Aplicavel a Carta Convite, Termo de Acordo, Termo Negativo.
- Trilha de auditoria preservada (hash, timestamp, IP).

### Criterios de saida da Fase 2

- [ ] Mediacao acontece 100% remota com qualidade auditavel.
- [ ] Mediador chega a sessao com ficha pre-mediacao das duas partes.
- [ ] Termo de Acordo passa do verbal ao assinado digitalmente em horas, nao dias.
- [ ] Sigilo legal preservado em todas as camadas (storage, logs, transporte, IA).

---

## Fase 3 — Escala B2B, dados e convenio (longo prazo)

> **Hipotese:** com fluxo automatizado e qualidade comprovada na fase 2, a PACIFIQUE! pode (a) atrair grandes players para mutiroes, (b) virar autoridade de dados consumeristas em PE, (c) executar o convenio TJPE como diferencial selado.

### F3.1 — Mutirao B2B
**Eixo:** B
**Tamanho:** L
**Depende de:** F2.6

- Cliente PJ (banco, cia aerea, plano de saude) ingressa multiplos casos via CSV ou API.
- Casos chegam pre-classificados (consumidor, conhecido, normalmente CONCILIACAO).
- Roteamento simplificado, fluxo otimizado para volume.
- Dashboard agregado para o cliente PJ: taxa de acordo, tempo medio, valores acordados, exportacao.
- Modelo de billing por sucesso (success fee), por volume, ou hibrido.

### F3.2 — Inteligencia consumerista
**Eixo:** D
**Tamanho:** L
**Depende de:** F3.1

- Pipeline de agregacao: por nucleo, por empresa (anonimizacao quando aplicavel), por causa-raiz.
- Metricas-chave: taxa de acordo, tempo medio de resolucao, valor medio acordado, reincidencia.
- Relatorios publicos (anonimizados) — vira ativo de marca.
- Relatorios privados pagos — vira fonte de receita: empresas compram seu proprio cohort, ANS/ANAC/BC podem ter interesse setorial.
- Cuidado: sigilo de mediacao impede agregar conteudo de sessao; limitar a metadata.

### F3.3 — Convenio TJPE
**Eixo:** B
**Tamanho:** M
**Depende de:** F2.6

- Integracao tecnica: PJe API se disponibilizada; senao, pacote de exportacao homologavel por caso.
- Selo "Camara credenciada TJPE" no produto e no marketing.
- Fluxo de homologacao judicial automatica (envio de termo + acompanhamento de status).
- Forca executiva expedita.

### F3.4 — Cobranca e financeiro
**Eixo:** B
**Tamanho:** L
**Depende de:** F3.1

- Honorarios da camara, conciliador/mediador autonomo, repasse aos parceiros.
- Faturamento: NF-e via integrador (NFE.io, Bling, Omie). Atencao a regime fiscal especifico (servicos juridicos / mediacao).
- Planos B2B (assinatura mensal por volume estimado).
- Recibo emitido para a parte.

### F3.5 — Mobile-first das partes
**Eixo:** V, B
**Tamanho:** M-L
**Depende de:** F2.1

- PWA primeira (mais barata, ja entregue por Next na pratica).
- App nativo (React Native) avaliar so com base em volume comprovado pos-F3.1.

### F3.6 — API publica para parceiros
**Eixo:** B
**Tamanho:** M
**Depende de:** F3.1

- Endpoints autenticados (API key) para parceiros (escritorios, ERPs, sistemas judiciais) abrirem casos automaticamente.
- Rate limiting, versionamento, documentacao publica.

---

## Tema transversal — qualidade institucional continua

Independente da fase, manter:

- **Revisao legal automatica** — todo material publicavel passa pelo subagent `legal-reviewer` antes de ir para producao.
- **LGPD checklist por feature** — skill `lgpd-checklist` rodada como gate.
- **Audit log granular** — toda decisao de roteamento, todo consentimento, toda assinatura.
- **Documentacao de marca/voz** — atualizar `CLAUDE.md > Diretrizes de Design` conforme o produto cresce.
- **Acessibilidade WCAG 2.1 AA** — manter como hard requirement, nao como objetivo.
- **Performance Core Web Vitals** — landing publica deve continuar enxuta mesmo com novas features.

---

## O que esta explicitamente fora do escopo

- **Substituicao do mediador por IA** — vedado pela Lei 13.140/2015.
- **Acordo automatizado sem validacao humana** — mesmo em conciliacao, validacao do conciliador e obrigatoria.
- **Atendimento automatizado sem disclaimer** — toda sugestao da IA e marcada como orientacao, nao parecer.
- **Multi-idioma** — apenas PT-BR ate massa critica justificar.
- **Plataforma generica de SaaS juridico** — foco e camara propria, nao white-label.
- **Tabela publica de honorarios** — informacao sensivel, contato direto.

---

## Como esse roadmap se conecta com `.claude/`

- **Skills** (`.claude/skills/`) viram componentes vivos de feature: `method-routing` alimenta F1.3 e F1.6; `acordo-drafter` alimenta F1.5 e F2.5; `legal-citations` alimenta toda copy publica; `lgpd-checklist` e o gate de toda feature; `section-builder` agiliza marketing.
- **Subagents** (`.claude/agents/`) sustentam revisao continua: `case-intake-analyst` ajuda a calibrar F1.3; `legal-reviewer` audita copy e minutas; `code-reviewer` revisa diff antes de merge; `explorer` mapeia areas tocadas por features novas.
- **Hooks** (`.claude/hooks/`) protegem operacao durante o desenvolvimento: bloqueiam destrutivos, lintam pos-edit, surface estado da branch.
- **CLAUDE.md** continua sendo a constituicao — toda mudanca de regra de dominio ou convencao de codigo e documentada la.

---

## Proximos passos imediatos

1. Validar este roadmap com Carlos Henrique, Amanda, Rui e Icaro.
2. Decidir tamanho da fase 1 (todos os 6 itens? sub-fase?).
3. Criar issues GitHub para cada item de F1.x assim que aprovado.
4. Comecar por **F1.1** (modelagem de metodo no `Case`) — desbloqueia tudo o resto.
5. Em paralelo, atacar issues #2, #4 e #5 (hardening pre-fase-2).

---

*Roadmap escrito em 2026-05-03 com base no documento institucional da Amanda Magalhaes Ledo Dutra (uso interno) + estado atual do codigo + skills/subagents do `.claude/`.*
