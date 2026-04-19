# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Keyboard Monitor is a macOS keyboard activity tracker with two components:
- **Daemon** (Swift): Captures keyboard events via CGEvent Tap, writes to SQLite
- **Web Dashboard** (Next.js 15 / React 19 / TypeScript): Visualizes keystroke data

Data flows: CGEvent Tap → Swift daemon → SQLite (`~/.keyboard-monitor/data.db`, WAL mode) → Next.js API routes (better-sqlite3, read-only) → Recharts/shadcn/ui frontend.

## Build & Run Commands

### Daemon (Swift)
```bash
cd daemon && bash build.sh        # Compile with swiftc
bash install.sh                   # Install as LaunchAgent (auto-start)
bash uninstall.sh                 # Remove LaunchAgent
./keyboard-monitor &              # Manual run
```

### Web Dashboard
```bash
cd web
npm install                       # Install dependencies
npm run dev                       # Dev server with Turbopack (localhost:3000)
npm run build                     # Production build
npm start                         # Start production server
npm run lint                      # ESLint
```

## Architecture

The daemon (`daemon/KeyboardMonitor.swift`) sets up a CGEvent Tap to intercept all keyboard events at the kernel level. Events are buffered in memory and batch-flushed to SQLite every 1 second. Requires macOS Accessibility permission.

The web app queries the same SQLite database read-only via `lib/db.ts` → `lib/queries.ts`. API routes under `app/api/stats/` serve daily totals, date ranges, per-key counts, and combo counts. The dashboard page (`app/page.tsx`) orchestrates all visualization components.

### Database Schema (key_events table)
- `timestamp` (INTEGER, ms epoch), `date` (TEXT, YYYY-MM-DD), `key_name` (TEXT), `combo` (TEXT, nullable), `is_combo` (INTEGER, 0/1)
- Indexes on `date`, `(key_name, date)`, `(combo, date)`

## Key Technical Details

- Swift daemon compiles against CoreGraphics, AppKit, and system sqlite3
- Web uses Tailwind CSS v4, shadcn/ui (base-nova style), Recharts for charts
- `lib/keymap.ts` maps macOS keycodes to human-readable key names
- Daemon health check: `app/api/status/route.ts` checks for recent events in DB
