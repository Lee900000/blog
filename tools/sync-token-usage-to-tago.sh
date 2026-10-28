#!/bin/bash
# Publishes aggregate-only Token statistics. It never copies raw chat logs.
set -euo pipefail
export PATH="/Users/karp/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
export GIT_TERMINAL_PROMPT=0

workspace="${TAGO_TOKEN_TOOLS_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
node_bin="${NODE_BIN:-/Users/karp/.local/bin/node}"
exporter="$workspace/export-token-usage.mjs"
[ -f "$exporter" ] || exporter="$workspace/tools/export-token-usage.mjs"
about_updater="$workspace/update-about-maintenance.mjs"
[ -f "$about_updater" ] || about_updater="$workspace/tools/update-about-maintenance.mjs"
remote_aggregator="$workspace/remote-token-usage-aggregate.py"
[ -f "$remote_aggregator" ] || remote_aggregator="$workspace/tools/remote-token-usage-aggregate.py"
repository="https://github.com/kary2999/leon-blog-web.git"
branch="preview/ten-post-migration"
github_checkout_root="${TAGO_TOKEN_GITHUB_ROOT:-$HOME/.local/share/tago-token-github}"
checkout="$github_checkout_root/repo"
token_asset="source/assets/token-usage.json"
about_marker="source/assets/about-maintenance.json"
server="root@47.245.29.197"
key="/Users/karp/.ssh/hermes_control"
remote_data="/opt/webserver/tago-data/token-usage"
remote_site="/opt/webserver/tago"
temporary="$(mktemp -d /tmp/tago-token-usage.XXXXXX)"
cleanup() { rm -rf -- "$temporary"; }
trap cleanup EXIT

"$node_bin" "$exporter" "$temporary/report.json"

# Publish the exact About-page data through GitHub from an isolated clone. This
# avoids committing unrelated, in-progress work in the active blog workspace.
mkdir -p "$github_checkout_root"
if [ ! -d "$checkout/.git" ]; then
  git clone --single-branch --branch "$branch" "$repository" "$checkout"
else
  [ "$(git -C "$checkout" remote get-url origin)" = "$repository" ] || { echo "refusing: unexpected Token checkout remote" >&2; exit 1; }
  git -C "$checkout" diff --quiet || { echo "refusing: Token checkout has local changes" >&2; exit 1; }
  git -C "$checkout" fetch origin "$branch"
  git -C "$checkout" checkout "$branch"
  git -C "$checkout" merge --ff-only "origin/$branch"
fi
[ "$(gh api user --jq .login)" = "kary2999" ] || { echo "refusing: expected GitHub account kary2999" >&2; exit 1; }
cp "$temporary/report.json" "$checkout/$token_asset"
"$node_bin" "$about_updater" "$checkout/$about_marker"
git -C "$checkout" add -- "$token_asset" "$about_marker"
if ! git -C "$checkout" diff --cached --quiet -- "$token_asset" "$about_marker"; then
  git -C "$checkout" -c user.name="Lee" -c user.email="axon90000@gmail.com" commit -m "chore: sync daily Token usage"
  git -C "$checkout" push origin "HEAD:$branch"
  echo "About Token data pushed to kary2999/leon-blog-web ($branch)."
fi

python3 - "$temporary/report.json" "$temporary" <<'PY'
import json, os, sys
source, destination = sys.argv[1:]
with open(source, encoding='utf-8') as handle:
    daily = json.load(handle)['daily']
for date, usage in daily.items():
    if not isinstance(usage, dict):
        continue
    with open(os.path.join(destination, f'{date}.json'), 'w', encoding='utf-8') as handle:
        json.dump({'date': date, 'usage': usage}, handle, ensure_ascii=False, separators=(',', ':'))
PY

ssh -i "$key" -o BatchMode=yes -o ConnectTimeout=12 "$server" "mkdir -p '$remote_data/daily' '$remote_data/bin' '$remote_site/assets'"
rsync -a --delete -e "ssh -i $key -o BatchMode=yes -o ConnectTimeout=12" "$temporary/" "$server:$remote_data/daily/"
scp -i "$key" -o BatchMode=yes -o ConnectTimeout=12 "$remote_aggregator" "$server:$remote_data/bin/aggregate.py"
ssh -i "$key" -o BatchMode=yes -o ConnectTimeout=12 "$server" "python3 '$remote_data/bin/aggregate.py' '$remote_data/daily' '$remote_site/assets/token-usage.json'"
echo "Token usage data synced to $server:$remote_site/assets/token-usage.json"
