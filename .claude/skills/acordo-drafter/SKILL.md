---
name: acordo-drafter
description: Gera minutas de Termo de Acordo, Termo Negativo e Carta Convite respeitando o regime legal aplicavel (Lei 13.140/2015 para mediacao, CPC para conciliacao). Use quando solicitarem "redigir acordo", "minuta de termo", "carta convite", ou para ajudar a preparar documentos a partir de notas de sessao. SEMPRE marca a minuta como rascunho que requer validacao humana antes de homologacao.
---

# Acordo Drafter — Geracao de Minutas

## Quando usar esta skill

- Redigir minuta de **Termo de Acordo** apos sessao bem-sucedida.
- Redigir **Termo Negativo** quando nao houver acordo.
- Redigir **Carta Convite** para parte requerida.
- Resumir notas de sessao em estrutura formal.

## Regra de ouro

> **Toda minuta gerada por IA e RASCUNHO. Validacao humana (mediador, conciliador ou advogado responsavel) e obrigatoria antes de qualquer formalizacao, envio ou homologacao.**

Marcar explicitamente no documento:
```
[RASCUNHO — REQUER VALIDACAO HUMANA ANTES DE FORMALIZACAO]
```

## Estrutura: Termo de Acordo

```
TERMO DE ACORDO

Numero do caso: <case.caseNumber>
Data: <DD/MM/AAAA>
Local: <fisico ou plataforma virtual>
Nucleo: <CaseNucleus>
Metodo: <Conciliacao | Mediacao | Negociacao>

QUALIFICACAO DAS PARTES
Requerente: <nome, CPF/CNPJ, endereco>
Requerida: <nome, CPF/CNPJ, endereco>
Advogados (se houver): <nome, OAB>

CONDUTOR DO PROCEDIMENTO
<Nome>, <papel: Mediador | Conciliador>, registrado na PACIFIQUE!.

OBJETO
<Descricao sucinta do conflito, sem violar sigilo se aplicavel.>

CLAUSULAS
1. <obrigacao da parte X>
2. <obrigacao da parte Y>
3. <prazos>
4. <formas de pagamento, se aplicavel>
5. Confidencialidade: <regime aplicavel — legal (mediacao) | convencional (negociacao) | recomendada (conciliacao)>
6. Foro de eleicao: <Comarca>

EFICACIA
Este Termo de Acordo, apos assinatura das partes e homologacao judicial (quando aplicavel), constitui titulo executivo extrajudicial nos termos do art. 20 da Lei 13.140/2015 e do art. 784, IV, do CPC/2015.

Assinaturas:
__________________________  Requerente
__________________________  Requerida
__________________________  Condutor
__________________________  Advogado(s)
```

## Estrutura: Termo Negativo

```
TERMO NEGATIVO DE AUTOCOMPOSICAO

Numero do caso: <case.caseNumber>
Data: <DD/MM/AAAA>
Metodo tentado: <Conciliacao | Mediacao | Negociacao>

PARTES
Requerente: <qualificacao>
Requerida: <qualificacao>

REGISTRO
Realizadas as sessoes nos termos do procedimento da PACIFIQUE!, nao foi possivel obter composicao consensual entre as partes.

Esta certidao serve como comprovacao da tentativa de autocomposicao, nos termos do art. 334 do CPC/2015 e do art. 27 da Lei 13.140/2015.

<Nome do condutor>, <papel>
PACIFIQUE! — Camara Privada de Conciliacao e Mediacao
```

## Estrutura: Carta Convite

```
CARTA CONVITE — PROCEDIMENTO DE [MEDIACAO | CONCILIACAO]

Recife, <DD/MM/AAAA>

A <Nome da parte requerida>
Endereco: <...>

Prezado(a) <...>,

A PACIFIQUE! — Camara Privada de Conciliacao e Mediacao foi procurada por <Nome da parte requerente>, que apresentou demanda relativa a <descricao sucinta>.

Nos termos do procedimento adotado por esta Camara e respeitada a Lei n. 13.140/2015 e o CPC/2015, V. Sa. e cordialmente convidada a manifestar interesse em participar de procedimento de <metodo>, no prazo de **30 (trinta) dias** contados do recebimento desta.

A participacao e voluntaria. O procedimento sera <presencial | virtual>, conduzido por profissional registrado nesta Camara, com observancia dos principios de imparcialidade, isonomia, autonomia da vontade e <confidencialidade legal | sigilo convencional>.

Para resposta ou esclarecimentos: <contato>.

Atenciosamente,

<Nome>
<Papel>
PACIFIQUE!
```

## Diretrizes especificas por metodo

### Mediacao (Lei 13.140/2015)
- **Confidencialidade obrigatoria** — incluir clausula expressa.
- **Mediador nao sugere conteudo do acordo** — clausulas refletem o que as partes construiram.
- Se uma das partes nao tem advogado, registrar que foi informada do direito e optou por prosseguir.

### Conciliacao
- Conciliador pode ter sugerido solucoes — registrar que as propostas foram aceitas pelas partes.
- Confidencialidade nao e legal; pode ser incluida como clausula recomendada.

### Negociacao
- Sigilo apenas se contratualmente convencionado — incluir clausula explicita se desejado.
- Pode envolver renuncia, quitacao, parcelamento — redigir termos com clareza juridica.

## Formato de output

Sempre devolver:
1. A minuta com marcacao `[RASCUNHO — REQUER VALIDACAO HUMANA]`.
2. Lista de **lacunas** (campos a preencher) e **pontos de validacao** (clausulas que merecem revisao especifica).
3. Citacao da base legal aplicada.

## Limites

- Nao formaliza, nao envia, nao assina.
- Nao substitui o conciliador/mediador/advogado.
- Nao decide questoes de merito juridico nao previamente acordadas pelas partes.
