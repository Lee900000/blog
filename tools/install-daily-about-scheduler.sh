#!/bin/bash
set -euo pipefail

workspace="$(cd "$(dirname "$0")/.." && pwd)"
target="$HOME/.local/share/tago-daily-about"
plist="$HOME/Library/LaunchAgents/top.tago.daily-about-github-sync.plist"
label="top.tago.daily-about-github-sync"

mkdir -p "$target" "$HOME/Library/LaunchAgents" "$HOME/.kimyx-token-usage"
install -m 755 "$workspace/tools/sync-daily-about-to-github.sh" "$target/sync-daily-about-to-github.sh"
install -m 755 "$workspace/tools/run-daily-about-scheduler.sh" "$target/run-daily-about-scheduler.sh"
install -m 644 "$workspace/tools/update-about-maintenance.mjs" "$target/update-about-maintenance.mjs"
install -m 644 "$workspace/tools/about-maintenance.cjs" "$target/about-maintenance.cjs"

if launchctl print "gui/$(id -u)/$label" >/dev/null 2>&1; then
  launchctl bootout "gui/$(id -u)/$label"
fi
cp "$workspace/tools/com.tago.daily-about-github-sync.plist" "$plist"
launchctl bootstrap "gui/$(id -u)" "$plist"
echo "Installed: $target/run-daily-about-scheduler.sh"

