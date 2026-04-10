#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BINARY_PATH="$SCRIPT_DIR/keyboard-monitor"
PLIST_SRC="$SCRIPT_DIR/com.keyboard-monitor.plist"
PLIST_DST="$HOME/Library/LaunchAgents/com.keyboard-monitor.plist"
DATA_DIR="$HOME/.keyboard-monitor"

# Build if needed
if [ ! -f "$BINARY_PATH" ]; then
    echo "Binary not found, building..."
    bash "$SCRIPT_DIR/build.sh"
fi

# Create data directory
mkdir -p "$DATA_DIR"

# Install plist with correct paths
sed -e "s|__BINARY_PATH__|$BINARY_PATH|g" \
    -e "s|__HOME__|$HOME|g" \
    "$PLIST_SRC" > "$PLIST_DST"

# Load the LaunchAgent
launchctl unload "$PLIST_DST" 2>/dev/null || true
launchctl load "$PLIST_DST"

echo "✅ Keyboard Monitor installed and started."
echo ""
echo "Logs: $DATA_DIR/stdout.log"
echo "Database: $DATA_DIR/data.db"
echo ""
echo "⚠️  Remember to grant Accessibility permission in:"
echo "   System Settings > Privacy & Security > Accessibility"

# Open Accessibility settings
open "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility"
