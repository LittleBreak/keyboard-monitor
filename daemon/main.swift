import Foundation

// Handle SIGINT (Ctrl+C) gracefully
signal(SIGINT) { _ in
    print("\n👋 Keyboard Monitor stopped.")
    exit(0)
}

signal(SIGTERM) { _ in
    exit(0)
}

let monitor = KeyboardMonitor()
monitor.start()
