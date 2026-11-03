#!/bin/bash
# Keep a dedicated, disposable local clone for the daily About-page maintenance commit.
set -euo pipefail

export PATH="/Users/karp/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
# GitHub access uses the local proxy; this job has no server deployment traffic.
export HTTP_PROXY="http://127.0.0.1:7890"
export HTTPS_PROXY="http://127.0.0.1:7890"
export ALL_PROXY="socks5://127.0.0.1:7890"
export http_proxy="$HTTP_PROXY"
export https_proxy="$HTTPS_PROXY"
export all_proxy="$ALL_PROXY"
export NO_PROXY="127.0.0.1,localhost"
repository="https://github.com/kary2999/leon-blog-web.git"
branch="preview/ten-post-migration"
account="kary2999"
root="${TAGO_DAILY_ABOUT_ROOT:-$HOME/.local/share/tago-daily-about}"
checkout="$root/repo"
marker="source/assets/about-maintenance.json"
script_dir="$(cd "$(dirname "$0")" && pwd)"

mkdir -p "$root"

if [ ! -d "$checkout/.git" ]; then
  git clone --single-branch --branch "$branch" "$repository" "$checkout"
else
  [ "$(git -C "$checkout" remote get-url origin)" = "$repository" ] || { echo "refusing: unexpected daily checkout remote" >&2; exit 1; }
  git -C "$checkout" diff --quiet || { echo "refusing: daily checkout has local changes" >&2; exit 1; }
  git -C "$checkout" fetch origin "$branch"
  git -C "$checkout" checkout "$branch"
  # This checkout is disposable and only ever contains this task's single-file
  # maintenance commit. Resetting prevents a rejected concurrent push from
  # leaving tomorrow's scheduled run permanently behind the remote branch.
  git -C "$checkout" reset --hard "origin/$branch"
fi

[ "$(gh api user --jq .login)" = "$account" ] || { echo "refusing: expected GitHub account $account" >&2; exit 1; }
node "$script_dir/update-about-maintenance.mjs" "$checkout/$marker"

git -C "$checkout" add -- "$marker"
if git -C "$checkout" diff --cached --quiet -- "$marker"; then
  echo "Daily About marker already recorded."
  exit 0
fi

git -C "$checkout" -c user.name="Lee" -c user.email="axon90000@gmail.com" commit -m "chore: record daily about maintenance"
git -C "$checkout" push origin "HEAD:$branch"
echo "Daily About maintenance pushed to kary2999/leon-blog-web ($branch)."
