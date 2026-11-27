#!/usr/bin/env bash
# Manual deploy of dist/ to Netlify via the API (used for the evaluation site).
# Requires: NETLIFY_AUTH_TOKEN (personal access token) and NETLIFY_SITE_ID.
# Usage: SITE_URL=https://<site>.netlify.app npm run build && scripts/deploy-netlify.sh
set -euo pipefail
: "${NETLIFY_SITE_ID:?set NETLIFY_SITE_ID}"
AUTH=()
[ -n "${NETLIFY_AUTH_TOKEN:-}" ] && AUTH=(-H "Authorization: Bearer ${NETLIFY_AUTH_TOKEN}")
ZIP="$(mktemp -d)/deploy.zip"
(cd dist && zip -qr "$ZIP" .)
RESP=$(curl -sS -X POST "https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/deploys" "${AUTH[@]}" -H "Content-Type: application/zip" --data-binary "@${ZIP}")
ID=$(printf '%s' "$RESP" | python3 -c "import sys,json;print(json.load(sys.stdin)['id'])")
echo "deploy ${ID} uploaded; waiting…"
for _ in $(seq 1 30); do
  STATE=$(curl -sS "https://api.netlify.com/api/v1/deploys/${ID}" "${AUTH[@]}" | python3 -c "import sys,json;print(json.load(sys.stdin)['state'])")
  [ "$STATE" = "ready" ] && { echo "ready"; exit 0; }
  [ "$STATE" = "error" ] && { echo "deploy failed"; exit 1; }
  sleep 5
done
echo "timed out waiting (state=${STATE})"; exit 1
