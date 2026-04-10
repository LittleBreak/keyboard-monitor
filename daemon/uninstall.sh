#!/bin/bash

PLIST_DST="$HOME/Library/LaunchAgents/com.keyboard-monitor.plist"

if [ -f "$PLIST_DST" ]; then
    launchctl unload "$PLIST_DST" 2>/dev/null || true
    rm "$PLIST_DST"
    echo "✅ Keyboard Monitor LaunchAgent removed."
else
    echo "LaunchAgent not found."
fi

echo ""
echo "Note: Database at ~/.keyboard-monitor/data.db has been preserved."
echo "To remove all data: rm -rf ~/.keyboard-monitor"
