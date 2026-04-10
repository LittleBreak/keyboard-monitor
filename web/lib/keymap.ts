// Map key names to display labels and icon names (lucide-react)
export interface KeyDisplay {
  label: string;
  icon?: string; // lucide-react icon name
}

const keyDisplayMap: Record<string, KeyDisplay> = {
  // Modifiers
  Command: { label: "⌘", icon: "Command" },
  Cmd: { label: "⌘", icon: "Command" },
  Control: { label: "⌃", icon: "ChevronUp" },
  Ctrl: { label: "⌃", icon: "ChevronUp" },
  Option: { label: "⌥", icon: "Option" },
  Alt: { label: "⌥", icon: "Option" },
  Shift: { label: "⇧", icon: "ArrowBigUp" },
  CapsLock: { label: "⇪" },
  Fn: { label: "fn" },

  // Navigation
  Return: { label: "↵", icon: "CornerDownLeft" },
  Enter: { label: "↵", icon: "CornerDownLeft" },
  Tab: { label: "⇥", icon: "ArrowRightToLine" },
  Space: { label: "␣", icon: "Space" },
  Delete: { label: "⌫", icon: "Delete" },
  Escape: { label: "⎋" },

  // Arrows
  Up: { label: "↑", icon: "ArrowUp" },
  Down: { label: "↓", icon: "ArrowDown" },
  Left: { label: "←", icon: "ArrowLeft" },
  Right: { label: "→", icon: "ArrowRight" },

  // Others
  Home: { label: "↖", icon: "Home" },
  End: { label: "↘" },
  PageUp: { label: "⇞" },
  PageDown: { label: "⇟" },
};

export function getKeyDisplay(keyName: string): KeyDisplay {
  return keyDisplayMap[keyName] ?? { label: keyName };
}
