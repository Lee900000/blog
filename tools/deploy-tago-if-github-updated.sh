#!/bin/bash
# Deploy tago.top only after its GitHub source branch advances.
set -euo pipefail
export PATH="/Users/karp/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"

workspace="$(cd "$(dirname "$0")/.." && pwd)"
branch="preview/ten-post-migration"
remote_repository="https://github.com/kary2999/leon-blog-web.git"
server="root@47.245.29.197"
server_key="/Users/karp/.ssh/hermes_control"
server_root="/opt/webserver/tago"
state_directory="$workspace/.deployment-state"
state_file="$state_directory/tago-last-deployed"
log_file="$state_directory/tago-auto-deploy.log"

mkdir -p "$state_directory"
exec >> "$log_file" 2>&1
printf '\n[%s] checking GitHub deployment branch\n' "$(date '+%Y-%m-%d %H:%M:%S')"

cd "$workspace"
if [ -n "$(git status --porcelain)" ]; then
  echo "refusing deployment: workspace has uncommitted changes"
  exit 1
fi

if [ "$(git remote get-url origin)" != "$remote_repository" ]; then
  echo "refusing deployment: origin is not the approved repository"
  exit 1
fi

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

git fetch origin "$branch"
if ! git merge-base --is-ancestor HEAD "$remote_sha"; then
  echo "refusing deployment: GitHub is not a fast-forward from the local checkout"
  exit 1
fi
git merge --ff-only "$remote_sha"

npm test
npm run build:tago
node tools/verify-article-routes.mjs

backup_name="tago-$(date '+%Y%m%d-%H%M%S').tar.gz"
ssh -i "$server_key" -o BatchMode=yes -o ConnectTimeout=12 "$server" \
  "set -e; mkdir -p /opt/webserver/.tago-backups; tar -C /opt/webserver -czf /opt/webserver/.tago-backups/$backup_name tago"
rsync -a --delete -e "ssh -i $server_key -o BatchMode=yes -o ConnectTimeout=12" \
  public/ "$server:$server_root/"
ssh -i "$server_key" -o BatchMode=yes -o ConnectTimeout=12 "$server" \
  "test -f $server_root/index.html"

printf '%s\n' "$remote_sha" > "$state_file"
echo "deployed: $remote_sha"
