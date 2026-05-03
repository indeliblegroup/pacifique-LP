# `.claude/` — Agent Development Kit

Esta pasta concentra a configuracao do **Claude Code** para o repositorio **PACIFIQUE!** organizada em 5 camadas (memoria, conhecimento, guardrails, delegacao, distribuicao).

A constituicao do agente continua em `/CLAUDE.md` na raiz — leia-o antes deste README.

## Estrutura

```
.claude/
|-- README.md                    # este arquivo
|-- settings.json                # configuracao de hooks (Layer 3)
|-- skills/                      # Layer 2 — conhecimento sob demanda
|   |-- method-routing/SKILL.md
|   |-- acordo-drafter/SKILL.md
|   |-- legal-citations/SKILL.md
|   |-- section-builder/SKILL.md
|   `-- lgpd-checklist/SKILL.md
|-- hooks/                       # Layer 3 — scripts referenciados em settings.json
|   |-- session-start.sh
|   |-- pre-tool-use.sh
|   `-- post-tool-use.sh
|-- agents/                      # Layer 4 — subagents
|   |-- case-intake-analyst.md
|   |-- legal-reviewer.md
|   |-- code-reviewer.md
|   `-- explorer.md
`-- plugins/
    `-- manifest.json            # Layer 5 — bundle dos itens acima
```

## As 5 camadas — referencia rapida

| Camada | Onde vive                 | Quando alterar                                                  |
|--------|---------------------------|-----------------------------------------------------------------|
| L1 — Memory       | `/CLAUDE.md`               | Mudou regra, convencao ou conhecimento de dominio.              |
| L2 — Knowledge    | `.claude/skills/<name>/`   | Tarefa repetivel que merece descricao + procedimento.           |
| L3 — Guardrails   | `.claude/settings.json` + `.claude/hooks/` | Comportamento que precisa ser garantido independentemente do prompt. |
| L4 — Delegation   | `.claude/agents/<name>.md` | Trabalho extenso que poluiria o contexto principal.             |
| L5 — Distribution | `.claude/plugins/manifest.json` | Bundle, para distribuir ou versionar como conjunto.        |

## Skills (Layer 2)

Cada skill e uma pasta com `SKILL.md`. O frontmatter (`name`, `description`) e o que o Claude usa para decidir quando invocar.

| Skill              | Quando dispara                                                       |
|--------------------|----------------------------------------------------------------------|
| `method-routing`   | Classificar conflito em conciliacao/mediacao/negociacao.             |
| `acordo-drafter`   | Gerar minuta de Termo de Acordo, Termo Negativo, Carta Convite.      |
| `legal-citations`  | Inserir/validar citacao legal (Lei 13.140, CPC, Res. CNJ, CDC, LGPD).|
| `section-builder`  | Criar nova secao da landing page.                                    |
| `lgpd-checklist`   | Auditar feature que toca dados pessoais ou conteudo de mediacao.     |

## Subagents (Layer 4)

Cada subagent roda em contexto isolado e devolve um unico resultado para a sessao principal.

| Subagent              | Use para                                                          |
|-----------------------|-------------------------------------------------------------------|
| `case-intake-analyst` | Classificar relato de conflito (saida operacional, nao parecer).  |
| `legal-reviewer`      | Auditar copy/documento contra o arcabouco legal.                  |
| `code-reviewer`       | Revisar diff contra convencoes do `CLAUDE.md`.                    |
| `explorer`            | Mapear area desconhecida da base de codigo.                       |

## Hooks (Layer 3)

| Evento         | Script                  | O que faz                                                   |
|----------------|-------------------------|-------------------------------------------------------------|
| `SessionStart` | `session-start.sh`      | Mostra branch, commits recentes, planning state, regras de dominio. |
| `PreToolUse`   | `pre-tool-use.sh`       | Bloqueia comandos destrutivos (rm -rf raiz, force-push em main, `prisma migrate reset`, deploys de prod, sobrescrever `.env*`). |
| `PostToolUse`  | `post-tool-use.sh`      | Roda `eslint` em arquivos editados sob `src/`. Avisa quando `schema.prisma` muda. |

Todos sao **deterministicos** (shell scripts). Nao sao IA.

## Como adicionar uma skill

1. Criar pasta `skills/<nome-kebab>/`.
2. Criar `SKILL.md` com frontmatter:
   ```yaml
   ---
   name: <nome-kebab>
   description: <quando deve ser invocada>
   ---
   ```
3. Documentar o procedimento no corpo.
4. (Opcional) Adicionar `scripts/`, `templates/`, `assets/`.
5. Registrar em `plugins/manifest.json`.

## Como adicionar um subagent

1. Criar `agents/<nome-kebab>.md` com frontmatter:
   ```yaml
   ---
   name: <nome-kebab>
   description: <quando deve ser invocado, em que situacoes>
   tools: Read, Grep, Glob   # restringir conforme necessario
   ---
   ```
2. Definir o output structure no corpo.
3. Registrar em `plugins/manifest.json`.

## Como adicionar um hook

1. Criar script em `hooks/<event>.sh` (chmod +x).
2. Adicionar entrada em `settings.json` apontando para `$CLAUDE_PROJECT_DIR/.claude/hooks/<event>.sh`.
3. Hooks recebem JSON em stdin (tool input para Pre/PostToolUse).
4. **Exit code 2 + stderr** bloqueia (PreToolUse) ou sinaliza erro.

## Convencoes desta pasta

- **Linguagem dos arquivos:** PT-BR no conteudo de dominio (skills, agents); EN aceitavel em comentarios tecnicos.
- **Idempotencia:** hooks devem ser seguros para rodar varias vezes.
- **Sem segredos:** nada nesta pasta deve conter credenciais. Usar `.env` para isso.
- **Sigilo de mediacao:** skills e agents nao devem persistir conteudo de sessao em arquivos versionados — apenas processar in-memory.
