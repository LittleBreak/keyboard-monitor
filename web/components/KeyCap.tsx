import { getKeyDisplay } from "@/lib/keymap";
import {
  Command,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CornerDownLeft,
  Delete,
  ArrowBigUp,
  ArrowRightToLine,
  Home,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Command,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CornerDownLeft,
  Delete,
  ArrowBigUp,
  ArrowRightToLine,
  Home,
};

interface KeyCapProps {
  keyName: string;
  size?: "sm" | "md";
}

export function KeyCap({ keyName, size = "md" }: KeyCapProps) {
  const display = getKeyDisplay(keyName);
  const Icon = display.icon ? iconMap[display.icon] : null;

  const sizeClasses =
    size === "sm"
      ? "min-w-[24px] h-6 px-1 text-xs"
      : "min-w-[32px] h-8 px-1.5 text-sm";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md border border-border bg-muted font-mono font-medium shadow-sm ${sizeClasses}`}
      title={keyName}
    >
      {Icon ? <Icon size={size === "sm" ? 12 : 14} /> : display.label}
    </span>
  );
}

export function ComboKeyCap({ combo }: { combo: string }) {
  const parts = combo.split("+");
  return (
    <span className="inline-flex items-center gap-0.5">
      {parts.map((part, i) => (
        <span key={i} className="inline-flex items-center gap-0.5">
          {i > 0 && <span className="text-muted-foreground text-xs">+</span>}
          <KeyCap keyName={part} size="sm" />
        </span>
      ))}
    </span>
  );
}
