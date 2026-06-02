"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import MaterialIcon from "@/components/MaterialIcon";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className={cn(
          "h-10 w-10 rounded-full border border-card-border bg-card",
          className,
        )}
      />
    );
  }

  const isDark = (resolvedTheme ?? theme) === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border border-card-border bg-card text-foreground transition-all hover:scale-105 hover:border-foreground/20 hover:shadow-md",
        className,
      )}
    >
      <MaterialIcon
        name={isDark ? "light_mode" : "dark_mode"}
        size={18}
      />
    </button>
  );
}
