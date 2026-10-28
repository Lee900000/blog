#!/bin/bash
# Local LaunchAgent entry point. The deployment script itself works from an
# isolated GitHub checkout, so it remains safe when the external workspace is
# unavailable to a background macOS job.
set -euo pipefail
script_dir="$(cd "$(dirname "$0")" && pwd)"
exec /bin/bash "$script_dir/deploy-tago-if-github-updated.sh"
