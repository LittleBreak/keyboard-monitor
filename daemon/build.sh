#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "Building Keyboard Monitor daemon..."

swiftc -O \
    -o keyboard-monitor \
    main.swift \
    keycode-map.swift \
    KeyboardMonitor.swift \
    -framework CoreGraphics \
    -framework AppKit \
    -lsqlite3

echo "✅ Build successful: $SCRIPT_DIR/keyboard-monitor"
echo ""
echo "To run: ./keyboard-monitor"
echo "Note: Accessibility permission is required."
