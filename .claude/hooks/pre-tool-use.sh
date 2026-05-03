#!/usr/bin/env bash
# PreToolUse hook — fires before Bash tool calls.
# Reads tool input as JSON on stdin, exits 2 to BLOCK with reason on stderr.
# Exit 0 to allow.
#
# Reference: https://docs.claude.com/en/docs/claude-code/hooks

set -uo pipefail

input="$(cat)"

# Extract the bash command. Use python for safer JSON parsing if available; fall back to grep.
command=""
if command -v python3 >/dev/null 2>&1; then
  command="$(printf '%s' "$input" | python3 -c 'import sys, json; d=json.load(sys.stdin); print(d.get("tool_input",{}).get("command",""))' 2>/dev/null || echo "")"
fi
if [ -z "$command" ]; then
  command="$(printf '%s' "$input" | grep -oE '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"command"[[:space:]]*:[[:space:]]*"\(.*\)"/\1/')"
fi

block() {
  echo "BLOCKED by PreToolUse hook: $1" >&2
  exit 2
}

# Strip single-quoted and double-quoted argument strings before matching, so
# dangerous patterns inside quoted message bodies (e.g. `git commit -m "..."`)
# do not trigger. Chained commands outside quotes are still checked.
stripped="$command"
if command -v python3 >/dev/null 2>&1; then
  stripped="$(printf '%s' "$command" | python3 -c '
import sys, re
s = sys.stdin.read()
s = re.sub(r"\x27[^\x27]*\x27", "", s)        # single-quoted
s = re.sub(r"\"(?:[^\"\\\\]|\\\\.)*\"", "", s)  # double-quoted
sys.stdout.write(s)
' 2>/dev/null || printf '%s' "$command")"
fi

case "$stripped" in
  *"rm -rf /"*|*"rm -rf /*"*|*"rm -rf ~"*|*"rm -rf \$HOME"*)
    block "Destructive recursive removal targeting root or home." ;;
  *"rm -rf .git"*|*"rm -rf node_modules/.."*)
    block "Refusing to remove .git or escape node_modules." ;;
  *"git push --force"*|*"git push -f "*|*"git push origin --force"*)
    if printf '%s' "$command" | grep -qE 'origin[[:space:]]+(main|master)'; then
      block "Force-push to main/master is forbidden. Use a feature branch."
    fi
    ;;
  *"git reset --hard"*)
    block "git reset --hard is destructive. Confirm with the user via a regular message before running." ;;
  *"prisma migrate reset"*)
    block "prisma migrate reset wipes the database. Refusing without explicit user authorization." ;;
  *"DROP DATABASE"*|*"DROP TABLE"*|*"TRUNCATE TABLE"*)
    block "Destructive SQL detected." ;;
  *"vercel --prod"*|*"pnpm deploy"*)
    block "Production deploy blocked from agent. User must run manually." ;;
  *"pnpm redeploy"*)
    block "pnpm redeploy pushes to main. Blocked from agent." ;;
  *" > .env"*|*" > .env.local"*|*" > .env.production"*)
    block "Refusing to overwrite env files." ;;
esac

exit 0
