import Foundation
import CoreGraphics
import AppKit
import SQLite3
import ApplicationServices

// MARK: - Database

class Database {
    private var db: OpaquePointer?
    private let dbPath: String

    // Buffer for batch writes
    private var eventBuffer: [(timestamp: Int64, date: String, keyName: String, combo: String?, isCombo: Bool)] = []
    private var flushTimer: Timer?

    init() {
        let dir = NSHomeDirectory() + "/.keyboard-monitor"
        let fileManager = FileManager.default
        if !fileManager.fileExists(atPath: dir) {
            try? fileManager.createDirectory(atPath: dir, withIntermediateDirectories: true)
        }
        dbPath = dir + "/data.db"

        guard sqlite3_open(dbPath, &db) == SQLITE_OK else {
            fatalError("Cannot open database at \(dbPath)")
        }

        // Enable WAL mode for concurrent read/write
        exec("PRAGMA journal_mode=WAL")
        exec("PRAGMA synchronous=NORMAL")

        // Create table and indexes
        exec("""
            CREATE TABLE IF NOT EXISTS key_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp INTEGER NOT NULL,
                date TEXT NOT NULL,
                key_name TEXT NOT NULL,
                combo TEXT,
                is_combo INTEGER NOT NULL DEFAULT 0
            )
        """)
        exec("CREATE INDEX IF NOT EXISTS idx_date ON key_events(date)")
        exec("CREATE INDEX IF NOT EXISTS idx_key_name_date ON key_events(key_name, date)")
        exec("CREATE INDEX IF NOT EXISTS idx_combo_date ON key_events(combo, date)")

        print("Database initialized at \(dbPath)")

        // Flush buffer every second
        flushTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            self?.flush()
        }
    }

    func addEvent(keyName: String, combo: String?, isCombo: Bool) {
        let now = Date()
        let timestamp = Int64(now.timeIntervalSince1970 * 1000)
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        let date = formatter.string(from: now)

        eventBuffer.append((timestamp: timestamp, date: date, keyName: keyName, combo: combo, isCombo: isCombo))
    }

    private func flush() {
        guard !eventBuffer.isEmpty else { return }

        let events = eventBuffer
        eventBuffer.removeAll()

        exec("BEGIN TRANSACTION")

        var stmt: OpaquePointer?
        let sql = "INSERT INTO key_events (timestamp, date, key_name, combo, is_combo) VALUES (?, ?, ?, ?, ?)"

        guard sqlite3_prepare_v2(db, sql, -1, &stmt, nil) == SQLITE_OK else {
            print("Failed to prepare insert statement")
            exec("ROLLBACK")
            return
        }

        for event in events {
            sqlite3_bind_int64(stmt, 1, event.timestamp)
            sqlite3_bind_text(stmt, 2, (event.date as NSString).utf8String, -1, nil)
            sqlite3_bind_text(stmt, 3, (event.keyName as NSString).utf8String, -1, nil)
            if let combo = event.combo {
                sqlite3_bind_text(stmt, 4, (combo as NSString).utf8String, -1, nil)
            } else {
                sqlite3_bind_null(stmt, 4)
            }
            sqlite3_bind_int(stmt, 5, event.isCombo ? 1 : 0)

            sqlite3_step(stmt)
            sqlite3_reset(stmt)
        }

        sqlite3_finalize(stmt)
        exec("COMMIT")
    }

    private func exec(_ sql: String) {
        var errMsg: UnsafeMutablePointer<CChar>?
        if sqlite3_exec(db, sql, nil, nil, &errMsg) != SQLITE_OK {
            let error = errMsg != nil ? String(cString: errMsg!) : "unknown error"
            print("SQL error: \(error)")
            sqlite3_free(errMsg)
        }
    }

    deinit {
        flushTimer?.invalidate()
        flush()
        sqlite3_close(db)
    }
}

// MARK: - Keyboard Monitor

class KeyboardMonitor {
    private let database = Database()

    func start() {
        // Try to create event tap directly - permission check via AXIsProcessTrusted
        // may not reflect the actual TCC state for this binary
        let eventMask = (1 << CGEventType.keyDown.rawValue)

        // Try .listenOnly first (works more reliably with TCC)
        var eventTap = CGEvent.tapCreate(
            tap: .cgSessionEventTap,
            place: .headInsertEventTap,
            options: .listenOnly,
            eventsOfInterest: CGEventMask(eventMask),
            callback: { (proxy, type, event, refcon) -> Unmanaged<CGEvent>? in
                guard let refcon = refcon else {
                    return Unmanaged.passRetained(event)
                }
                let monitor = Unmanaged<KeyboardMonitor>.fromOpaque(refcon).takeUnretainedValue()
                monitor.handleKeyEvent(event)
                return Unmanaged.passRetained(event)
            },
            userInfo: Unmanaged.passUnretained(self).toOpaque()
        )

        if eventTap == nil {
            print("""
            ⚠️  Failed to create event tap. Accessibility permission required!

            Please grant permission in:
            System Settings > Privacy & Security > Accessibility

            Add this binary: \(CommandLine.arguments[0])
            """)

            let url = URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility")!
            NSWorkspace.shared.open(url)

            // Wait and retry
            print("Waiting for permission...")
            while eventTap == nil {
                Thread.sleep(forTimeInterval: 3.0)
                eventTap = CGEvent.tapCreate(
                    tap: .cgSessionEventTap,
                    place: .headInsertEventTap,
                    options: .listenOnly,
                    eventsOfInterest: CGEventMask(eventMask),
                    callback: { (proxy, type, event, refcon) -> Unmanaged<CGEvent>? in
                        guard let refcon = refcon else {
                            return Unmanaged.passRetained(event)
                        }
                        let monitor = Unmanaged<KeyboardMonitor>.fromOpaque(refcon).takeUnretainedValue()
                        monitor.handleKeyEvent(event)
                        return Unmanaged.passRetained(event)
                    },
                    userInfo: Unmanaged.passUnretained(self).toOpaque()
                )
            }
            print("✅ Permission granted!")
        }

        // Add to run loop
        let runLoopSource = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, eventTap!, 0)
        CFRunLoopAddSource(CFRunLoopGetCurrent(), runLoopSource, .commonModes)
        CGEvent.tapEnable(tap: eventTap!, enable: true)

        print("🎹 Keyboard Monitor started. Press Ctrl+C to stop.")

        // Keep running
        CFRunLoopRun()
    }

    private func handleKeyEvent(_ event: CGEvent) {
        let keycode = event.getIntegerValueField(.keyboardEventKeycode)
        let flags = event.flags

        let key = keyName(for: keycode)

        // Build modifier prefix
        var modifiers: [String] = []
        if flags.contains(.maskControl) { modifiers.append("Ctrl") }
        if flags.contains(.maskAlternate) { modifiers.append("Option") }
        if flags.contains(.maskShift) { modifiers.append("Shift") }
        if flags.contains(.maskCommand) { modifiers.append("Cmd") }

        let isCombo = !modifiers.isEmpty
        var combo: String? = nil

        if isCombo {
            modifiers.append(key)
            combo = modifiers.joined(separator: "+")
        }

        database.addEvent(keyName: key, combo: combo, isCombo: isCombo)
    }
}

