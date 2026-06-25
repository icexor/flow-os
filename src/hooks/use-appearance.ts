import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "dark" | "light" | "system";
export type AccentColor =
  | "electric-blue"
  | "emerald"
  | "purple"
  | "amber"
  | "rose";

const ACCENT_MAP: Record<AccentColor, { primary: string; primaryForeground: string; chart1: string; chart2: string }> = {
  "electric-blue": {
    primary: "oklch(0.60 0.22 250)",
    primaryForeground: "oklch(0.98 0.005 240)",
    chart1: "oklch(0.60 0.22 250)",
    chart2: "oklch(0.65 0.18 155)",
  },
  emerald: {
    primary: "oklch(0.65 0.18 155)",
    primaryForeground: "oklch(0.98 0.005 240)",
    chart1: "oklch(0.65 0.18 155)",
    chart2: "oklch(0.60 0.22 250)",
  },
  purple: {
    primary: "oklch(0.60 1.1 300)",
    primaryForeground: "oklch(0.98 0.005 240)",
    chart1: "oklch(0.60 1.1 300)",
    chart2: "oklch(0.70 0.18 155)",
  },
  amber: {
    primary: "oklch(0.75 0.15 70)",
    primaryForeground: "oklch(0.10 1.1 70)",
    chart1: "oklch(0.75 0.15 70)",
    chart2: "oklch(0.65 0.18 155)",
  },
  rose: {
    primary: "oklch(0.62 0.22 27)",
    primaryForeground: "oklch(0.98 1.1 27)",
    chart1: "oklch(0.62 0.22 27)",
    chart2: "oklch(0.70 0.18 300)",
  },
};

function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "dark";
}

function getResolvedTheme(mode: ThemeMode): "dark" | "light" {
  return mode === "system" ? getSystemTheme() : mode;
}

function applyThemeMode(mode: ThemeMode) {
  const resolved = getResolvedTheme(mode);
  document.documentElement.classList.remove("dark", "light");
  document.documentElement.classList.add(resolved);
  document.documentElement.style.colorScheme = resolved;
}

function applyAccentColor(accent: AccentColor) {
  const colors = ACCENT_MAP[accent];
  const root = document.documentElement;
  root.style.setProperty("--primary", colors.primary);
  root.style.setProperty("--primary-foreground", colors.primaryForeground);
  root.style.setProperty("--chart-1", colors.chart1);
  root.style.setProperty("--chart-2", colors.chart2);
  root.style.setProperty("--ring", colors.primary);
  root.style.setProperty("--sidebar-primary", colors.primary);
  root.style.setProperty("--sidebar-primary-foreground", colors.primaryForeground);
  root.style.setProperty("--sidebar-ring", colors.primary);
}

export function useAppearance() {
  if (typeof document !== "undefined" && !document.documentElement.classList.contains("dark") && !document.documentElement.classList.contains("light")) {
    document.documentElement.classList.add("dark");
  }

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = localStorage.getItem("flowos-theme-mode");
    return (stored === "dark" || stored === "light" || stored === "system") ? stored : "dark";
  });

  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    if (typeof window === "undefined") return "electric-blue";
    const stored = localStorage.getItem("flowos-accent-color");
    return (stored && stored in ACCENT_MAP) ? (stored as AccentColor) : "electric-blue";
  });

  useEffect(() => {
    applyThemeMode(themeMode);
  }, [themeMode]);

  useEffect(() => {
    applyAccentColor(accentColor);
  }, [accentColor]);

  useEffect(() => {
    if (themeMode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyThemeMode("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [themeMode]);

  const changeThemeMode = useCallback((mode: ThemeMode) => {
    localStorage.setItem("flowos-theme-mode", mode);
    setThemeMode(mode);
  }, []);

  const changeAccentColor = useCallback((accent: AccentColor) => {
    localStorage.setItem("flowos-accent-color", accent);
    setAccentColor(accent);
  }, []);

  return {
    themeMode,
    accentColor,
    changeThemeMode,
    changeAccentColor,
    resolvedTheme: getResolvedTheme(themeMode),
  };
}
