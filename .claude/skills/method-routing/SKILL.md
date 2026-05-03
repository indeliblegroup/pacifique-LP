---
name: method-routing
description: Avalia um relato de conflito e recomenda o metodo adequado de resolucao (conciliacao, mediacao ou negociacao) com justificativa juridica e operacional. Use quando o usuario descrever um caso, perguntar "qual metodo usar", classificar uma demanda nova, ou quando estiver projetando uma feature que precisa rotear casos automaticamente. Cobre os 7 nucleos da PACIFIQUE! e respeita o regime legal de cada metodo (Lei 13.140/2015, CPC arts. 3, 165, 334, Res. CNJ 125/2010).
---

# Method Routing — Roteamento de Conflitos

## Quando usar esta skill

Acione quando precisar:
- Classificar um relato/caso novo em conciliacao | mediacao | negociacao.
- Justificar a escolha com base legal e operacional.
- Identificar quando um caso esta no metodo errado (mismatch).
- Projetar logica de roteamento automatico (intake da plataforma).

## Heuristica de roteamento (em ordem)

Avaliar nesta sequencia. Para cada criterio, se **sim**, retornar a recomendacao correspondente.

1. **Existe relacao continuada entre as partes que precisa ser preservada?**
   - Familia, irmaos em sucessao com gestao patrimonial conjunta, casais, vizinhanca, societario com socios mantendo o vinculo, vinculo trabalhista continuado.
   - → **MEDIACAO**.

2. **Sigilo legal e requisito central da escolha?**
   - Empresa de capital aberto, conflito societario que nao pode vazar, materia sensivel cuja exposicao e o problema.
   - → **MEDIACAO** (so a mediacao tem sigilo legal por forca da Lei 13.140/2015, arts. 2-VII, 30 e 31).

3. **Conflito envolve grande player economico, sem relacao continuada, com margem para composicao estrategica (indenizatorio, contratual, debito)?**
   - Indenizacoes B2B, parcelamentos CNPJ, bancarios entre PJs, disputas contratuais empresariais sem componente relacional.
   - → **NEGOCIACAO** (maior liberdade procedimental, sem regime fechado da Lei de Mediacao; sigilo apenas se contratualmente convencionado).

4. **Conflito e objetivo, transacional, com solucao quantificavel (valor, prazo, forma de pagamento) e sem componente relacional forte?**
   - Cia aerea (cancelamento, atraso, extravio, overbooking), divida bancaria entre PF, consumo geral, saude (negativa de cobertura).
   - → **CONCILIACAO** (conciliador pode propor solucoes ativamente; alta escala; ideal para apoio de IA com validacao do conciliador).

5. **Caso nao se encaixa em nenhum dos anteriores?**
   - Coletar mais informacao antes de classificar. Em duvida razoavel entre conciliacao e mediacao, perguntar: "ha relacao a preservar?" — se sim, mediacao; se nao, conciliacao.

## Mapeamento por nucleo (referencia)

| Nucleo                             | Metodo padrao   | Excecoes                                                |
|------------------------------------|-----------------|---------------------------------------------------------|
| Consumidor Aereo                   | Conciliacao     | Raras                                                   |
| Consumidor Bancario                | Conciliacao     | Negociacao se for grande PJ ou mutirao B2B              |
| Direito de Saude                   | Conciliacao     | Mediacao se houver componente familiar relevante        |
| Direito de Familia                 | Mediacao        | Conciliacao se for so divisao de bens objetiva sem relacao continuada |
| Direito de Sucessoes               | Mediacao        | Conciliacao se inventario sem gestao continuada apos partilha |
| Praticas Restaurativas             | Mediacao        | Quase sempre relacional/comunitaria                     |
| Demandas Empresariais Estrategicas | Negociacao      | Mediacao se houver socios mantendo vinculo + sigilo     |

## Erros frequentes (mismatch)

- **Familia em conciliacao** — perde profundidade necessaria para construir solucao relacional.
- **Cia aerea em mediacao** — adiciona formalidade desnecessaria, desestimula acordo objetivo.
- **Conflito societario sem sigilo formal** — perda de protecao crucial; sempre mediacao se houver materia sensivel.
- **Indenizacao B2B em mediacao** — engessamento procedural; negociacao e mais agil.

## Formato de saida recomendado

Quando classificar um caso, retornar estrutura abaixo:

```
Metodo recomendado: [CONCILIACAO | MEDIACAO | NEGOCIACAO]
Nucleo aplicavel: [um dos 7]

Justificativa:
- Criterio decisivo: [qual da heuristica disparou]
- Aspectos relacionais: [sim/nao + breve razao]
- Necessidade de sigilo: [legal | contratual | nao critico]
- Perfil do conflito: [objetivo | relacional | economico-estrategico]

Base legal:
- [citacoes especificas: Lei 13.140 art. X / CPC art. Y / Res. 125/2010]

Alertas operacionais:
- Impedimentos profissionais: [aplicavel? amizade? relacao atual?]
- Validacao humana: [quando o conciliador/mediador/advogado precisa validar]
- Espaco para apoio de IA: [pre-procedimento | sugestoes | minutas | nenhum]
```

## Limites — o que esta skill NAO faz

- Nao substitui parecer juridico; entrega recomendacao operacional para roteamento.
- Nao decide acordo; apenas direciona o caso ao metodo adequado.
- Nao avalia merito do conflito; apenas perfil procedimental.
