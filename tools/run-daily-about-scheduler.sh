#!/bin/bash
set -euo pipefail
tools_dir="$(cd "$(dirname "$0")" && pwd)"
exec /bin/bash "$tools_dir/sync-daily-about-to-github.sh"

