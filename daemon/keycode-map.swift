// macOS virtual keycode to human-readable key name mapping
// Reference: Carbon/Events.h (kVK_* constants)

let keycodeMap: [Int64: String] = [
    // Letters
    0: "A", 1: "S", 2: "D", 3: "F", 4: "H",
    5: "G", 6: "Z", 7: "X", 8: "C", 9: "V",
    11: "B", 12: "Q", 13: "W", 14: "E", 15: "R",
    16: "Y", 17: "T", 18: "1", 19: "2", 20: "3",
    21: "4", 22: "6", 23: "5", 24: "=", 25: "9",
    26: "7", 27: "-", 28: "8", 29: "0", 30: "]",
    31: "O", 32: "U", 33: "[", 34: "I", 35: "P",
    37: "L", 38: "J", 39: "'", 40: "K", 41: ";",
    42: "\\", 43: ",", 44: "/", 45: "N", 46: "M",
    47: ".",

    // Special keys
    36: "Return", 48: "Tab", 49: "Space", 51: "Delete",
    53: "Escape", 71: "Clear", 76: "Enter",

    // Modifiers (as standalone key presses)
    55: "Command", 56: "Shift", 57: "CapsLock",
    58: "Option", 59: "Control", 60: "RightShift",
    61: "RightOption", 62: "RightControl", 63: "Fn",

    // Function keys
    122: "F1", 120: "F2", 99: "F3", 118: "F4",
    96: "F5", 97: "F6", 98: "F7", 100: "F8",
    101: "F9", 109: "F10", 103: "F11", 111: "F12",
    105: "F13", 107: "F14", 113: "F15", 106: "F16",
    64: "F17", 79: "F18", 80: "F19", 90: "F20",

    // Arrow keys
    123: "Left", 124: "Right", 125: "Down", 126: "Up",

    // Navigation
    115: "Home", 119: "End", 116: "PageUp", 121: "PageDown",
    114: "Help",

    // Numpad
    65: "Numpad.", 67: "Numpad*", 69: "Numpad+",
    75: "Numpad/", 78: "Numpad-", 81: "Numpad=",
    82: "Numpad0", 83: "Numpad1", 84: "Numpad2",
    85: "Numpad3", 86: "Numpad4", 87: "Numpad5",
    88: "Numpad6", 89: "Numpad7", 91: "Numpad8",
    92: "Numpad9",

    // Media keys
    10: "§", 50: "`",
]

func keyName(for keycode: Int64) -> String {
    return keycodeMap[keycode] ?? "Key\(keycode)"
}
