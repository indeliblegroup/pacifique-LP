# Requirements: PACIFIQUE! Institucional

**Defined:** 2026-03-04
**Core Value:** Comunicar credibilidade institucional da PACIFIQUE! e converter visitantes em leads via WhatsApp ou formulário de contato

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Hero & Navegacao

- [x] **HERO-01**: Visitante ve hero section com identidade visual PACIFIQUE! (ilustracoes sketch, tom roxo/malva, tagline "Nao complique, PACIFIQUE!") e credenciais CNJ/TJPE acima do fold
- [x] **HERO-02**: Visitante navega entre secoes via menu sticky com smooth scroll
- [x] **HERO-03**: Visitante em mobile acessa navegacao via hamburger menu
- [ ] **HERO-04**: Pagina carrega em menos de 2.5s (LCP) com CLS < 0.1

### Conteudo Institucional

- [x] **INST-01**: Visitante entende o que a PACIFIQUE! faz atraves de secao "O que fazemos" (Conciliacao, Mediacao, Praticas Restaurativas)
- [x] **INST-02**: Visitante identifica sua area de interesse nos 7 Nucleos de Atuacao com icones e descricoes escaneaaveis
- [x] **INST-03**: Visitante conhece a equipe fundadora (4 membros) com nome, cargo e bio na secao "Quem Somos"
- [x] **INST-04**: Visitante ve as fontes normativas (Resolucao 125/2010 CNJ, Resolucao 410/2018 TJPE, Lei de Mediacao) em cards de destaque
- [x] **INST-05**: Visitante entende as vantagens do credenciamento TJPE (Encaminhamento Judicial Direto, Credibilidade, Celeridade, Forca Executiva)
- [x] **INST-06**: Visitante entende o processo atraves de fluxograma simplificado (Fase Inicial → Fase Procedimental → Resultados)
- [x] **INST-07**: Visitante compara mediacao vs litigio tradicional em secao lado a lado (velocidade, custo, resultado, validade juridica)
- [x] **INST-08**: Visitante ve badges/selos visuais de credenciamento CNJ e TJPE como elementos de confianca
- [ ] **INST-09**: Visitante encontra respostas para duvidas frequentes em secao FAQ com accordion (5-8 perguntas)
- [ ] **INST-10**: Footer exibe dados institucionais (CNPJ, endereco Recife/PE, contatos, tagline)

### Conversao

- [x] **CONV-01**: Visitante ve botao flutuante de WhatsApp visivel em todas as secoes com mensagem pre-preenchida
- [ ] **CONV-02**: Visitante preenche formulario de contato com nome, email, telefone, area de interesse (dropdown 7 nucleos) e mensagem
- [ ] **CONV-03**: Formulario valida campos obrigatorios e exibe feedback de erro claro proximo ao campo

### Backend & Integracao

- [ ] **BACK-01**: Lead submetido via formulario e persistido no banco de dados com timestamp
- [ ] **BACK-02**: Equipe recebe email de notificacao com dados do lead quando formulario e submetido
- [ ] **BACK-03**: API valida dados no servidor (sanitizacao, campos obrigatorios) e retorna erro 400 para dados invalidos
- [ ] **BACK-04**: Formulario inclui protecao anti-spam (honeypot field)

### Compliance & Acessibilidade

- [ ] **COMP-01**: Formulario inclui checkbox de consentimento LGPD com link para Politica de Privacidade
- [ ] **COMP-02**: Pagina de Politica de Privacidade acessivel via link no footer e no formulario
- [x] **COMP-03**: Site servido via HTTPS
- [ ] **COMP-04**: Pagina implementa Schema.org structured data (JSON-LD) com LegalService + Organization + LocalBusiness
- [ ] **COMP-05**: Pagina atinge WCAG 2.1 nivel AA (contraste 4.5:1, hierarquia de headings, alt text, focus-visible, skip-to-content, ARIA labels)
- [ ] **COMP-06**: SEO metadata completo (title, meta description, Open Graph, canonical URL)

### Responsividade

- [x] **RESP-01**: Layout responsivo mobile-first com breakpoints em 640px, 1024px
- [x] **RESP-02**: Cards de nucleos empilham verticalmente em mobile, grid 2-4 colunas em desktop
- [x] **RESP-03**: Fluxograma exibe vertical em mobile, horizontal em desktop
- [x] **RESP-04**: Sem scroll horizontal em nenhuma resolucao (375px a 1440px)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Conversao Avancada

- **CONV-04**: WhatsApp contextual por nucleo com mensagem pre-preenchida especifica
- **CONV-05**: Roteamento de notificacao por email para membro da equipe correto baseado na area de interesse

### Conteudo

- **INST-11**: Secao de depoimentos/cases de sucesso quando conteudo validado estiver disponivel
- **INST-12**: Blog ou area de conteudo para SEO de longo prazo

### Funcionalidades

- **FUNC-01**: Admin dashboard para visualizacao e gestao de leads
- **FUNC-02**: Export de leads para CSV/planilha
- **FUNC-03**: Multi-idioma (PT-BR + EN)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Tabela de honorarios na landing page | Informacao sensivel, valores variam por caso, compartilhar em contato direto |
| Login / cadastro de usuarios | Landing page e top-of-funnel, sem necessidade de autenticacao |
| Agendamento online | Mediacao tem complexidade de agendamento (multiplas partes), WhatsApp coordena melhor |
| Live chat (Intercom/Tawk.to) | Requer equipe 24/7 ou chatbot, WhatsApp ja cumpre esse papel |
| Integracao com pagamento | Honorarios negociados por caso, sem precificacao padronizada |
| Video backgrounds / auto-play | Mata performance mobile, incompativel com estilo sketch da marca |
| Parallax pesado | Performance killer em mobile, problemas de acessibilidade |
| Cookie consent wall | LGPD nao exige para tracking minimo, notice simples no formulario suficiente |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| HERO-01 | Phase 1 | Complete |
| HERO-02 | Phase 1 | Complete |
| HERO-03 | Phase 1 | Complete |
| HERO-04 | Phase 3 | Pending |
| INST-01 | Phase 1 | Complete |
| INST-02 | Phase 1 | Complete |
| INST-03 | Phase 1 | Complete |
| INST-04 | Phase 1 | Complete |
| INST-05 | Phase 1 | Complete |
| INST-06 | Phase 1 | Complete |
| INST-07 | Phase 1 | Complete |
| INST-08 | Phase 1 | Complete |
| INST-09 | Phase 1 | Pending |
| INST-10 | Phase 1 | Pending |
| CONV-01 | Phase 1 | Complete |
| CONV-02 | Phase 2 | Pending |
| CONV-03 | Phase 2 | Pending |
| BACK-01 | Phase 2 | Pending |
| BACK-02 | Phase 2 | Pending |
| BACK-03 | Phase 2 | Pending |
| BACK-04 | Phase 2 | Pending |
| COMP-01 | Phase 2 | Pending |
| COMP-02 | Phase 2 | Pending |
| COMP-03 | Phase 1 | Complete |
| COMP-04 | Phase 3 | Pending |
| COMP-05 | Phase 3 | Pending |
| COMP-06 | Phase 3 | Pending |
| RESP-01 | Phase 1 | Complete |
| RESP-02 | Phase 1 | Complete |
| RESP-03 | Phase 1 | Complete |
| RESP-04 | Phase 1 | Complete |

**Coverage:**
- v1 requirements: 31 total
- Mapped to phases: 31
- Unmapped: 0

---
*Requirements defined: 2026-03-04*
*Last updated: 2026-03-04 after roadmap creation*
