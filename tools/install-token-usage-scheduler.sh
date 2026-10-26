#!/bin/bash
# Install/update the local copy used by the 08:00 LaunchAgent.
set -euo pipefail
workspace="$(cd "$(dirname "$0")/.." && pwd)"
target="$HOME/.local/share/tago-token-usage"
plist="$HOME/Library/LaunchAgents/top.tago.token-usage-sync.plist"
mkdir -p "$target" "$HOME/Library/LaunchAgents"
install -m 755 "$workspace/tools/sync-token-usage-to-tago.sh" "$target/sync-token-usage-to-tago.sh"
install -m 755 "$workspace/tools/run-token-usage-scheduler.sh" "$target/run-token-usage-scheduler.sh"
install -m 644 "$workspace/tools/export-token-usage.mjs" "$target/export-token-usage.mjs"
install -m 644 "$workspace/tools/update-about-maintenance.mjs" "$target/update-about-maintenance.mjs"
install -m 644 "$workspace/tools/about-maintenance.cjs" "$target/about-maintenance.cjs"
install -m 644 "$workspace/tools/token-usage.cjs" "$target/token-usage.cjs"
install -m 644 "$workspace/tools/remote-token-usage-aggregate.py" "$target/remote-token-usage-aggregate.py"
if launchctl print "gui/$(id -u)/top.tago.token-usage-sync" >/dev/null 2>&1; then
  launchctl bootout "gui/$(id -u)/top.tago.token-usage-sync"
fi
cp "$workspace/tools/com.tago.token-usage-sync.plist" "$plist"
launchctl bootstrap "gui/$(id -u)" "$plist"
echo "Installed: $target/run-token-usage-scheduler.sh"

