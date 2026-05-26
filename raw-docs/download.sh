#!/usr/bin/env bash
# Download one URL into docs/<path>.md (called per-URL by xargs)
set -e
url="$1"
path="${url#https://code.claude.com/docs/en/}"
out="docs/$path"
mkdir -p "$(dirname "$out")"
http_code=$(curl -sSL -w "%{http_code}" -o "$out" "$url")
if [ "$http_code" = "200" ]; then
  echo "OK   $path"
else
  echo "FAIL[$http_code] $path"
fi
