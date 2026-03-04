# PACIFIQUE! — Projeto Web

## Visao Geral

**PACIFIQUE!** e uma Camara Privada de Conciliacao e Mediacao sediada em Recife-PE.
CNPJ: 65.218.388/0001-47

**Missao:** Resolucao pacifica de conflitos com excelencia, seguranca juridica e celeridade.

**Base legal:**
- Resolucao n. 125/2010 do CNJ — Politica Judiciaria Nacional de tratamento adequado dos conflitos
- Resolucao n. 410/2018 do TJPE — Credenciamento e fiscalizacao de camaras privadas em Pernambuco
- Lei n. 13.140/2015 — Lei de Mediacao
- CPC/2015 (Lei n. 13.105/2015), art. 3, par. 2 e 3 — Autocomposicao como principio fundamental

---

## Escopo do Software

Website publico e landing page para apresentacao institucional da PACIFIQUE!, incluindo:

- Hero section com proposta de valor
- Quem Somos (equipe fundadora)
- Fontes Normativas (base legal)
- Nucleos de Atuacao (7 areas tematicas)
- Fluxograma de Atividades (fase inicial + fase procedimental)
- Resultados Possiveis (acordo homologado / termo negativo)
- Vantagens do Credenciamento junto ao TJPE
- Nucleo de Prestacao de Contas
- Tabela de Honorarios
- Informacoes de contato

---

## Stack Tecnica

- **Linguagem:** TypeScript
- **Runtime:** Node.js
- **Framework:** A definir
- **Gerenciador de pacotes:** A definir

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

## Diretrizes de Desenvolvimento

> Secao a ser expandida conforme o projeto evolui.

### Comandos
```bash
# A definir apos setup do projeto
# npm run dev / npm run build / npm run test
```

### Convencoes
- Codigo e commits em ingles
- Conteudo do site (copy) em portugues (pt-BR)
- Componentes reutilizaveis seguindo design system acima
- Mobile-first responsive design

---

## Conformidade

### LGPD (Lei n. 13.709/2018)
- Qualquer funcionalidade que colete ou processe dados pessoais **deve** estar em conformidade com a LGPD
- Consentimento explicito para coleta de dados
- Politica de privacidade acessivel em todas as paginas
- Dados coletados devem ter finalidade especifica e declarada
- Prever mecanismo para exercicio dos direitos dos titulares (acesso, correcao, exclusao)

### Acessibilidade
- Seguir WCAG 2.1 nivel AA como meta minima
- Textos com contraste adequado sobre todos os backgrounds da paleta

---

## Diretrizes de UX/UI

### Principios Gerais
- **Mobile-first:** Projetar para telas pequenas primeiro, expandir para desktop
- **Clareza > Decoracao:** Cada elemento visual deve servir a um proposito funcional
- **Confianca institucional:** O design deve transmitir credibilidade juridica e seriedade sem ser intimidador
- **Acessibilidade nativa:** Semantica HTML correta (headings hierarquicos, landmarks, alt text, focus management)

### Layout
- **Max-width do conteudo:** ~1200px centralizado
- **Secoes em blocos cheios:** Alternancia de fundo branco (`bg-white`) e lavanda (`bg-lavender`) para separacao visual
- **Grid:** 1 coluna em mobile, 2-4 colunas em desktop para cards e equipe
- **Espacamento vertical generoso:** Minimo 64px entre secoes principais

### Interacao
- **Botoes:** Outlined por padrao, hover com preenchimento suave na cor primary
- **Links:** Cor primary com underline no hover
- **Transicoes:** Suaves (200-300ms ease), sem animacoes excessivas
- **Scroll:** Suave entre secoes (smooth scroll para ancoras internas)
- **Estados:** Todos os elementos interativos devem ter estilos visiveis para hover, focus e active

### Responsividade
- **Breakpoints sugeridos:**
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Navegacao:** Hamburger menu em mobile, nav horizontal em desktop
- **Tabelas (honorarios):** Converter para cards empilhados em mobile
- **Imagens/ilustracoes:** Escalar proporcionalmente, nunca distorcer

### Hierarquia de Informacao
- **Hero:** Proposta de valor em ate 2 linhas + CTAs principais (Conciliacao / Mediacao / Praticas Restaurativas)
- **Nucleos:** Cards escaneeaveis — usuario deve entender cada nucleo em 3 segundos
- **Fluxograma:** Leitura linear da esquerda para direita (desktop) ou de cima para baixo (mobile)
- **Honorarios:** Tabela clara com valores destacados, observacoes em texto menor abaixo
- **Contato:** Sempre acessivel (footer fixo ou CTA flutuante)

### Performance
- **Core Web Vitals como meta:**
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
- **Imagens:** Formatos modernos (WebP/AVIF), lazy loading para abaixo do fold
- **Fontes:** Preload das fontes principais, font-display: swap
