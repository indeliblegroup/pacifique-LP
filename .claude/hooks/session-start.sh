#!/usr/bin/env bash
# SessionStart hook — runs once at the start of a Claude Code session.
# Purpose: surface relevant project state so the agent picks up cold.
# Output goes to stdout and is injected as context.

set -euo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}"

echo "=== PACIFIQUE! Session Start ==="
echo

if git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Branch: $(git branch --show-current 2>/dev/null || echo 'detached')"
  echo
  echo "Recent commits:"
  git log --oneline -5 2>/dev/null || echo "  (no history)"
  echo
  if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
    echo "Uncommitted changes:"
    git status --short 2>/dev/null | head -20
  else
    echo "Working tree clean."
  fi
  echo
fi

if [ -f ".planning/STATE.md" ]; then
  echo "Planning state (.planning/STATE.md, first 20 lines):"
  head -20 .planning/STATE.md
  echo
fi

echo "Reminder — domain rules (see CLAUDE.md > Dominio):"
echo "  - Mediacao requires HUMAN conduction (Lei 13.140/2015)."
echo "  - AI-generated minutes are RASCUNHO until validated by mediador/conciliador."
echo "  - Confidentiality in mediacao is a LEGAL principle, not a best practice."
echo "  - Conciliador may suggest solutions; mediador only facilitates."
echo
echo "================================"
