# PACIFIQUE! - Página Institucional

## What This Is

Landing page institucional da PACIFIQUE!, Câmara Privada de Conciliação e Mediação sediada em Recife/PE. Página isolada (single page) greenfield, destinada a consumidores e empresas, com visual profissional/clean para divulgação dos serviços e captação de leads. WhatsApp como CTA principal, formulário de contato como CTA secundário.

## Core Value

Comunicar credibilidade institucional da PACIFIQUE! (credenciada pelo CNJ e TJPE) e converter visitantes em leads via WhatsApp ou formulário de contato.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Hero section com identidade visual PACIFIQUE! (ilustrações estilo coconut/praia, tipografia profissional, tom roxo/malva)
- [ ] Seção "O que fazemos" — Conciliação, Mediação, Práticas Restaurativas
- [ ] Seção "Núcleos de Atuação" — 7 áreas temáticas com ícones e descrições (Consumidor Aéreo, Consumidor Bancário, Direito de Saúde, Direito de Família, Direito de Sucessões, Práticas Restaurativas, Demandas Empresariais Estratégicas)
- [ ] Seção "Quem Somos" — equipe fundadora (Carlos Henrique, Amanda Lêdo, Rui Manuel, Ícaro Sampaio) com cargos e bio
- [ ] Seção "Fontes Normativas" — Resolução 125/2010 CNJ, Resolução 410/2018 TJPE, Lei de Mediação
- [ ] Seção "Vantagens do Credenciamento" — Encaminhamento Judicial Direto, Credibilidade Institucional, Celeridade, Força Executiva dos Acordos
- [ ] Seção "Como Funciona" — Fluxograma simplificado (Fase Inicial → Fase Procedimental → Resultados)
- [ ] Seção "Benefícios" — diferenciais para consumidores e empresas
- [ ] Botão flutuante de WhatsApp como CTA principal (visível em todas as seções)
- [ ] Formulário de lead capture (nome, email, telefone, tipo de interesse, mensagem) — salva no banco + envia email
- [ ] Endpoint backend para persistir leads no banco e enviar notificação por email
- [ ] Footer com dados da Câmara, localização (Recife/PE), contatos, tagline "Não complique, PACIFIQUE!"
- [ ] Design responsivo (mobile-first)
- [ ] Página em português (PT-BR)

### Out of Scope

- Multi-idioma (inglês/outros) — apenas PT-BR por enquanto
- Tabela de honorários na landing page — informação sensível, compartilhar apenas em contato direto
- Área de login/cadastro — não é objetivo da landing page
- Depoimentos/cases de sucesso — não há conteúdo validado ainda
- Blog ou área de conteúdo — complexidade desnecessária para v1
- Integração com plataforma de gestão de casos (pacifica) — projeto independente

## Context

**O que é a PACIFIQUE!:**
Câmara Privada de Conciliação e Mediação, credenciada nos termos da Resolução nº 125/2010 do CNJ e da Resolução nº 410/2018 do TJPE. Oferece resolução pacífica de conflitos com excelência, segurança jurídica e celeridade.

**Serviços:** Conciliação, Mediação, Práticas Restaurativas

**7 Núcleos de Atuação:**
1. Consumidor Aéreo — cancelamentos, atrasos, extravio de bagagem, overbooking
2. Consumidor Bancário — renegociação de dívidas, cobranças indevidas, tarifas abusivas
3. Direito de Saúde — negativas de cobertura, reembolsos médicos
4. Direito de Família — divórcios consensuais, guarda compartilhada, alimentos
5. Direito de Sucessões — inventários extrajudiciais, partilha de bens
6. Práticas Restaurativas — conflitos penais transigíveis, comunitários, escolares
7. Demandas Empresariais Estratégicas — conflitos societários, inadimplementos contratuais

**Equipe fundadora:**
- Carlos Henrique Borges de Melo — Advogado | Diretor Presidente | (81) 98790-0892 | carlosh@bmadvocacia.com.br
- Amanda Lêdo — Advogada | Conciliadora Responsável | (81) 99626-9229 | amandal@bmadvocacia.com.br
- Rui Manuel Costa — Diretor de Operações
- Ícaro Sampaio — Diretor de Tecnologia

**Processo conciliatório:**
- Fase Inicial: adesão a 3 documentos (Termos e Condições, Política de Privacidade, Regulamento da Câmara)
- Fase Procedimental: Carta Convite → Entrevistas Preliminares (caucus) → Instalação da Sessão
- Resultados: Acordo Homologado (título executivo extrajudicial) ou Termo Negativo de Conciliação

**Vantagens do credenciamento TJPE:**
- Encaminhamento judicial direto de processos
- Credibilidade institucional (reconhecimento do Poder Judiciário)
- Celeridade e desafogamento do Judiciário
- Força executiva dos acordos (Lei 13.140/2015, art. 20)

**Identidade visual existente:** Tom roxo/malva predominante, ilustrações estilo line art (coqueiros/praia/cocos), tipografia profissional. Tagline: "Não complique, PACIFIQUE!"

**Localização:** Recife, Pernambuco, Brasil

## Constraints

- **Greenfield**: Projeto novo do zero — sem dependência de codebase existente
- **Responsividade**: Mobile-first — WhatsApp é o CTA principal, maioria do tráfego será mobile
- **LGPD**: Formulário deve informar sobre coleta de dados conforme Lei 13.709/2018
- **Performance**: Landing page deve carregar rápido — otimizar para SEO e Core Web Vitals

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Projeto greenfield separado | Landing page não compartilha código com a plataforma de gestão de casos | — Pending |
| WhatsApp como CTA principal | Público-alvo brasileiro prefere WhatsApp; conversão direta mais efetiva | — Pending |
| Não incluir tabela de honorários | Informação sensível — melhor compartilhar em contato direto | — Pending |
| Página isolada (single page) | SEO otimizado, carregamento rápido, experiência linear para conversão | — Pending |

---
*Last updated: 2026-03-04 after initialization*
