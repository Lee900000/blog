#!/bin/bash
# Install/update the user LaunchAgent that performs the daily Tago site deploy.
set -euo pipefail

workspace="$(cd "$(dirname "$0")/.." && pwd)"
target="$HOME/.local/share/tago-deploy"
plist="$HOME/Library/LaunchAgents/top.tago.site-deploy.plist"
label="top.tago.site-deploy"

mkdir -p "$target" "$HOME/Library/LaunchAgents" "$HOME/.local/state/tago-deploy"
install -m 755 "$workspace/tools/deploy-tago-if-github-updated.sh" "$target/deploy-tago-if-github-updated.sh"
install -m 755 "$workspace/tools/run-tago-deploy-scheduler.sh" "$target/run-tago-deploy-scheduler.sh"

if launchctl print "gui/$(id -u)/$label" >/dev/null 2>&1; then
  launchctl bootout "gui/$(id -u)/$label"
fi
cp "$workspace/tools/com.tago.site-deploy.plist" "$plist"
launchctl bootstrap "gui/$(id -u)" "$plist"
echo "Installed: $target/run-tago-deploy-scheduler.sh"
