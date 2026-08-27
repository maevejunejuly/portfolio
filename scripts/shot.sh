#!/bin/bash
# Screenshot a dev-server route with headless Chrome.
#   scripts/shot.sh <path> <out.png> [width] [height]
# The Playwright MCP screenshot tool times out on these pages (its 5s budget, not
# the page — the pages are provably idle), so verification goes through Chrome directly.
set -e
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PATH_="${1:-/}"
OUT="${2:-shot.png}"
W="${3:-1440}"
H="${4:-1000}"
PORT="${PORT:-3000}"
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size="$W,$H" \
  --virtual-time-budget=6000 --screenshot="$OUT" \
  "http://localhost:$PORT$PATH_" >/dev/null 2>&1
echo "$OUT ($(du -h "$OUT" | cut -f1))"
