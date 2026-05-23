"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => true // server snapshot: assume dark
  );

  function toggle() {
    const newDark = !isDark;
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 border"
      style={{
        fontFamily: "var(--font-mono)",
        borderColor: "var(--border)",
        background: "transparent",
        color: "var(--muted-foreground)",
      }}
      title={isDark ? "Switch to day mode" : "Switch to night mode"}
    >
      {isDark ? <Sun className="size-3" /> : <Moon className="size-3" />}
      <span className="text-[10px] tracking-widest uppercase">
        {isDark ? "Day" : "Night"}
      </span>
    </button>
  );
}
