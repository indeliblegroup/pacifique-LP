#!/usr/bin/env bash
# PostToolUse hook — fires after Edit/Write/MultiEdit tool calls.
# Reads tool input as JSON on stdin. Auto-runs `pnpm lint` on the edited file
# only if the edit touched src/ or prisma/ and the linter is configured.
# Stays quiet on success; logs warnings/errors to stderr (visible in transcript).

set -uo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}"

input="$(cat)"

file_path=""
if command -v python3 >/dev/null 2>&1; then
  file_path="$(printf '%s' "$input" | python3 -c 'import sys, json; d=json.load(sys.stdin); print(d.get("tool_input",{}).get("file_path",""))' 2>/dev/null || echo "")"
fi
if [ -z "$file_path" ]; then
  file_path="$(printf '%s' "$input" | grep -oE '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"\(.*\)"/\1/')"
fi

# Only lint files inside this repo, under src/, and with TS/TSX/JS/JSX extension.
case "$file_path" in
  *"/src/"*.ts|*"/src/"*.tsx|*"/src/"*.js|*"/src/"*.jsx)
    rel="${file_path#$PWD/}"
    if [ -f "package.json" ] && command -v pnpm >/dev/null 2>&1; then
      output="$(pnpm -s exec eslint "$rel" --max-warnings=0 2>&1)" || {
        echo "[PostToolUse] eslint reported issues in $rel:" >&2
        echo "$output" >&2
      }
    fi
    ;;
esac

# Remind about Prisma client regeneration when schema changes.
case "$file_path" in
  *"prisma/schema.prisma")
    echo "[PostToolUse] Reminder: schema.prisma changed. Run 'pnpm prisma generate' (and 'pnpm prisma migrate dev' if creating a migration)." >&2
    ;;
esac

exit 0
