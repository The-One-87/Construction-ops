"use client";
import React from "react";

export function ThemeToggle() {
  const [mode, setMode] = React.useState<"dark"|"light">("dark");

  React.useEffect(() => {
    const saved = (localStorage.getItem("theme") as any) || "dark";
    setMode(saved);
    document.documentElement.dataset.theme = saved;
  }, []);

  const toggle = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    localStorage.setItem("theme", next);
    document.documentElement.dataset.theme = next;
  };

  return (
    <button onClick={toggle} className="glass-weak rim-lit px-3 py-2 text-xs text-white/80 hover:bg-white/10 active:scale-[0.98] transition">
      {mode === "dark" ? "Dark" : "Light"}
    </button>
  );
}
