---
name: lgpd-checklist
description: Auditoria LGPD para qualquer feature que colete, armazene, processe ou transmita dados pessoais. Use quando criar formularios, fluxos de cadastro, upload de documentos, envio de email transacional, integracoes externas, ou quando solicitarem "revisao LGPD". Aplica-se especialmente a cadastros de partes (CPF, endereco), documentos sensiveis (caso, sessao), e comunicacoes transacionais via Resend.
---

# LGPD Checklist — Lei 13.709/2018

## Quando usar

Acione esta skill antes de:
- Adicionar campo a formulario de cadastro/edicao.
- Criar fluxo de upload de documentos.
- Configurar nova integracao externa (envio de email, storage, analytics).
- Criar API route que retorna dados pessoais.
- Modificar middleware ou autorizacao.

## Categorias de dados sensiveis no projeto

| Categoria              | Onde aparece                                                |
|------------------------|-------------------------------------------------------------|
| Identificacao          | `User.name`, `User.email`, `Party.name`, `Party.cpf`        |
| Contato                | `Party.phone`, `Party.email`, `User.phone`                  |
| Localizacao            | `Party.address`                                             |
| Conteudo do conflito   | `Case.description`, `MediationSession.notes`, `Activity.metadata`, `Document.*` |
| Comunicacao            | `Email.bodyHtml`, `Email.bodyText` (Resend)                 |
| Autenticacao           | `User.passwordHash` (bcrypt), `Session.sessionToken`        |

**Conteudo do conflito** merece atencao especial: se metodo for **mediacao**, esta sob sigilo legal (Lei 13.140/2015 arts. 30-31), nao apenas LGPD.

## Checklist por feature

### Coleta de dados (formularios)

- [ ] Campo realmente necessario para a finalidade declarada? (principio da finalidade + minimizacao, art. 6 LGPD)
- [ ] Texto explicito de consentimento ou base legal apresentada ao usuario?
- [ ] Politica de privacidade vinculada/acessivel?
- [ ] CPF/CNPJ validados e formatados via `src/lib/cpf-cnpj-utils.ts`?
- [ ] Validacao Zod em `src/lib/validations.ts`?

### Armazenamento

- [ ] Senhas com `bcryptjs` (nunca em plain text)?
- [ ] Documentos via Vercel Blob com URL nao-publica + verificacao de autorizacao na rota de download?
- [ ] Indices Prisma adequados (sem expor dados desnecessarios em queries)?

### API routes

- [ ] Autenticacao via `auth()` do NextAuth no inicio do handler?
- [ ] Autorizacao via helpers de `src/lib/permissions.ts`?
- [ ] Resposta nao vaza campos sensiveis (ex: `passwordHash`, `sessionToken`)?
- [ ] Logs nao gravam dados pessoais alem do necessario?

### Comunicacao (email via Resend)

- [ ] Template revisado por humano antes de envio em massa?
- [ ] Conteudo do conflito (mediacao) **nunca** em texto claro fora do sistema?
- [ ] Endereco de remetente verificado e responsavel identificado?

### Integracoes externas

- [ ] Provedor lista LGPD-conforme? (Resend, Vercel, PostgreSQL)
- [ ] Dados enviados sao os minimos necessarios?
- [ ] Operador (DPA) formalizado se aplicavel?

### Direitos do titular (art. 18 LGPD)

A plataforma deve permitir:
- [ ] **Acesso** — usuario consegue ver os dados que tem sobre ele?
- [ ] **Correcao** — pode editar/atualizar?
- [ ] **Eliminacao** — pode pedir exclusao? (atencao: dados de processo podem ter retencao legal)
- [ ] **Portabilidade** — exportacao em formato estruturado?
- [ ] **Revogacao de consentimento** — quando aplicavel?

## Sigilo de mediacao (sobreposto a LGPD)

Para casos onde `Case.method == 'MEDIACAO'`:
- Conteudo de sessoes (`MediationSession.notes`) tem **sigilo legal absoluto** (art. 30 Lei 13.140/2015).
- Acesso restrito ao mediador, partes e advogados constituidos.
- Logs de auditoria (`Activity`) nao devem expor conteudo da sessao — apenas evento (ex: "sessao realizada"), nao "o que foi dito".

## Output esperado

Ao auditar uma feature, retornar:

```
Feature: <descricao>
Dados coletados/processados: <lista>
Base legal LGPD: <consentimento | execucao de contrato | exercicio regular de direito | ...>
Riscos identificados:
- <risco 1>
Acoes obrigatorias:
- [ ] <acao 1>
- [ ] <acao 2>
Sigilo de mediacao aplicavel? <sim/nao>
```
