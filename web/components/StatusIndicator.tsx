"use client";

import { useEffect, useState } from "react";

export function StatusIndicator() {
  const [active, setActive] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => {
      fetch("/api/status")
        .then((r) => r.json())
        .then((d) => setActive(d.active))
        .catch(() => setActive(false));
    };
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  if (active === null) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={`h-2 w-2 rounded-full ${active ? "bg-green-500" : "bg-red-500"}`}
      />
      <span className="text-muted-foreground">
        {active ? "Daemon running" : "Daemon inactive"}
      </span>
    </div>
  );
}
