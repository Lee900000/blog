#!/bin/bash
# Deploy tago.top only after its GitHub source branch advances.
set -euo pipefail
export PATH="/Users/karp/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
# GitHub access uses the local proxy; SSH/rsync deployment remains direct.
export HTTP_PROXY="http://127.0.0.1:7890"
export HTTPS_PROXY="http://127.0.0.1:7890"
export ALL_PROXY="socks5://127.0.0.1:7890"
export http_proxy="$HTTP_PROXY"
export https_proxy="$HTTPS_PROXY"
export all_proxy="$ALL_PROXY"
export NO_PROXY="127.0.0.1,localhost"

branch="preview/ten-post-migration"
remote_repository="https://github.com/Lee900000/blog.git"
server="root@47.245.29.197"
server_key="/Users/karp/.ssh/hermes_control"
server_root="/opt/webserver/tago"
deployment_checkout="$HOME/.local/share/tago-deploy/repo"
state_directory="$HOME/.local/state/tago-deploy"
state_file="$state_directory/tago-last-deployed"
log_file="$state_directory/tago-auto-deploy.log"
cleanup() { rm -f "$deployment_checkout/_multiconfig.yml"; }
trap cleanup EXIT

mkdir -p "$state_directory"
exec >> "$log_file" 2>&1
printf '\n[%s] checking GitHub deployment branch\n' "$(date '+%Y-%m-%d %H:%M:%S')"

remote_sha="$(git ls-remote "$remote_repository" "refs/heads/$branch" | awk 'NR == 1 { print $1 }')"
if [ -z "$remote_sha" ]; then
  echo "refusing deployment: GitHub branch was not found"
  exit 1
fi

last_deployed=""
if [ -f "$state_file" ]; then
  last_deployed="$(tr -d '[:space:]' < "$state_file")"
fi
if [ "$remote_sha" = "$last_deployed" ]; then
  echo "no GitHub change: $remote_sha"
  exit 0
fi

if [ ! -d "$deployment_checkout/.git" ]; then
  mkdir -p "$(dirname "$deployment_checkout")"
  git clone --single-branch --branch "$branch" "$remote_repository" "$deployment_checkout"
else
  [ "$(git -C "$deployment_checkout" remote get-url origin)" = "$remote_repository" ] || { echo "refusing deployment: unexpected deployment checkout remote"; exit 1; }
  git -C "$deployment_checkout" diff --quiet || { echo "refusing deployment: deployment checkout has local changes"; exit 1; }
  git -C "$deployment_checkout" fetch origin "$branch"
  git -C "$deployment_checkout" checkout "$branch"
  git -C "$deployment_checkout" merge --ff-only "origin/$branch"
fi
cd "$deployment_checkout"

if [ ! -d node_modules ]; then
  npm ci
fi

npm run build:tago
npm test
node tools/verify-article-routes.mjs

backup_name="tago-$(date '+%Y%m%d-%H%M%S').tar.gz"
ssh -i "$server_key" -o BatchMode=yes -o ConnectTimeout=12 "$server" \
  "set -e; mkdir -p /opt/webserver/.tago-backups; tar -C /opt/webserver -czf /opt/webserver/.tago-backups/$backup_name tago"
rsync -a --delete -e "ssh -i $server_key -o BatchMode=yes -o ConnectTimeout=12" \
  public/ "$server:$server_root/"
ssh -i "$server_key" -o BatchMode=yes -o ConnectTimeout=12 "$server" \
  "test -f $server_root/index.html"

# Restore the latest server-side daily aggregate after public/ is refreshed.
ssh -i "$server_key" -o BatchMode=yes -o ConnectTimeout=12 "$server" \
  "test -f /opt/webserver/tago-data/token-usage/bin/aggregate.py && python3 /opt/webserver/tago-data/token-usage/bin/aggregate.py /opt/webserver/tago-data/token-usage/daily $server_root/assets/token-usage.json"

printf '%s\n' "$remote_sha" > "$state_file"
echo "deployed: $remote_sha"
