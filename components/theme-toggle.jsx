"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="border border-orange-200 hover:border-orange-300 hover:bg-orange-50 active:bg-orange-100 transition-all duration-200 dark:border-orange-800 dark:hover:border-orange-700 dark:hover:bg-orange-900/20 dark:active:bg-orange-900/30"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-600 dark:text-orange-400" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-orange-600 dark:text-orange-400" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
