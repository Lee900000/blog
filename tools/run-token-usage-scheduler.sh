#!/bin/bash
# Local LaunchAgent entry point. Kept beside its copied helper scripts so
# macOS does not need to grant a background job access to the external disk.
set -euo pipefail
tools_dir="$(cd "$(dirname "$0")" && pwd)"
export TAGO_TOKEN_TOOLS_DIR="$tools_dir"
exec /bin/bash "$tools_dir/sync-token-usage-to-tago.sh"
