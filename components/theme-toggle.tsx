import { useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle({ variant = "default" }: { variant?: "default" | "header" }) {
    const { theme, setTheme } = useTheme()

    return (
        <button
            className={`h-9 w-9 flex items-center justify-center rounded-full transition-colors ${variant === "header"
                ? "bg-white/20 text-white hover:bg-white/30"
                : "bg-muted text-foreground hover:bg-muted/80"
                }`}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Cambiar tema</span>
        </button>
    )
}
